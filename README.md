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
