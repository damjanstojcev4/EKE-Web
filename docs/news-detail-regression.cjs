// Serial browser jobs keep every dataset's existing pinned renderer unchanged.
const {spawnSync}=require('node:child_process');const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),frontend=path.join(root,'Frontend/ece-website'),base=path.join(__dirname,'news-detail-baseline');
const checks=[
 ['detail-production',['docs/news-detail-check.cjs','after','--production'],root,'news-detail-baseline/production/comparison.json'],
 ['news-listing',['docs/news-check.cjs','after'],root,'news-baseline/after/comparison.json'],
 ['privacy',['node_modules/@playwright/test/cli.js','test','--config','playwright.visual.config.ts'],frontend],
 ['privacy-edges',['docs/privacy-pilot-check.cjs','after'],root,'privacy-pilot/comparison.json'],
 ['shared-routes',['docs/shared-ui-check.cjs','button','--software'],root,'shared-ui/button-software/comparison.json'],
 ['shared-gallery',['docs/shared-button-gallery.cjs','after'],root,'shared-ui/gallery-after/comparison.json'],
 ['shared-native',['docs/shared-button-gallery.cjs','after','--native'],root,'shared-ui/native-buttons-after/comparison.json'],
 ['contact-software',['docs/contact-check.cjs','after'],root,'contact-baseline/after-software/comparison.json'],
 ['contact-real',['docs/contact-check.cjs','after','--real'],root,'contact-baseline/after-real/comparison.json'],
 ['integration',['node_modules/@playwright/test/cli.js','test'],frontend],
];
const selected=new Set(process.argv.slice(2));if([...selected].some(name=>!checks.some(c=>c[0]===name)))throw Error('Unknown suite');
const file=path.join(base,'regression.json'),results=selected.size?JSON.parse(fs.readFileSync(file)):[];
const evidence=path.join(base,'prior-comparisons');fs.mkdirSync(evidence,{recursive:true});
for(const [name,args,cwd,comparison]of checks){if(selected.size&&!selected.has(name))continue;console.log('Starting',name);
 const run=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1200000,maxBuffer:20*1024*1024});fs.writeFileSync(path.join(base,name+'.log'),(run.stdout||'')+(run.stderr||'')+(run.error?.message||''));
 const result={name,exitCode:run.status,error:run.error?.message},index=results.findIndex(r=>r.name===name);if(index<0)results.push(result);else results[index]=result;
 if(comparison&&fs.existsSync(path.join(__dirname,comparison)))fs.copyFileSync(path.join(__dirname,comparison),path.join(evidence,name+'.json'));
 fs.writeFileSync(file,JSON.stringify(results,null,2));console.log(name,run.status);
}
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
