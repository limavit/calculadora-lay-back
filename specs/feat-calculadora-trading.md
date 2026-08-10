# Spec: Calculadora Lay/Back para Trading Esportivo

> **NÃO apague este arquivo antes de fazer push.** Ele serve de guia pra revisão.

## Contexto

Vitor pediu em **10/08/2026 14:48 BRT** um site simples que faça cálculos de trading esportivo:
- "Se eu fiz Back com stake X a odd Y, quanto preciso no Lay pra sair com lucro? E vice-versa."

Planilha de referência (`Cálculos_para_Trade_Esportivo_Nettuno.xlsx`) tem as fórmulas:
- **Back/Lay:** valor pra fechar = (odd_back / odd_lay) × stake | lucro = stake × (odd_back/odd_lay) − stake
- **Lay/Back:** valor pra fechar = (odd_lay / odd_back) × stake | lucro = responsabilidade × rentabilidade
- **Responsabilidade do Lay:** stake × (odd_lay − 1)
- **Odd de quebra:** jogos / vitórias (mínimo pra ser lucrativo)

**Nome do projeto:** `calculadora-lay-back`
**Design:** sépia/dourado (mesmo padrão do `reprogrming-links`)
**Stack:** HTML+CSS+JS vanilla, zero build, calculo 100% client-side

---

## Estrutura de pastas

```
calculadora-lay-back/
├── index.html              # calculadora principal
├── style.css               # estilo sépia/dourado
├── script.js               # lógica de cálculo
├── README.md               # como usar
├── vercel.json             # config Vercel (rewrites se necessário)
└── specs/
    └── feat-calculadora-trading.md  # esta spec
```

**Deploy:** GitHub `limavit/calculadora-lay-back` (privado) → Vercel auto-deploy

---

## Mudanças esperadas

### 1. `index.html` — Calculadora principal

Estrutura da página (single-page):

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculadora Lay/Back — Trading Esportivo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <header>
      <h1>⚡ Calculadora Lay/Back</h1>
      <p class="subtitle">Trading esportivo — calcule seu lucro/responsabilidade em segundos</p>
    </header>

    <section class="input-card">
      <h2>📊 Seus dados</h2>
      <div class="input-group">
        <label for="oddBack">Odd do Back (apostar a favor)</label>
        <input type="number" id="oddBack" step="0.01" min="1.01" placeholder="Ex: 2.40">
      </div>
      <div class="input-group">
        <label for="oddLay">Odd do Lay (apostar contra)</label>
        <input type="number" id="oddLay" step="0.01" min="1.01" placeholder="Ex: 1.50">
      </div>
      <div class="input-group">
        <label for="stake">Stake (R$)</label>
        <input type="number" id="stake" step="0.01" min="0.01" placeholder="Ex: 100.00">
      </div>
    </section>

    <section class="results-grid">
      <!-- Back/Lay -->
      <div class="result-card">
        <h3>🟢 Fechar Back → Lay</h3>
        <p class="desc">Você tem Back aberto, vai fechar com Lay</p>
        <dl>
          <dt>Rentabilidade:</dt><dd><span id="blRent">—</span></dd>
          <dt>Lucro garantido:</dt><dd><span id="blLucro">—</span></dd>
          <dt>Valor no Lay:</dt><dd><span id="blValor">—</span></dd>
        </dl>
      </div>

      <!-- Lay/Back -->
      <div class="result-card">
        <h3>🔴 Fechar Lay → Back</h3>
        <p class="desc">Você tem Lay aberto, vai fechar com Back</p>
        <dl>
          <dt>Responsabilidade Lay:</dt><dd><span id="lbResp">—</span></dd>
          <dt>Rentabilidade:</dt><dd><span id="lbRent">—</span></dd>
          <dt>Lucro garantido:</dt><dd><span id="lbLucro">—</span></dd>
          <dt>Valor no Back:</dt><dd><span id="lbValor">—</span></dd>
        </dl>
      </div>
    </section>

    <section class="bonus-card">
      <h2>🎯 Bônus: Análise de Odd de Quebra</h2>
      <p class="desc">Para saber a odd mínima que você precisa apostar pra ser lucrativo no longo prazo.</p>
      <div class="input-group-inline">
        <div class="input-group">
          <label for="totalJogos">Número de jogos apostados</label>
          <input type="number" id="totalJogos" min="1" placeholder="Ex: 17">
        </div>
        <div class="input-group">
          <label for="totalVitorias">Número de vitórias</label>
          <input type="number" id="totalVitorias" min="0" placeholder="Ex: 11">
        </div>
      </div>
      <div class="quebra-result">
        <div>
          <strong>Odd de quebra:</strong> <span id="oddQuebra">—</span>
          <small>(apostar em odds acima disso = lucro no longo prazo)</small>
        </div>
        <div>
          <strong>Win rate necessário:</strong> <span id="winRate">—</span>
        </div>
      </div>
    </section>

    <section class="bonus-card">
      <h2>🔄 Conversor Back ↔ Lay</h2>
      <p class="desc">Converte entre odd back e lay considerando a comissão da exchange (Betfair, Betdaq, etc).</p>
      <div class="input-group">
        <label for="comissao">Comissão da exchange (%)</label>
        <input type="number" id="comissao" step="0.1" min="0" max="10" value="5">
      </div>
      <div class="input-group-inline">
        <div class="input-group">
          <label for="oddBackConv">Odd Back</label>
          <input type="number" id="oddBackConv" step="0.01" placeholder="Ex: 1.75">
        </div>
        <div class="input-group">
          <label for="oddLayConv">Odd Lay equivalente</label>
          <input type="number" id="oddLayConv" step="0.01" placeholder="Ex: 2.33">
        </div>
      </div>
      <small class="hint">Digite em um campo — o outro atualiza automaticamente</small>
    </section>

    <footer>
      <p>Calculadora baseada na planilha <strong>Cálculos para Trade Esportivo (Nettuno)</strong></p>
      <p>Inspirado em <a href="https://www.youtube.com/nettunotrader" target="_blank">Nettuno Trader</a></p>
    </footer>
  </main>
  <script src="script.js"></script>
