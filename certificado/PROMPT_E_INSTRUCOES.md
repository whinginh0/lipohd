# 🎓 Gerador de Certificado Oficial — Guia de Uso & Prompt para Novas Ofertas

Esta pasta `/certificado` é um módulo **100% independente e portátil**. Você pode copiar esta pasta inteira para qualquer outro projeto ou landing page de infoproduto para gerar certificados automáticos em alta resolução com download em `.PNG`, impressão em página única (A4 paisagem) e salvamento no `localStorage`.

---

## 📁 Estrutura dos Arquivos
```
certificado/
├── index.html                  # Interface completa do formulário, modal e preview
├── style.css                   # Design system e estilos de impressão (@media print)
├── script.js                   # Motor Canvas 2D com configurações no topo (CERT_CONFIG)
├── img/
│   └── certificado.webp        # Imagem base do certificado (substitua pela sua)
└── PROMPT_E_INSTRUCOES.md      # Este guia e o prompt pronto para IA
```

---

## ⚙️ Como Adaptar para Outra Oferta (3 Passos Rápidos)

### Passo 1: Substitua a Imagem do Certificado
Coloque o seu novo modelo de certificado em `img/` (ex: `img/certificado.webp` ou `img/certificado.png`).

### Passo 2: Ajuste o Objeto `CERT_CONFIG` no topo de `script.js`
Abra o arquivo `script.js`. As primeiras linhas contêm todas as variáveis que você precisa alterar:

```javascript
const CERT_CONFIG = {
  // 1. Caminho da Imagem Base do Certificado
  imageSrc: 'img/certificado.webp',

  // 2. Chave de Armazenamento Local (mude para cada produto/oferta)
  storageKey: 'cert_data_lipohd_v1',

  // 3. Configurações de Renderização do Nome do Aluno ("Nome completo: ____________________")
  name: {
    xPosition: 745,       // Centralizado no meio exato do certificado (alinhado com o texto e título)
    yPosition: 660,       // Posicionado limpo e nítido acima da linha
    maxAllowedWidth: 860, // Largura máxima antes de reduzir a fonte
    initialFontSize: 32,  // Tamanho da fonte padrão
    minFontSize: 18,      // Tamanho mínimo para nomes longos
    fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
    fontWeight: '700',
    color: '#013E4B'      // Deep navy teal combinando com a identidade
  },

  // 4. Configurações da Data de Conclusão ("Data: ____________________")
  date: {
    xPosition: 440,       // Centro da linha de data
    yPosition: 896,       // Posicionado perfeitamente sobre o traço
    fontSize: 19,
    fontFamily: "'Poppins', system-ui, sans-serif",
    fontWeight: '600',
    color: '#014E5E'
  },

  // 5. Configurações da Assinatura Oficial (Após a palavra "Assinatura:")
  signature: {
    text: 'Equipe Lipo HD',
    xPosition: 1035,      // Deslocado para o traço após "Assinatura:" e antes do selo
    yPosition: 892,       // Posicionado acima do traço
    fontSize: 19,         // Tamanho reduzido e proporcional
    fontFamily: "'Dancing Script', 'Alex Brush', cursive",
    fontWeight: '600',
    color: '#013E4B'
  }
};
```

---

## 🤖 PROMPT PRONTO PARA USAR EM OUTRAS OFERTAS COM IA

Quando você criar uma nova oferta e tiver uma nova imagem de certificado (mesmo que com resolução ou dimensões diferentes), copie e envie o prompt abaixo para a IA:

```markdown
Tenho uma nova imagem de certificado para meu curso/oferta e quero que você ajuste as coordenadas de renderização no arquivo `script.js` da pasta `/certificado`.

A nova imagem do certificado está localizada em: [COLOQUE O CAMINHO DA SUA NOVA IMAGEM AQUI]
O nome do meu produto é: [NOME DO SEU PRODUTO / CURSO]
O texto da assinatura deve ser: [NOME DO INSTRUTOR OU EQUIPE]

Instruções para a IA:
1. Verifique as dimensões em pixels da nova imagem (largura x altura).
2. Analise a imagem para encontrar os pontos exatos:
   - Centro horizontal (X) e vertical (Y) do espaço destinado ao NOME DO ALUNO.
   - Posição horizontal (X) e vertical (Y) da DATA de conclusão.
   - Posição horizontal (X) e vertical (Y) acima da linha de ASSINATURA.
3. Atualize o objeto `CERT_CONFIG` no topo do arquivo `script.js` com as novas coordenadas, mantendo o redimensionamento automático de fonte, persistência no localStorage e opções de download .PNG e impressão em folha única (A4 Paisagem).
4. Atualize o título e textos em `index.html` e a paleta de cores em `style.css`.
```
