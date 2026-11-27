// Independent exact comparison of captured manifests, including baseline preflight.
const fs=require('node:fs'),path=require('node:path'),{gunzipSync}=require('node:zlib');
const base=path.join(__dirname,'project-detail-baseline'),actual=process.argv[2]||'after';if(!['control','after'].includes(actual))throw Error('Use control/after');
const read=dir=>JSON.parse(gunzipSync(fs.readFileSync(path.join(base,dir,'manifest.json.gz')))),before=read('before'),after=read(actual);
const result={captures:Object.keys(before.captures).length,changed:[],computedDifferences:[],behaviorDifferences:[],metadataDifferences:[]};
for(const key of Object.keys(before.captures)){if(before.captures[key]!==after.captures[key])result.changed.push(key);if(JSON.stringify(before.computed[key])!==JSON.stringify(after.computed[key]))result.computedDifferences.push(key);if(JSON.stringify(before.behavior[key])!==JSON.stringify(after.behavior[key]))result.behaviorDifferences.push(key);}
for(const prop of ['rendering','fixtures','mediaHashes','requests','live','liveList','routing','errors'])if(JSON.stringify(before[prop])!==JSON.stringify(after[prop]))result.metadataDifferences.push(prop);
fs.writeFileSync(path.join(base,actual,'established-comparison.json'),JSON.stringify(result,null,2));console.log(result);if(result.captures!==96||Object.entries(result).some(([k,v])=>Array.isArray(v)&&v.length))process.exitCode=1;
