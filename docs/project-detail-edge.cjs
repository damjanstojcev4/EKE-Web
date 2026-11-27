// Run existing test tools against the retained, approved Edge binary. This
// process-scoped preload changes only executable selection, not rendering flags,
// screenshot settings, references or comparison thresholds.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const installed='C:/Program Files (x86)/Microsoft/Edge/Application/158.0.4370.33/msedge.exe',cached=path.join(__dirname,'../Frontend/ece-website/node_modules/.cache/eke-edge-158.0.4370.33/msedge.exe'),executable=process.env.EKE_DETAIL_EDGE_EXECUTABLE||(fs.existsSync(installed)?installed:cached),version='158.0.4370.33';
assert(fs.existsSync(executable),'Approved Edge executable is missing; refusing to use an updated browser');
if(require.main===module){
 const {spawnSync}=require('node:child_process'),args=process.argv.slice(2);assert(args.length,'Supply the existing Node test script and arguments');
 const preload=__filename.replace(/\\/g,'/'),env={...process.env,EKE_DETAIL_EDGE_PIN:'phase4c2',NODE_OPTIONS:[process.env.NODE_OPTIONS||'','--require='+JSON.stringify(preload)].filter(Boolean).join(' ')};
 const result=spawnSync(process.execPath,args,{cwd:process.cwd(),env,stdio:'inherit'});if(result.error)throw result.error;process.exitCode=result.status??1;
}else{
 assert.equal(process.env.EKE_DETAIL_EDGE_PIN,'phase4c2','Renderer preload must be explicitly scoped to the visual test process');
 const {chromium}=require('../Frontend/ece-website/node_modules/@playwright/test'),launch=chromium.launch.bind(chromium);
 chromium.launch=async(options={})=>{if(options.channel&&options.channel!=='msedge')throw Error('Unexpected browser channel in Edge-pinned tests');const browser=await launch({...options,executablePath:executable});if(browser.version()!==version){await browser.close();throw Error('Approved Edge version not available');}console.log('Approved Edge version:',browser.version());return browser;};
}
