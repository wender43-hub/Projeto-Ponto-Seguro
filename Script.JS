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