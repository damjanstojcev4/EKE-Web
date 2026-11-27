// Run established browser suites serially, retaining their approved GPU profiles.
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),frontend=path.join(root,'Frontend/ece-website');
const checks=[
 ['privacy',['node_modules/@playwright/test/cli.js','test','--config','playwright.visual.config.ts'],frontend],
 ['privacy-edges',['docs/privacy-pilot-check.cjs','after'],root],
 ['shared-routes',['docs/shared-ui-check.cjs','button','--software'],root],
 ['shared-gallery',['docs/shared-button-gallery.cjs','after'],root],
 ['shared-native',['docs/shared-button-gallery.cjs','after','--native'],root],
 ['contact-software',['docs/contact-check.cjs','after'],root],
 ['contact-real',['docs/contact-check.cjs','after','--real'],root],
 ['integration',['node_modules/@playwright/test/cli.js','test'],frontend],
];
const requested=new Set(process.argv.slice(2));
if([...requested].some(name=>!checks.some(check=>check[0]===name)))throw Error('Unknown suite');
const results=requested.size?JSON.parse(fs.readFileSync(path.join(__dirname,'news-baseline/regression.json'))):[];
const comparisons={
 'privacy-edges':'privacy-pilot/comparison.json',
 'shared-routes':'shared-ui/button-software/comparison.json',
 'shared-gallery':'shared-ui/gallery-after/comparison.json',
 'shared-native':'shared-ui/native-buttons-after/comparison.json',
 'contact-software':'contact-baseline/after-software/comparison.json',
 'contact-real':'contact-baseline/after-real/comparison.json',
};
const evidence=path.join(__dirname,'news-baseline/prior-comparisons');fs.mkdirSync(evidence,{recursive:true});
for(const [name,args,cwd]of checks){
 if(requested.size&&!requested.has(name))continue;
 console.log('Starting',name);const run=spawnSync(process.execPath,args,{cwd,encoding:'utf8',timeout:1200000,maxBuffer:20*1024*1024});
 fs.writeFileSync(path.join(__dirname,'news-baseline',name+'.log'),(run.stdout||'')+(run.stderr||'')+(run.error?.message||''));
 const result={name,exitCode:run.status,error:run.error?.message};
 const index=results.findIndex(r=>r.name===name);if(index<0)results.push(result);else results[index]=result;
 if(comparisons[name])fs.copyFileSync(path.join(__dirname,comparisons[name]),path.join(evidence,name+'.json'));
 console.log(name,run.status);fs.writeFileSync(path.join(__dirname,'news-baseline/regression.json'),JSON.stringify(results,null,2));
}
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
