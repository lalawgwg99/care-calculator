// 測量 CMS 模板頁之間的文字相似度（Jaccard over 4-gram shingles + difflib-like ratio）
// 用法：node scripts/cms-similarity.mjs out
import { readFileSync } from 'fs';
import { join } from 'path';

const outDir = process.argv[2] || 'out';

function textOf(file) {
  let html = readFileSync(join(outDir, file), 'utf-8');
  // 去掉 head（title/meta 每頁不同，不計入內容相似度）、script、style
  html = html.replace(/<head[\s\S]*?<\/head>/, '');
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  html = html.replace(/<style[\s\S]*?<\/style>/g, '');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

function shingles(text, n = 4) {
  const chars = [...text];
  const set = new Set();
  for (let i = 0; i + n <= chars.length; i++) {
    set.add(chars.slice(i, i + n).join(''));
  }
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 1 : inter / union;
}

const pages = ['cms4', 'cms5', 'cms5/foreign-caregiver', 'cms4/foreign-caregiver', 'cms3', 'cms6'];
const texts = {};
for (const p of pages) {
  try { texts[p] = textOf(p + '.html'); }
  catch (e) { console.log('missing:', p); }
}

const keys = Object.keys(texts);
console.log('=== 各頁文字長度 ===');
for (const k of keys) console.log(k, 'chars=', texts[k].length);

console.log('\n=== 兩兩 Jaccard 相似度（4-gram） ===');
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    const s = jaccard(shingles(texts[keys[i]]), shingles(texts[keys[j]]));
    console.log(`${keys[i]} vs ${keys[j]}: ${(s * 100).toFixed(1)}%`);
  }
}
