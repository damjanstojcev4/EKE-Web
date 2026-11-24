const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),prefix='Frontend/ece-website/',checkpoint='8ddb6b4ba8cb205d59c2e2f1fddd24f191c496e2';
const postcss=require('../Frontend/ece-website/node_modules/postcss'),ts=require('../Frontend/ece-website/node_modules/typescript');
const old=file=>execFileSync('git',['show',`${checkpoint}:${prefix}${file}`],{cwd:root,encoding:'utf8'}),now=file=>fs.readFileSync(path.join(root,prefix,file),'utf8');
const hash=s=>crypto.createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const count=css=>{let rules=0,declarations=0;const ast=postcss.parse(css);ast.walkRules(()=>rules++);ast.walkDecls(()=>declarations++);return {rules,declarations};};
const protectedFiles=['src/app/news/[slug]/page.tsx','src/app/news/page.tsx','src/components/news/PublicNewsList.tsx','src/components/news/ArticleContent.tsx','src/lib/api/news.ts','src/lib/api/client.ts','src/lib/api/use-api.ts','src/lib/news-publication.ts','src/lib/admin-api.ts','src/types/news.ts','src/content/route-manifest.json','src/components/project-details/PublicProject.tsx','src/app/projects/[slug]/page.module.css','src/components/layout/Header.tsx','src/components/layout/Footer.tsx','src/app/globals.css','src/styles/theme.css','src/components/ui.tsx'];
const invariants=Object.fromEntries(protectedFiles.map(file=>[file,{sha256:hash(now(file)),unchanged:hash(old(file))===hash(now(file))}]));
// Compare semantic trees: source positions, formatting parentheses and trailing
// commas are not program behavior. Keep literal values, operators and node kinds.
const normalize=(text,file)=>{const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const visit=node=>{
 if(ts.isImportDeclaration(node)&&/\.module\.css|article-styles/.test(node.moduleSpecifier.text))return undefined;
 if(ts.isJsxAttribute(node)&&node.name.text==='className')return undefined;
 if(ts.isParenthesizedExpression(node))return visit(node.expression);
 if(ts.isJsxText(node)){const value=node.text.replace(/\s+/g,' ').trim();return value?['JsxText',value]:undefined;}
 if(ts.isIdentifier(node)||ts.isStringLiteral(node)||ts.isNumericLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))return [ts.SyntaxKind[node.kind],node.text];
 const children=[];ts.forEachChild(node,child=>{const value=visit(child);if(value!==undefined)children.push(value);});
 return [ts.SyntaxKind[node.kind],node.operator??null,ts.isVariableDeclarationList(node)?node.flags&(ts.NodeFlags.Const|ts.NodeFlags.Let):null,...children];
 };return JSON.stringify(visit(source));};
const logic=Object.fromEntries(['PublicArticle','ArticleSidebar','ArticleShare','PendingControl'].map(name=>{const file=`src/components/news/${name}.tsx`;return [name,normalize(old(file),file)===normalize(now(file),file)];}));
const before=count(old('src/app/news/[slug]/page.module.css')),pendingBefore=count(old('src/app/news/page.module.css'));
const result={checkpoint,before,pendingBefore,after:count(now('src/components/news/article.module.css')),oldRouteStylesheetsRemoved:!fs.existsSync(path.join(root,prefix,'src/app/news/page.module.css'))&&!fs.existsSync(path.join(root,prefix,'src/app/news/[slug]/page.module.css')),logicUnchangedExceptStyling:logic,invariants,testRouteRemoved:!fs.existsSync(path.join(root,prefix,'src/app/phase4b2-component-test')),testExportRemoved:!fs.existsSync(path.join(root,prefix,'out/phase4b2-component-test'))};
fs.writeFileSync(path.join(__dirname,'news-detail-baseline/source-audit.json'),JSON.stringify(result,null,2));console.log(result);
if(Object.values(invariants).some(v=>!v.unchanged)||Object.values(logic).some(v=>!v)||!result.oldRouteStylesheetsRemoved||!result.testRouteRemoved||!result.testExportRemoved)process.exitCode=1;
