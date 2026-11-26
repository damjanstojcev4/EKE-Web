// Capture the real checkpoint source, restoring the migration even on failure.
const fs=require('node:fs'),path=require('node:path'),{spawnSync,execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website'),base=path.join(__dirname,'training-baseline'),files=['src/app/training/page.tsx','src/components/SessionListings.tsx','src/app/training/page.module.css'],saved=new Map(files.map(f=>[f,fs.existsSync(path.join(front,f))?fs.readFileSync(path.join(front,f)):null]));
const run=(args,cwd,log)=>{const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1800000,maxBuffer:20*1024*1024});fs.writeFileSync(path.join(base,log),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));console.log(log,r.status);if(r.status!==0)throw Error(log+' failed');};
const build=prefix=>{run(['node_modules/next/dist/bin/next','build','--webpack'],front,prefix+'-build.log');run(['scripts/normalize-export.mjs'],front,prefix+'-normalize.log');};
let error;try{
 for(const file of files)fs.writeFileSync(path.join(front,file),execFileSync('git',['show','1c18dd26:Frontend/ece-website/'+file],{cwd:root}));
 if(fs.existsSync(path.join(base,'control'))&&!fs.existsSync(path.join(base,'initial-control')))fs.renameSync(path.join(base,'control'),path.join(base,'initial-control'));
 build('control');run([path.join(__dirname,'project-detail-edge.cjs'),path.join(__dirname,'training-check.cjs'),'after','--control','--offline'],root,'control.log');
}catch(e){error=e;}finally{for(const [file,bytes]of saved){if(bytes)fs.writeFileSync(path.join(front,file),bytes);else fs.unlinkSync(path.join(front,file));}build('restored');}
if(error)throw error;
