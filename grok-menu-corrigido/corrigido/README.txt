Patch aplicado:
- settings-menu.js
  - GAP alterado de 8 para 6
  - ALIGN_OFFSET_X = 7 adicionado
  - cálculo de X alterado para rect.right - menuRect.width - ALIGN_OFFSET_X

Objetivo:
- aproximar o menu dos valores reais observados no DOM correto:
  translate(1036px, 58px)
  em vez de translate(1043px, 60px)

Arquivos não alterados:
- attach-menu.js
- attach-settings-tooltips.js
- model-select-menu.js
- index.html
