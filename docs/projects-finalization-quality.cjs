const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const front=path.join(__dirname,'../Frontend/ece-website'),out=path.join(__dirname,'projects-baseline/finalization');
const checks=[
 ['lint',['node_modules/eslint/bin/eslint.js','src']],
 ['typecheck',['node_modules/typescript/bin/tsc','--noEmit']],
 ['test:seo',['--experimental-strip-types','--test','tests/seo.test.mjs']],
 ['verify:seo',['--experimental-strip-types','scripts/verify-seo.mjs']]
];
const results=[];for(const [name,args]of checks){const r=spawnSync(process.execPath,args,{cwd:front,encoding:'utf8',timeout:300000,maxBuffer:10*1024*1024});fs.writeFileSync(path.join(out,name.replace(':','-')+'.log'),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));results.push({name,command:['node',...args],exitCode:r.status,...(r.error?{error:r.error.message}:{})});console.log(name,r.status);}
fs.writeFileSync(path.join(out,'quality-results.json'),JSON.stringify(results,null,2));if(results.some(r=>r.exitCode!==0))process.exitCode=1;
