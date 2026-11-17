$ErrorActionPreference = 'Stop'
$appDir = Split-Path -Parent $PSScriptRoot
$repoDir = (Resolve-Path (Join-Path $appDir '../..')).Path
$backendDir = Join-Path $repoDir 'Backend/ece-website'
$jar = Join-Path $backendDir 'target/ece-website-0.0.1-SNAPSHOT.jar'
if (-not (Test-Path -LiteralPath $jar)) { throw 'Package the backend before running this test.' }
if (-not (Test-Path -LiteralPath (Join-Path $appDir 'out/login/index.html'))) { throw 'Build the frontend static export before running this test.' }
$runDir = Join-Path $backendDir ('target/admin-e2e-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $runDir | Out-Null
$names = @('SERVER_ADDRESS','SERVER_PORT','SPRING_DATASOURCE_URL','SPRING_DATASOURCE_USERNAME','SPRING_DATASOURCE_PASSWORD','SPRING_JPA_HIBERNATE_DDL_AUTO','SPRING_H2_CONSOLE_ENABLED','SPRING_MAIL_HOST','SPRING_MAIL_PORT','SPRING_MAIL_USERNAME','MAIL_PASSWORD','APP_JWT_SECRET','APP_BOOTSTRAP_ADMIN_USERNAME','APP_BOOTSTRAP_ADMIN_PASSWORD','APP_AUTH_COOKIE_SECURE','API_PROXY_TARGET','PORT','ADMIN_QA_BASE_URL','ADMIN_QA_USERNAME','ADMIN_QA_PASSWORD')
$previous = @{}
foreach ($name in $names) { $previous[$name] = [Environment]::GetEnvironmentVariable($name, 'Process') }
$backendProcess = $null
$frontendProcess = $null
try {
  $env:SERVER_ADDRESS = '127.0.0.1'
  $env:SERVER_PORT = '18184'
  $env:SPRING_DATASOURCE_URL = 'jdbc:h2:mem:admin_e2e;DB_CLOSE_DELAY=-1'
  $env:SPRING_DATASOURCE_USERNAME = 'sa'
  $env:SPRING_DATASOURCE_PASSWORD = ''
  $env:SPRING_JPA_HIBERNATE_DDL_AUTO = 'create-drop'
  $env:SPRING_H2_CONSOLE_ENABLED = 'false'
  $env:SPRING_MAIL_HOST = '127.0.0.1'
  $env:SPRING_MAIL_PORT = '9'
  $env:SPRING_MAIL_USERNAME = 'e2e'
  $env:MAIL_PASSWORD = 'unused-no-mail-sent'
  $env:APP_JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
  $env:APP_BOOTSTRAP_ADMIN_USERNAME = 'qa-' + [Guid]::NewGuid().ToString('N')
  $env:APP_BOOTSTRAP_ADMIN_PASSWORD = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
  $env:APP_AUTH_COOKIE_SECURE = 'false'
  $env:ADMIN_QA_USERNAME = $env:APP_BOOTSTRAP_ADMIN_USERNAME
  $env:ADMIN_QA_PASSWORD = $env:APP_BOOTSTRAP_ADMIN_PASSWORD
  $env:ADMIN_QA_BASE_URL = 'http://127.0.0.1:3114'
  $env:PORT = '3114'
  $env:API_PROXY_TARGET = 'http://127.0.0.1:18184'
  $backendProcess = Start-Process -FilePath (Get-Command java).Source -ArgumentList '-jar', $jar -WorkingDirectory $runDir -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runDir 'backend.log') -RedirectStandardError (Join-Path $runDir 'backend-error.log')
  $frontendProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList 'scripts/serve.mjs' -WorkingDirectory $appDir -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runDir 'frontend.log') -RedirectStandardError (Join-Path $runDir 'frontend-error.log')
  $deadline = [DateTime]::UtcNow.AddSeconds(90)
  $ready = $false
  while ([DateTime]::UtcNow -lt $deadline) {
    if ($backendProcess.HasExited -or $frontendProcess.HasExited) { throw "A test server exited. Inspect logs in $runDir" }
    try {
      $response = Invoke-WebRequest -Uri ($env:ADMIN_QA_BASE_URL + '/api/auth/csrf') -TimeoutSec 2
      if ($response.StatusCode -eq 200) { $ready = $true; break }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $ready) { throw "Test servers did not become ready. Inspect logs in $runDir" }
  Push-Location $appDir
  try {
    node design/admin-qa.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Admin integration browser tests failed.' }
  } finally { Pop-Location }
} finally {
  if ($null -ne $frontendProcess -and -not $frontendProcess.HasExited) { Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue }
  if ($null -ne $backendProcess -and -not $backendProcess.HasExited) { Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue }
  foreach ($name in $names) { [Environment]::SetEnvironmentVariable($name, $previous[$name], 'Process') }
}
