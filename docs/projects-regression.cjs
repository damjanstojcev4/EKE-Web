// Existing datasets retain their renderer flags and immutable references.
const {spawnSync}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website'),base=path.join(__dirname,'projects-baseline');
const checks=[
 ['news-components',['docs/projects-news-gallery.cjs'],root,'projects-baseline/news-components.json'],
 ['projects',['docs/projects-check.cjs','after'],root,'projects-baseline/after/comparison.json'],
 ['news-production',['docs/news-detail-check.cjs','after','--production'],root,'news-detail-baseline/production/comparison.json'],
 ['news-listing',['docs/news-check.cjs','after'],root,'news-baseline/after/comparison.json'],
 ['privacy',['node_modules/@playwright/test/cli.js','test','--config','playwright.visual.config.ts'],front],
 ['privacy-edges',['docs/privacy-pilot-check.cjs','after'],root,'privacy-pilot/comparison.json'],
 ['shared-routes',['docs/shared-ui-check.cjs','button','--software'],root,'shared-ui/button-software/comparison.json'],
 ['shared-gallery',['docs/shared-button-gallery.cjs','after'],root,'shared-ui/gallery-after/comparison.json'],
 ['shared-native',['docs/shared-button-gallery.cjs','after','--native'],root,'shared-ui/native-buttons-after/comparison.json'],
 ['contact-software',['docs/contact-check.cjs','after'],root,'contact-baseline/after-software/comparison.json'],
 ['contact-real',['docs/contact-check.cjs','after','--real'],root,'contact-baseline/after-real/comparison.json'],
 ['integration',['node_modules/@playwright/test/cli.js','test'],front],
];
const selected=new Set(process.argv.slice(2));if([...selected].some(name=>!checks.some(c=>c[0]===name)))throw Error('Unknown suite');
const file=path.join(base,'regression.json'),results=selected.size&&fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[],evidence=path.join(base,'prior-comparisons');fs.mkdirSync(evidence,{recursive:true});
for(const [name,args,cwd,comparison]of checks){if(selected.size&&!selected.has(name))continue;console.log('Starting',name);const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1800000,maxBuffer:20*1024*1024});fs.writeFileSync(path.join(base,name+'.log'),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));const result={name,exitCode:r.status,error:r.error?.message},index=results.findIndex(v=>v.name===name);if(index<0)results.push(result);else results[index]=result;if(comparison&&fs.existsSync(path.join(__dirname,comparison)))fs.copyFileSync(path.join(__dirname,comparison),path.join(evidence,name+'.json'));fs.writeFileSync(file,JSON.stringify(results,null,2));console.log(name,r.status);}
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
