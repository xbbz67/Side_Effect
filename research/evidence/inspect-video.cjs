const fs = require('node:fs');
const stem = process.argv[2] || 'video-official';
const s = fs.readFileSync(`research/evidence/${stem}.html`, 'utf8');
const marker = 'var ytInitialPlayerResponse = ';
const start = s.indexOf(marker);
if (start < 0) throw new Error('Player metadata missing');
const remaining = s.slice(start + marker.length);
let depth = 0, quoted = false, escaped = false, end = 0;
for (let i = 0; i < remaining.length; i++) {
  const c = remaining[i];
  if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; }
  else if (c === '"') quoted = true;
  else if (c === '{') depth++;
  else if (c === '}' && --depth === 0) { end = i + 1; break; }
}
const p = JSON.parse(remaining.slice(0, end));
fs.writeFileSync(`research/evidence/${stem}-player.json`, JSON.stringify(p, null, 2));
console.log(JSON.stringify({status:p.playabilityStatus.status,title:p.videoDetails?.title,duration:p.videoDetails?.lengthSeconds,captionCount:p.captions?.playerCaptionsTracklistRenderer?.captionTracks?.length,storyboard:!!p.storyboards,formats:p.streamingData?.formats?.map(x=>({itag:x.itag,mimeType:x.mimeType,url:!!x.url,cipher:!!x.signatureCipher}))}, null, 2));
