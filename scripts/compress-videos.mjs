import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const root = process.cwd();
fs.mkdirSync('.review/compressed', { recursive: true });
for (const name of fs.readdirSync('video').filter(n => n.endsWith('.mp4'))) {
  const input = path.resolve('video', name), output = path.resolve('.review/compressed', name);
  if (!input.startsWith(root + path.sep) || !output.startsWith(root + path.sep)) throw new Error('Unexpected media path');
  const oldSize = fs.statSync(input).size;
  const args = ['-nostdin','-hide_banner','-loglevel','error','-y','-i',input,'-vf','scale=1280:-2:force_original_aspect_ratio=decrease,fps=20','-c:v','libx264','-preset','ultrafast','-crf','30','-threads','2','-c:a','aac','-b:a','64k','-movflags','+faststart',output];
  let result = spawnSync(ffmpeg.path, args, { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Compression failed: ' + name);
  if (fs.statSync(output).size > 24 * 1024 * 1024) {
    args[args.indexOf('scale=1280:-2:force_original_aspect_ratio=decrease,fps=20')] = 'scale=960:-2:force_original_aspect_ratio=decrease,fps=15';
    args[args.indexOf('30')] = '34';
    result = spawnSync(ffmpeg.path, args, { stdio: 'inherit' });
    if (result.status !== 0 || fs.statSync(output).size > 24 * 1024 * 1024) throw new Error('Video still too large: ' + name);
  }
  fs.copyFileSync(output, path.resolve('public/video', name));
  console.log(name + ': ' + (oldSize/1048576).toFixed(1) + ' MB -> ' + (fs.statSync(output).size/1048576).toFixed(1) + ' MB');
}