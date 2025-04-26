let currentTags = [];
let currentBase = null;
let sessions = [];

const tags = [
  { id: 'sb', label: 'SB' },
  { id: 'po', label: 'PO' },
  { id: 'backTag', label: 'Back Tag' },
  { id: 'caughtSteal', label: 'Caught Steal' },
  { id: 'delaySteal', label: 'Delay Steal' }
];

if (localStorage.getItem('sessions')) {
  sessions = JSON.parse(localStorage.getItem('sessions'));
}

function toggleTag(tagId) {
  if (currentTags.includes(tagId)) {
    currentTags = currentTags.filter(t => t !== tagId);
  } else {
    currentTags.push(tagId);
  }
  updateTagButtons();
}

function toggleBase(base) {
  currentBase = currentBase === base ? null : base;
  updateBaseButtons();
}

function updateTagButtons() {
  tags.forEach(tag => {
    const button = document.getElementById(tag.id);
    if (currentTags.includes(tag.id)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function updateBaseButtons() {
  const bases = ['1st', '2nd', '3rd', 'HOME'];
  bases.forEach((base, index) => {
    const button = document.getElementById(`base${index + 1}`) || document.getElementById(`baseHome`);
    if (currentBase === base) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function saveTag() {
  const pitchNumber = document.getElementById('pitchNumber').value.trim();
  if (!pitchNumber || currentTags.length === 0) {
    alert('Por favor, ingresa un número de lanzamiento y selecciona al menos un tag.');
    return;
  }

  sessions.push({
    pitchNumber,
    tags: [...currentTags],
    base: currentBase
  });

  localStorage.setItem('sessions', JSON.stringify(sessions));
  renderSession();
  clearInputs();
}

function clearInputs() {
  document.getElementById('pitchNumber').value = '';
  currentTags = [];
  currentBase = null;
  updateTagButtons();
  updateBaseButtons();
}

function renderSession() {
  const log = document.getElementById('sessionLog');
  log.innerHTML = '';
  sessions.forEach((entry) => {
    const div = document.createElement('div');
    div.className = 'session-entry';
    div.textContent = `Lanzamiento ${entry.pitchNumber}: ${entry.tags.join(', ')}${entry.base ? ' → ' + entry.base : ''}`;
    log.appendChild(div);
  });
}

function newSession() {
  if (confirm("¿Estás seguro de que deseas iniciar una nueva sesión? Esto borrará todos los datos actuales.")) {
    sessions = [];
    localStorage.removeItem('sessions');
    renderSession();
    clearInputs();
  }
}

function downloadPDF() {
  const content = sessions.map(
    s => `Lanzamiento ${s.pitchNumber}: ${s.tags.join(', ')}${s.base ? ' → ' + s.base : ''}`
  ).join('\n');

  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'sesion-etiquetas.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

renderSession();
