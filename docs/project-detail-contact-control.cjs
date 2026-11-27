// Source-independent diagnosis for the prior Contact NVIDIA capture. Always restore.
const fs=require('node:fs'),path=require('node:path'),{execFileSync,spawnSync}=require('node:child_process');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website'),probe=process.argv.includes('--probe'),out=path.join(__dirname,'project-detail-baseline',probe?'prior-unchanged-probe':'prior-unchanged-control');fs.mkdirSync(out,{recursive:true});
const files=['src/components/project-details/PublicProject.tsx','src/app/projects/[slug]/page.module.css'],backup=path.join(__dirname,'project-detail-baseline/control-source-backup.json');if(fs.existsSync(backup))throw Error('Existing source backup needs recovery');
const saved=Object.fromEntries(files.map(file=>[file,fs.existsSync(path.join(front,file))?fs.readFileSync(path.join(front,file),'utf8'):null]));fs.writeFileSync(backup,JSON.stringify(saved));
const old=file=>execFileSync('git',['show','81ae68bd:Frontend/ece-website/'+file],{cwd:root,encoding:'utf8'});
const run=(name,args,cwd)=>{const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1200000,maxBuffer:20*1024*1024});fs.writeFileSync(path.join(out,name+'.log'),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));console.log(name,r.status);return r.status;};
const build=name=>{if(run(name+'-build',['node_modules/next/dist/bin/next','build','--webpack'],front)!==0||run(name+'-normalize',['scripts/normalize-export.mjs'],front)!==0)throw Error(name+' build failed');};
try{
 for(const file of files)fs.writeFileSync(path.join(front,file),old(file));build('unchanged');
 const code=run('contact-real',probe?['docs/project-detail-contact-probe.cjs']:['docs/contact-check.cjs','after','--real'],root);
 const verified=files.every(file=>fs.readFileSync(path.join(front,file),'utf8').replace(/\r\n/g,'\n')===old(file).replace(/\r\n/g,'\n'));
 if(probe){for(const file of ['probe.json.gz','summary.json'])fs.copyFileSync(path.join(__dirname,'project-detail-baseline/contact-raster-probe',file),path.join(out,file));}
 else for(const file of ['comparison.json','manifest.json.gz','1440-download-focus.png'])fs.copyFileSync(path.join(__dirname,'contact-baseline/after-real',file),path.join(out,file));
 fs.writeFileSync(path.join(out,'source-verification.json'),JSON.stringify({checkpoint:'81ae68bd',originalDetailSourceVerified:verified,contactExitCode:code},null,2));
}finally{
 for(const [file,value]of Object.entries(saved)){if(value===null)fs.unlinkSync(path.join(front,file));else fs.writeFileSync(path.join(front,file),value);}fs.unlinkSync(backup);build('restored');
}
