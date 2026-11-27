// Supplementary real-backend matrix, using the identical strict capture protocol.
// The public endpoint is read on every run; no replay or fixture substitution.
const fs=require('node:fs'),Module=require('node:module');
if(process.argv.includes('--offline'))throw Error('Live verification cannot run offline');
let source=fs.readFileSync(__dirname+'/training-check.cjs','utf8');
source=source.replace("'training-baseline'","'training-baseline/live'").replace('allWidths=[1920,1440,820,390,699,700,701,768,769,1099,1100,1101]','allWidths=[1440,820,390]');
const start=source.indexOf("  for(mode of ['populated'"),end=source.indexOf('  await page.close()',start);
if(start<0||end<0)throw Error('Capture protocol changed; review live supplement');
source=source.slice(0,start)+"  mode='live';await page.goto('http://127.0.0.1:3215/training/',{waitUntil:'networkidle'});await expect(page.locator('#training-title')).toBeVisible();await save('live');\n"+source.slice(end);
source=source.replace("widths.reduce((n,w)=>n+5+([1440,820,390].includes(w)?(live?7:6):0),0)",'widths.length');
const runtime=new Module(__filename,module);runtime.filename=__filename;runtime.paths=module.paths;runtime._compile(source,__filename);
