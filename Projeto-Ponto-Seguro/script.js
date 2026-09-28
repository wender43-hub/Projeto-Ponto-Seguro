const buttons = document.querySelectorAll('#routeNav button');
const panels = document.querySelectorAll('section.panel');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
    window.scrollTo({ top: document.querySelector('nav.routes').offsetTop, behavior:'smooth' });
  });
});

// Denúncia form -> adiciona ao log local (protótipo, sem envio real)
const form = document.getElementById('reportForm');
const list = document.getElementById('reportList');
let protocolCounter = 2293;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const local = document.getElementById('local').value.trim();
  const tipo = document.getElementById('tipo').value;
  const desc = document.getElementById('descricao').value.trim();

  const item = document.createElement('div');
  item.className = 'report-item';
  item.innerHTML = `
    <div><span class="protocol">#PS-${protocolCounter}</span> — ${tipo} em ${local}</div>
    <div class="meta">${desc} · registrado agora</div>
  `;
  list.prepend(item);
  protocolCounter++;
  form.reset();
});

// ===== Modelo 3D do ponto de ônibus (arrastar para girar) =====
const scene = document.getElementById('scene3d');
const rig = document.getElementById('cuboid3d');
const resetBtn = document.getElementById('resetView');
const toggleSpinBtn = document.getElementById('toggleSpin');

if (scene && rig) {
  const INITIAL_X = -16;
  const INITIAL_Y = 28;
  let rotX = INITIAL_X;
  let rotY = INITIAL_Y;
  let dragging = false;
  let startX = 0, startY = 0, startRotX = 0, startRotY = 0;
  let autoSpin = true;
  let resumeTimeout = null;

  function applyRotation() {
    rig.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function pointerDown(x, y) {
    dragging = true;
    startX = x; startY = y;
    startRotX = rotX; startRotY = rotY;
    clearTimeout(resumeTimeout);
  }

  function pointerMove(x, y) {
    if (!dragging) return;
    const dx = x - startX;
    const dy = y - startY;
    rotY = startRotY + dx * 0.4;
    rotX = Math.max(-60, Math.min(30, startRotX - dy * 0.4));
    applyRotation();
  }

  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    if (autoSpin) {
      resumeTimeout = setTimeout(() => {}, 0);
    }
  }

  scene.addEventListener('pointerdown', (e) => {
    scene.setPointerCapture(e.pointerId);
    pointerDown(e.clientX, e.clientY);
  });
  scene.addEventListener('pointermove', (e) => pointerMove(e.clientX, e.clientY));
  scene.addEventListener('pointerup', pointerUp);
  scene.addEventListener('pointercancel', pointerUp);
  scene.addEventListener('pointerleave', pointerUp);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      rotX = INITIAL_X;
      rotY = INITIAL_Y;
      applyRotation();
    });
  }

  if (toggleSpinBtn) {
    toggleSpinBtn.addEventListener('click', () => {
      autoSpin = !autoSpin;
      toggleSpinBtn.textContent = autoSpin ? 'Pausar rotação automática' : 'Retomar rotação automática';
    });
  }

  applyRotation();

  // rotação automática suave quando não está sendo arrastado
  function tick() {
    if (autoSpin && !dragging) {
      rotY += 0.12;
      applyRotation();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== Telão informativo: mensagens em loop =====
const telaoMsg = document.getElementById('telaoMsg');
if (telaoMsg) {
  const mensagens = [
    'Próximo ônibus em 6 min',
    'Use o botão SOS em emergências',
    'Ponto monitorado 24h por câmeras',
    'Conectividade: parceria Intertele',
    'Reporte danos no canal de denúncias'
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % mensagens.length;
    telaoMsg.style.opacity = '0';
    setTimeout(() => {
      telaoMsg.textContent = mensagens[i];
      telaoMsg.style.opacity = '1';
    }, 350);
  }, 3200);
}