// Validate research artifacts only. This is not a game engine or game test suite.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const problems = [];
const check = (condition, message) => { if (!condition) problems.push(message); };
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const required = [
  'README.md','sources.md','sources.json','rules-verification.json','unknown-rules.md','research-verdict.md',
  'rules/complete-rules.md','rules/setup.md','rules/turn-structure.md','rules/win-condition.md','rules/edge-cases.md',
  'cards/card-taxonomy.md','cards/cards.md','cards/cards.json','cards/interactions.md',
  'gameplay/game-loop.md','gameplay/state-machine.md','gameplay/targeting.md','gameplay/psyche-system.md','gameplay/event-system.md','gameplay/video-observations.md',
  'ux/table-layout.md','ux/interaction-spec.md','ux/animation-spec.md','ux/responsive-layout.md','ux/sound-spec.md',
  'multiplayer/architecture.md','multiplayer/room-flow.md','multiplayer/reconnect.md','multiplayer/information-security.md',
  'testing/gameplay-tests.md','testing/multiplayer-tests.md','implementation-plan.md','assets.md',
  'cards.md','cards.json','game-loop.md','animation-spec.md','evidence/README.md'
];
for (const file of required) check(fs.existsSync(path.join(root,file)), `Missing required artifact: ${file}`);
const db = readJson('cards/cards.json');
const sourceIds = new Set(readJson('sources.json').sources.map(s=>s.id));
const rules = readJson('rules-verification.json').rules;
const ruleIds = new Set(rules.map(r=>r.id));
check(ruleIds.size === rules.length, 'Duplicate rule IDs');
check(sourceIds.size === readJson('sources.json').sources.length, 'Duplicate source IDs');
const ids = new Set(db.cards.map(c=>c.id));
check(ids.size === db.cards.length, 'Duplicate card definition IDs');
check(db.cards.length === 19, 'Expected 19 known definitions including historical bonuses');
const retail = db.cards.filter(c=>c.edition==='retail_base_89_provisional');
check(retail.length === 17, 'Expected 17 retail definitions');
check(retail.reduce((sum,c)=>sum+c.copies.retail89,0) === 89, 'Provisional retail copy sum must be 89');
check(db.cards.reduce((sum,c)=>sum+c.copies.historical95,0) === 95, 'Reported historical copy sum must be 95');
const disorders = db.cards.filter(c=>c.type==='disorder');
const drugs = db.cards.filter(c=>c.type==='drug');
check(disorders.length===8 && drugs.length===7, 'Expected eight Disorders / seven Drugs');
for (const c of db.cards) {
  check(['verified','inferred','unknown'].includes(c.verification), `Bad verification: ${c.id}`);
  check(c.cardText===null, `No complete literal text was verified: ${c.id}`);
  check(c.copies.retailVerification==='inferred', `Retail copy confidence improperly upgraded: ${c.id}`);
  for (const id of c.sources) check(sourceIds.has(id), `Unknown source ${id} in ${c.id}`);
  for (const id of c.ruleIds) check(ruleIds.has(id), `Unknown rule ${id} in ${c.id}`);
  for (const id of c.treatments||[]) check(ids.has(id), `Unknown treatment ${id} in ${c.id}`);
  for (const id of c.treats||[]) check(disorders.some(d=>d.id===id), `Unknown treated Disorder ${id}`);
  for (const id of c.sideEffects||[]) check(disorders.some(d=>d.id===id), `Unknown side effect ${id}`);
}
for (const drug of drugs) {
  check(drug.treats.length===1, `Unexpected multi-treatment Drug ${drug.id}`);
  const disorder=disorders.find(d=>d.id===drug.treats[0]);
  check(disorder.treatments.includes(drug.id), `Treatment graph not reciprocal: ${drug.id}`);
}
check(!ids.has('drug_anorexia'), 'Anorexia must not have an invented Drug');
check(disorders.find(d=>d.id==='tremors').therapyAllowed===false, 'Tremors Therapy immunity lost');
check(!db.cards.find(c=>c.id==='therapy').treats.includes('tremors'), 'Therapy treats Tremors incorrectly');
check(fs.readFileSync(path.join(root,'cards.json'),'utf8')===fs.readFileSync(path.join(root,'cards/cards.json'),'utf8'), 'Compatibility JSON differs from canonical');
for (const rule of rules) for(const id of rule.sources) check(sourceIds.has(id), `Unknown ledger source ${id}`);
function walk(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
}
const markdownFiles=walk(root).filter(f=>f.endsWith('.md'));
for(const file of markdownFiles) {
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let target=match[1].replace(/^<|>$/g,'').split('#')[0];
    if(!target || /^(https?:|mailto:)/i.test(target)) continue;
    target=decodeURIComponent(target);
    check(fs.existsSync(path.resolve(path.dirname(file),target)), `Broken link in ${path.relative(root,file)}: ${target}`);
  }
}
const count=status=>rules.filter(r=>r.status===status).length;
const summary={requiredArtifacts:required.length,markdownFiles:markdownFiles.length,cardDefinitions:db.cards.length,retailDefinitions:retail.length,retailCopiesProvisional:89,historicalCopiesReported:95,sourceCount:sourceIds.size,ruleClaims:rules.length,verified:count('verified'),inferred:count('inferred'),unknown:count('unknown'),verifiedPercent:Number((100*count('verified')/rules.length).toFixed(1)),problems};
fs.writeFileSync(path.join(root,'validation-results.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
if(problems.length) process.exitCode=1;
