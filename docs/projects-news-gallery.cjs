// Revalidate the existing real React Sidebar gallery, then restore a normal export.
const {spawnSync}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website');
const run=(args,cwd)=>{const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1200000,maxBuffer:20*1024*1024});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');if(r.status!==0)throw Error('Command failed: '+args.join(' '));};
const build=()=>{run([path.join(front,'node_modules/next/dist/bin/next'),'build','--webpack'],front);run(['scripts/normalize-export.mjs'],front);};
try{run(['docs/news-detail-fixture.cjs','after'],root);build();run(['docs/news-detail-check.cjs','after'],root);fs.copyFileSync(path.join(__dirname,'news-detail-baseline/after/comparison.json'),path.join(__dirname,'projects-baseline/news-components.json'));}
finally{run(['docs/news-detail-fixture.cjs','remove'],root);build();}
