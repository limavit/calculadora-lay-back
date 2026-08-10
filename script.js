// === Elementos ===
const oddBackEl = document.getElementById('oddBack');
const oddLayEl = document.getElementById('oddLay');
const stakeEl = document.getElementById('stake');

// === Funções utilitárias ===
const fmt = (n, dec = 2) => isFinite(n) ? n.toFixed(dec) : '—';
const fmtR$ = (n) => isFinite(n) ? `R$ ${n.toFixed(2)}` : '—';
const fmtPct = (n) => isFinite(n) ? `${(n * 100).toFixed(2)}%` : '—';

// === Cálculos ===
function calcBackLay() {
  const oddBack = parseFloat(oddBackEl.value);
  const oddLay = parseFloat(oddLayEl.value);
  const stake = parseFloat(stakeEl.value);

  if (!isFinite(oddBack) || !isFinite(oddLay) || !isFinite(stake)) {
    document.getElementById('blRent').textContent = '—';
    document.getElementById('blLucro').textContent = '—';
    document.getElementById('blValor').textContent = '—';
    document.getElementById('lbResp').textContent = '—';
    document.getElementById('lbRent').textContent = '—';
    document.getElementById('lbLucro').textContent = '—';
    document.getElementById('lbValor').textContent = '—';
    return;
  }

  // Back → Lay (fechar back aberto com lay)
  const rentabilidadeBL = (oddBack / oddLay) - 1;
  const lucroBL = stake * (oddBack / oddLay) - stake;
  const valorBL = (oddBack / oddLay) * stake;

  document.getElementById('blRent').textContent = fmtPct(rentabilidadeBL);
  document.getElementById('blLucro').textContent = fmtR$(lucroBL);
  document.getElementById('blValor').textContent = fmtR$(valorBL);

  // Colorir lucro
  const lucroEl = document.getElementById('blLucro');
  lucroEl.classList.toggle('positivo', lucroBL > 0);
  lucroEl.classList.toggle('negativo', lucroBL < 0);

  // Lay → Back (fechar lay aberto com back)
  const responsabilidade = stake * (oddLay - 1);
  const rentabilidadeLB = (1 - oddLay / oddBack) / (oddLay - 1);
  const lucroLB = responsabilidade * rentabilidadeLB;
  const valorLB = (oddLay / oddBack) * stake;

  document.getElementById('lbResp').textContent = fmtR$(responsabilidade);
  document.getElementById('lbRent').textContent = fmtPct(rentabilidadeLB);
  document.getElementById('lbLucro').textContent = fmtR$(lucroLB);
  document.getElementById('lbValor').textContent = fmtR$(valorLB);

  const lucroLBEl = document.getElementById('lbLucro');
  lucroLBEl.classList.toggle('positivo', lucroLB > 0);
  lucroLBEl.classList.toggle('negativo', lucroLB < 0);
}

// === Conversor Back ↔ Lay ===
function calcConversor(origem) {
  const comissao = parseFloat(document.getElementById('comissao').value) / 100 || 0;
  const oddBackEl = document.getElementById('oddBackConv');
  const oddLayEl = document.getElementById('oddLayConv');

  if (origem === 'back') {
    const oddBack = parseFloat(oddBackEl.value);
    if (isFinite(oddBack) && oddBack > 1) {
      // lay = back / (back - 1) × (1 / (1 - comissão))  (Betfair)
      // simplificado: lay = back / (back × (1 - comissão))
      const oddLay = oddBack / (1 - comissao) + comissao / (1 - comissao) / oddBack;
      oddLayEl.value = oddLay.toFixed(3);
    }
  } else {
    const oddLay = parseFloat(oddLayEl.value);
    if (isFinite(oddLay) && oddLay > 1) {
      // back = lay × (1 - comissão) / (1 - comissão × oddLay)
      const oddBack = (oddLay * (1 - comissao)) / (1 - comissao * (oddLay - 1));
      oddBackEl.value = oddBack.toFixed(3);
    }
  }
}

// === Listeners (atualização em tempo real) ===
[oddBackEl, oddLayEl, stakeEl].forEach(el => el.addEventListener('input', calcBackLay));

document.getElementById('oddBackConv').addEventListener('input', () => calcConversor('back'));
document.getElementById('oddLayConv').addEventListener('input', () => calcConversor('lay'));
document.getElementById('comissao').addEventListener('input', () => {
  // Recalcular com base em qual campo tem valor
  const oddBackEl = document.getElementById('oddBackConv');
  if (oddBackEl.value) calcConversor('back');
});
