// Inspect actual generated utility rules on the static About page (no CMS reads).
const {chromium}=require('../Frontend/ece-website/node_modules/@playwright/test');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path');
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:path.join(__dirname,'../Frontend/ece-website'),env:{...process.env,PORT:'3205',API_PROXY_TARGET:''},stdio:'pipe'});
(async()=>{let browser;try{
 await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no)});
 browser=await chromium.launch({channel:'msedge',args:['--disable-gpu']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:3205/about/',{waitUntil:'networkidle'});
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
 const {root}=await cdp.send('DOM.getDocument');const evidence={};
 for(const [name,selector,expected]of [['Divider','.original-divider',['opacity-50','pointer-events-none']],['Stripe','.stripe',['.flex','.relative']],['Stripe color','.stripe > span:first-child',['bg-brand-turquoise']],['Button','a.button',['bg-surface','font-bold']]]){
  const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});
  const data=await cdp.send('CSS.getMatchedStylesForNode',{nodeId});
  const rules=data.matchedCSSRules.map(r=>({selector:r.rule.selectorList.text,properties:r.rule.style.cssProperties.filter(p=>!p.disabled).map(p=>({name:p.name,value:p.value,important:p.important||false}))}));
  const matched=rules.filter(r=>expected.some(key=>r.selector.includes(key)));
  if(!expected.every(key=>matched.some(r=>r.selector.includes(key))))throw Error('Expected generated utilities missing for '+name);
  evidence[name]={selector,matched};
 }
 fs.writeFileSync(path.join(__dirname,'shared-ui/utility-rules.json'),JSON.stringify(evidence,null,2));
 console.log('Generated utility rules verified for Divider, Stripe, Stripe colors and Button');
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
