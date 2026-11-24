// Reversible unchanged-source rendering control. Never writes reference captures.
const fs=require('node:fs'),path=require('node:path'),{spawnSync,execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website'),base=path.join(__dirname,'projects-baseline'),backup=path.join(base,'control-source-backup.json');
const files=['src/app/projects/page.tsx','src/components/projects/ProjectsList.tsx','src/components/projects/ProjectCard.tsx','src/app/projects/page.module.css'];
if(fs.existsSync(backup))throw Error('Recover the existing source backup before running a control');
const saved=Object.fromEntries(files.map(file=>[file,fs.existsSync(path.join(front,file))?fs.readFileSync(path.join(front,file),'utf8'):null]));fs.writeFileSync(backup,JSON.stringify(saved));
const run=(name,args,cwd)=>{const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1200000,maxBuffer:20*1024*1024});fs.writeFileSync(path.join(base,name+'.log'),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));console.log(name,r.status);return r.status;};
try{
 for(const file of files)fs.writeFileSync(path.join(front,file),execFileSync('git',['show','53f718e7:Frontend/ece-website/'+file],{cwd:root}));
 if(run('control-build',[path.join(front,'node_modules/next/dist/bin/next'),'build','--webpack'],front)!==0)throw Error('Control build failed');
 if(run('control-normalize',['scripts/normalize-export.mjs'],front)!==0)throw Error('Control export normalization failed');
 const code=run('control-check',['docs/projects-check.cjs','after','--control'],root);fs.writeFileSync(path.join(base,'control-summary.json'),JSON.stringify({checkpoint:'53f718e7',exitCode:code,sourceHashesVerified:files.every(file=>fs.readFileSync(path.join(front,file),'utf8').replace(/\r\n/g,'\n')===execFileSync('git',['show','53f718e7:Frontend/ece-website/'+file],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n'))},null,2));
}finally{for(const [file,value]of Object.entries(saved)){if(value===null)fs.unlinkSync(path.join(front,file));else fs.writeFileSync(path.join(front,file),value);}fs.unlinkSync(backup);if(run('restored-build',[path.join(front,'node_modules/next/dist/bin/next'),'build','--webpack'],front)!==0||run('restored-normalize',['scripts/normalize-export.mjs'],front)!==0)throw Error('Restored production build failed');}
