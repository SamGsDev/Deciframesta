let mode = 'enc';

function setMode(m) {
  mode = m;
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', (i===0&&m==='enc')||(i===1&&m==='dec')));
  document.getElementById('msg-label').textContent = m === 'enc' ? 'Texto a cifrar' : 'Texto cifrado';
  document.getElementById('message').placeholder = m === 'enc' ? 'Escribe tu mensaje aquí...' : 'Pega el texto cifrado aquí...';
  compute();
}

function getCleanKey(raw) {
  return raw.toUpperCase().replace(/[^A-Z]/g, '');
}

function vigEncrypt(text, key) {
  if (!key) return null;
  let result = '';
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const upper = c.toUpperCase();
    const code = upper.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const shift = key.charCodeAt(ki % key.length) - 65;
      const enc = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      result += c === c.toLowerCase() ? enc.toLowerCase() : enc;
      ki++;
    } else {
      result += c;
    }
  }
  return result;
}

function vigDecrypt(text, key) {
  if (!key) return null;
  let result = '';
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const upper = c.toUpperCase();
    const code = upper.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const shift = key.charCodeAt(ki % key.length) - 65;
      const dec = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      result += c === c.toLowerCase() ? dec.toLowerCase() : dec;
      ki++;
    } else {
      result += c;
    }
  }
  return result;
}

function showKeyPreview() {
  const raw = document.getElementById('key').value;
  const clean = getCleanKey(raw);
  const prev = document.getElementById('key-preview');
  if (clean && clean !== raw.toUpperCase()) {
    prev.textContent = 'Clave efectiva: ' + clean;
  } else {
    prev.textContent = '';
  }
}

function compute() {
  const msg = document.getElementById('message').value;
  const rawKey = document.getElementById('key').value;
  const key = getCleanKey(rawKey);
  const errEl = document.getElementById('key-error');
  const resEl = document.getElementById('result-text');
  const resLabel = document.getElementById('result-label');
  const info = document.getElementById('info-strip');

  if (!msg) {
    resEl.textContent = 'El resultado aparecerá aquí...';
    resEl.classList.remove('result-updated');
    info.textContent = '';
    return;
  }

  if (!key) {
    errEl.textContent = 'La clave solo puede contener letras (A–Z).';
    resEl.textContent = 'Ingresa una clave válida para ver el resultado.';
    resEl.classList.remove('result-updated');
    info.textContent = '';
    return;
  }
  errEl.textContent = '';

  const letters = (msg.match(/[a-zA-Z]/g) || []).length;
  const out = mode === 'enc' ? vigEncrypt(msg, key) : vigDecrypt(msg, key);

  resEl.textContent = out;
  resEl.classList.add('result-updated');
  resLabel.innerHTML = (mode === 'enc' ? 'Texto cifrado' : 'Texto descifrado') +
    ' <button class="copy-btn" onclick="copyResult()">Copiar</button>';

  const keyStr = key.length > 1 ? key : key;
  info.innerHTML = `Clave: <strong>${key}</strong> &nbsp;|&nbsp; Longitud de clave: ${key.length} &nbsp;|&nbsp; Letras procesadas: ${letters} &nbsp;|&nbsp; Caracteres no alfabéticos: conservados sin modificar`;
}

function copyResult() {
  const text = document.getElementById('result-text').textContent;
  if (!text || text.includes('aparecerá')) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copiado';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.classList.remove('copied');
    }, 1500);
  });
}
