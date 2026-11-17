param([string]$InitialAdminUsername)
$ErrorActionPreference = 'Stop'
$appDir = Split-Path -Parent $PSScriptRoot
$repoDir = (Resolve-Path (Join-Path $appDir '../..')).Path
$jar = Join-Path $repoDir 'Backend/ece-website/target/ece-website-0.0.1-SNAPSHOT.jar'
if (-not (Test-Path -LiteralPath $jar)) { throw 'Package the backend first.' }
if (-not (Test-Path -LiteralPath (Join-Path $appDir 'out/login/index.html'))) { throw 'Build the frontend first.' }
$runtimeDir = Join-Path $env:LOCALAPPDATA 'EKE-Staging'
$settingsPath = Join-Path $runtimeDir 'settings.json'
$newAccount = -not (Test-Path -LiteralPath $settingsPath)
if ($newAccount -and -not $InitialAdminUsername) { throw 'Provide InitialAdminUsername for the first setup.' }
foreach ($port in @(18081, 3104)) {
  if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { throw "Port $port is already in use. Stop the existing local service before restarting." }
}
if ($newAccount) {
  New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $acl = [Security.AccessControl.DirectorySecurity]::new()
  $acl.SetOwner($identity.User)
  $acl.SetAccessRuleProtection($true, $false)
  $rule = [Security.AccessControl.FileSystemAccessRule]::new($identity.User, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
  $acl.AddAccessRule($rule)
  Set-Acl -LiteralPath $runtimeDir -AclObject $acl
  $settings = @{ jwtSecret = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)); username = $InitialAdminUsername }
  $initialPassword = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(24)).Replace('+','-').Replace('/','_')
} else {
  $settings = Get-Content -LiteralPath $settingsPath -Raw | ConvertFrom-Json -AsHashtable
  $initialPassword = ''
}
$envNames = @('SERVER_ADDRESS','SERVER_PORT','SPRING_DATASOURCE_URL','SPRING_DATASOURCE_USERNAME','SPRING_DATASOURCE_PASSWORD','SPRING_JPA_HIBERNATE_DDL_AUTO','SPRING_H2_CONSOLE_ENABLED','SPRING_MAIL_HOST','SPRING_MAIL_PORT','SPRING_MAIL_USERNAME','MAIL_PASSWORD','APP_JWT_SECRET','APP_BOOTSTRAP_ADMIN_USERNAME','APP_BOOTSTRAP_ADMIN_PASSWORD','APP_AUTH_COOKIE_SECURE','API_PROXY_TARGET','PORT')
$previous = @{}
foreach ($name in $envNames) { $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process') }
$backendProcess = $null
$frontendProcess = $null
$succeeded = $false
try {
  $env:SERVER_ADDRESS = '127.0.0.1'
  $env:SERVER_PORT = '18081'
  $env:SPRING_DATASOURCE_URL = 'jdbc:h2:file:' + (Join-Path $runtimeDir 'data/staging').Replace('\','/')
  $env:SPRING_DATASOURCE_USERNAME = 'sa'
  $env:SPRING_DATASOURCE_PASSWORD = ''
  $env:SPRING_JPA_HIBERNATE_DDL_AUTO = 'update'
  $env:SPRING_H2_CONSOLE_ENABLED = 'false'
  $env:SPRING_MAIL_HOST = '127.0.0.1'
  $env:SPRING_MAIL_PORT = '9'
  $env:SPRING_MAIL_USERNAME = 'local-preview'
  $env:MAIL_PASSWORD = 'unused-no-external-mail'
  $env:APP_JWT_SECRET = $settings.jwtSecret
  $env:APP_BOOTSTRAP_ADMIN_USERNAME = if ($newAccount) { $settings.username } else { '' }
  $env:APP_BOOTSTRAP_ADMIN_PASSWORD = $initialPassword
  $env:APP_AUTH_COOKIE_SECURE = 'false'
  $env:PORT = '3104'
  $env:API_PROXY_TARGET = 'http://127.0.0.1:18081'
  $backendProcess = Start-Process -FilePath (Get-Command java).Source -ArgumentList '-jar', $jar -WorkingDirectory $runtimeDir -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeDir 'backend.log') -RedirectStandardError (Join-Path $runtimeDir 'backend-error.log')
  $frontendProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList 'scripts/serve.mjs' -WorkingDirectory $appDir -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runtimeDir 'frontend.log') -RedirectStandardError (Join-Path $runtimeDir 'frontend-error.log')
  $deadline = [DateTime]::UtcNow.AddSeconds(90)
  $ready = $false
  $session = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
  while ([DateTime]::UtcNow -lt $deadline) {
    if ($backendProcess.HasExited -or $frontendProcess.HasExited) { throw "A local service exited. Inspect logs in $runtimeDir" }
    try {
      $csrf = Invoke-RestMethod -Uri 'http://127.0.0.1:3104/api/auth/csrf' -WebSession $session -TimeoutSec 2
      if ($csrf.token) { $ready = $true; break }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $ready) { throw "Local services did not become ready. Inspect logs in $runtimeDir" }
  if ($newAccount) {
    $payload = @{ username = $settings.username; password = $initialPassword } | ConvertTo-Json
    $identity = Invoke-RestMethod -Uri 'http://127.0.0.1:3104/api/auth/authenticate' -Method Post -WebSession $session -ContentType 'application/json' -Headers @{ $csrf.headerName = $csrf.token } -Body $payload
    if ($identity.username -ne $settings.username -or $identity.role -ne 'ADMIN') { throw 'Initial administrator verification failed.' }
    $settings | ConvertTo-Json | Set-Content -LiteralPath $settingsPath
  }
  @{ backendPid = $backendProcess.Id; frontendPid = $frontendProcess.Id } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runtimeDir 'processes.json')
  $succeeded = $true
  [pscustomobject]@{ url = 'http://127.0.0.1:3104/login/'; username = $settings.username; initialPassword = $initialPassword; accountCreated = $newAccount; runtimeDirectory = $runtimeDir } | ConvertTo-Json
} finally {
  if (-not $succeeded) {
    if ($null -ne $frontendProcess -and -not $frontendProcess.HasExited) { Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue }
    if ($null -ne $backendProcess -and -not $backendProcess.HasExited) { Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue }
  }
  foreach ($name in $envNames) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}
