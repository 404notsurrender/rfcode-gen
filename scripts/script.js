// script.js
const codeArea = document.getElementById('codeArea');
const regenBtn = document.getElementById('regenBtn');
const copyBtn = document.getElementById('copyBtn');
const segmentsInput = document.getElementById('segments');
const segLenInput = document.getElementById('segLen');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// use crypto for better randomness when available
function randomInt(max) {
  if (window.crypto && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function generateSegment(len) {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += CHARS[randomInt(CHARS.length)];
  }
  return out;
}

function generateCode(segments = 3, segLen = 4) {
  segments = Math.max(1, Math.min(6, Number(segments) || 3));
  segLen = Math.max(1, Math.min(8, Number(segLen) || 4));
  const parts = [];
  for (let i = 0; i < segments; i++) parts.push(generateSegment(segLen));
  return parts.join('-');
}

function setCode(text) {
  codeArea.textContent = text;
}

function flash(msg) {
  const prev = codeArea.textContent;
  codeArea.textContent = msg;
  setTimeout(()=> setCode(prev), 800);
}

regenBtn.addEventListener('click', ()=> {
  const code = generateCode(segmentsInput.value, segLenInput.value);
  setCode(code);
});

copyBtn.addEventListener('click', async ()=> {
  const text = codeArea.textContent.trim();
  if (!text || text === '----') {
    flash('Generate dulu');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    flash('Copied ✓');
  } catch (e) {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      flash('Copied ✓');
    } catch {
      flash('Gagal copy');
    }
    ta.remove();
  }
});

// generate initial code on load
document.addEventListener('DOMContentLoaded', ()=> {
  setCode(generateCode(segmentsInput.value, segLenInput.value));
});
