import { CATEGORIES, PRODUCTS } from './produtos.js';

const currency = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const el = (s, p = document) => p.querySelector(s);

let state = { q: '', category: 'Todas', sort: 'relevance' };

function renderChips() {
  const w = el('#chips');
  w.innerHTML = '';
  ['Todas', ...CATEGORIES].forEach(c => {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.textContent = c;
    b.dataset.active = c === state.category;
    b.onclick = () => { state.category = c; sync(); };
    w.appendChild(b);
  });
}

function getFiltered() {
  const q = state.q.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.category === 'Todas' || p.category === state.category) &&
    (!q || [p.name, p.desc, p.brand, p.category].join(' ').toLowerCase().includes(q))
  );
  switch (state.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return list;
}

function renderGrid() {
  const g = el('#grid');
  const list = getFiltered();
  g.innerHTML = '';
  if (!list.length) {
    g.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:24px">Nenhum produto encontrado.</div>';
    return;
  }
  list.forEach(p => {
    const c = document.createElement('article');
    c.className = 'card';
    c.innerHTML = `
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <span class="badge">${p.category}</span>
      </div>
      <div class="body">
        <h3 class="title">${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="price">
          <span class="now">${currency(p.price)}</span>
          ${p.oldPrice ? `<span class="old">${currency(p.oldPrice)}</span>` : ''}
        </div>
      </div>
      <div class="foot">
        <a class="cta whatsapp" target="_blank" rel="noopener" href="https://wa.me/5547999999999?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${p.name} – ${currency(p.price)} (Aurum).`)}">WhatsApp</a>
        <a class="cta instagram" target="_blank" rel="noopener" href="https://instagram.com/">Instagram</a>
      </div>
    `;
    g.appendChild(c);
  });
}

function sync() {
  renderChips();
  renderGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  el('#q').oninput = e => { state.q = e.target.value; sync(); };
  el('#sort').onchange = e => { state.sort = e.target.value; sync(); };
  el('#resetBtn').onclick = () => {
    state = { q: '', category: 'Todas', sort: 'relevance' };
    el('#q').value = '';
    el('#sort').value = 'relevance';
    sync();
  };
  el('#year').textContent = new Date().getFullYear();
  sync();
});