</body>
</html>
```

### 2. `style.css` — Sépia/dourado (mesmo padrão reprogrming-links)

```css
/* Reset e base */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8d4b8 100%);
  color: #3a2e1f;
  min-height: 100vh;
  padding: 2rem 1rem;
}
main { max-width: 900px; margin: 0 auto; }

/* Header */
header { text-align: center; margin-bottom: 2.5rem; }
h1 { font-size: 2.5rem; color: #6b4f1d; margin-bottom: 0.5rem; }
.subtitle { color: #8a6b3f; font-size: 1.1rem; }

/* Cards */
.input-card, .result-card, .bonus-card {
  background: rgba(255, 250, 240, 0.85);
  border: 1px solid #d4b896;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(107, 79, 29, 0.08);
}
h2 { color: #6b4f1d; margin-bottom: 1rem; font-size: 1.3rem; }
h3 { color: #6b4f1d; margin-bottom: 0.5rem; font-size: 1.1rem; }
.desc { color: #8a6b3f; font-size: 0.9rem; margin-bottom: 1rem; }

/* Inputs */
.input-group { margin-bottom: 1rem; }
.input-group-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #5a4520; font-size: 0.9rem; }
input[type="number"] {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 2px solid #d4b896;
  border-radius: 8px;
  background: #fffaf0;
  font-size: 1rem;
  color: #3a2e1f;
  transition: border-color 0.2s;
}
input[type="number"]:focus { outline: none; border-color: #b8902f; }

/* Results */
.results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
@media (max-width: 600px) { .results-grid, .input-group-inline { grid-template-columns: 1fr; } }
dl { display: grid; grid-template-columns: 1fr auto; gap: 0.5rem 1rem; align-items: center; }
dt { font-weight: 600; color: #5a4520; font-size: 0.9rem; }
dd { font-weight: 700; color: #6b4f1d; font-size: 1.1rem; text-align: right; }
dd.positivo { color: #2d6e3e; }
dd.negativo { color: #a8392f; }

/* Quebra result */
.quebra-result {
  background: rgba(184, 144, 47, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  gap: 0.8rem;
}
.quebra-result span { font-size: 1.2rem; font-weight: 700; color: #6b4f1d; }
small { color: #8a6b3f; font-size: 0.85rem; display: block; margin-top: 0.3rem; }
.hint { font-style: italic; }

/* Footer */
footer { text-align: center; margin-top: 2.5rem; color: #8a6b3f; font-size: 0.9rem; }
footer a { color: #b8902f; text-decoration: none; }
footer a:hover { text-decoration: underline; }
```

### 3. `script.js` — Lógica de cálculo

```javascript
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

// === Odd de quebra ===
function calcQuebra() {
  const total = parseFloat(document.getElementById('totalJogos').value);
  const vitorias = parseFloat(document.getElementById('totalVitorias').value);

  if (!isFinite(total) || !isFinite(vitorias) || total <= 0 || vitorias < 0) {
    document.getElementById('oddQuebra').textContent = '—';
    document.getElementById('winRate').textContent = '—';
    return;
  }

  const oddQuebra = total / vitorias;
  const winRate = (vitorias / total) * 100;

  document.getElementById('oddQuebra').textContent = oddQuebra.toFixed(3);
  document.getElementById('winRate').textContent = `${winRate.toFixed(1)}%`;
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

document.getElementById('totalJogos').addEventListener('input', calcQuebra);
document.getElementById('totalVitorias').addEventListener('input', calcQuebra);

document.getElementById('oddBackConv').addEventListener('input', () => calcConversor('back'));
document.getElementById('oddLayConv').addEventListener('input', () => calcConversor('lay'));
document.getElementById('comissao').addEventListener('input', () => {
  // Recalcular com base em qual campo tem valor
  const oddBackEl = document.getElementById('oddBackConv');
  if (oddBackEl.value) calcConversor('back');
});
```

### 4. `vercel.json` — Config mínima

```json
{
  "buildCommand": null,
  "outputDirectory": "."
}
```

(Vai pegar os 3 arquivos direto da raiz)

### 5. `README.md`

```markdown
# Calculadora Lay/Back — Trading Esportivo

Site estático que calcula:
- Back → Lay (fechar trade aberto com lucro)
- Lay → Back (fechar trade lay aberto)
- Odd de quebra (análise de lucratividade no longo prazo)
- Conversor Back ↔ Lay (com comissão da exchange)

Baseado na planilha do Nettuno Trader.

## Como usar

1. Preencha Odd Back, Odd Lay e Stake
2. Resultados aparecem automaticamente
3. Para análise de odd de quebra: preencha jogos e vitórias

## Deploy

Vercel auto-deploy a cada push em `main`.

## Stack

HTML + CSS + JS vanilla. Zero build. Cálculo 100% client-side.
```

---

## Critérios de aceitação

1. **Inputs funcionais:** preencher Odd Back, Odd Lay e Stake atualiza TODOS os resultados em tempo real (sem precisar clicar botão)
2. **Back/Lay correto:**
   - Input (2.4, 1.5, 100) → rentabilidade 60%, lucro R$60, valor R$160 (igual planilha)
3. **Lay/Back correto:**
   - Input (2.4, 1.5, 100) → responsabilidade R$50, rentabilidade 75%, lucro R$37.50, valor R$62.50
4. **Odd de quebra:** input (17, 11) → odd 1.545, win rate 64.7%
5. **Conversor:** input (back 1.75, comissão 5%) → lay ~2.33 (validar fórmula Betfair)
6. **Visual sépia/dourado:** igual reprogrming-links
7. **Responsivo:** cards empilham em mobile (< 600px)
8. **Deploy:** push em main → URL Vercel funcional em < 1min

---

## Restrições

- **NÃO mexer** em código de outros projetos
- **NÃO usar frameworks** (React, Vue, etc) — vanilla pra ficar leve
- **NÃO adicionar backend** — tudo client-side
- **NÃO commitar** o PAT do GitHub
- **NÃO fazer push** antes do Vitor revisar a URL

---

## Como rodar (passos pro OpenCode)

1. Criar `index.html`, `style.css`, `script.js`, `vercel.json`, `README.md` na raiz do repo
2. Validar HTML/CSS/JS com `python3 -m http.server` local
3. Inicializar git, fazer primeiro commit local
4. **NÃO pushar** — esperar Vitor revisar

**Deploy (depois do Vitor aprovar):**
1. Vitor cria repo `limavit/calculadora-lay-back` (privado) no GitHub
2. Push via PAT (NUNCA imprimir o token)
3. Conectar repo na Vercel
4. URL pública: `https://calculadora-lay-back.vercel.app`

---

## Histórico

- **2026-08-10 14:48 BRT** — Vitor pediu site rápido que faça cálculo lay/back
- **2026-08-10 14:50 BRT** — Vitor escolheu nome `calculadora-lay-back`
- **2026-08-10 14:51 BRT** — Whatson escreveu spec, design sépia/dourado (A) com bônus
