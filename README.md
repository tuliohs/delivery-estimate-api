# Delivery Estimate API

## Descrição

A Delivery Estimate API é uma aplicação backend desenvolvida em Node.js que fornece cotações de frete de diversos serviços para determinar a melhor opção disponível. A API integra múltiplos serviços de cotação e retorna as melhores opções baseadas em diferentes critérios.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando a Aplicação](#executando-a-aplicação)
- [Endpoints](#endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

1. Clone o repositório:

    ```sh
    git clone <URL_DO_REPOSITÓRIO>
    ```

2. Navegue até o diretório do projeto:

    ```sh
    cd delivery-estimate-api
    ```

3. Instale as dependências:

    ```sh
    npm install
    ```

## Configuração

*Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:*

```env
PORT=8022
DEFAULT_SENDER_ZIPCODE=00000000
KG_QUOTATION_URL=https://example.com/kg-quotation
KG_QUOTATION_TOKEN=your-kg-token
LOG_QUOTATION_URL=https://example.com/log-quotation
LOG_QUOTATION_TOKEN=your-log-token
MELHOR_QUOTATION_URL=https://example.com/melhor-quotation
```

### Para iniciar a aplicação, execute:

npm start

### Para desenvolvimento, você pode usar:

npm run dev

### Endpoints
`GET /ping`
Verifica se a API está funcionando.

*Resposta:*

pong 🏓

`GET /api/quotation`
Obtém cotações de frete.

### Parâmetros de Query:

- `zipCode` (string, obrigatório): CEP do destino.
- `packageId` (string, opcional): ID do pacote pré-definido.
- `weight` (string, opcional): Peso do pacote.
- `height` (string, opcional): Altura do pacote.
- `width` (string, opcional): Largura do pacote.
- `length` (string, opcional): Comprimento do pacote.
- `insurancePrice` (string, opcional): Valor do seguro do pacote.

*Resposta de Sucesso:*

{
  "options": [
    {
      "gateway": "string",
      "company": "string",
      "service": "string",
      "price": 0,
      "deliveryEstimate": "string"
    }
  ],
  "_metadata": []
}

`GET /api/health`

*Resposta:*

{
  "status": "ok"
}

## Estrutura do projeto

*backend*
└── delivery-estimate-api
    ├── README.md
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── adapters
    │   │   ├── FlexQuotation
    │   │   │   └── index.ts
    │   │   ├── KgQuotation
    │   │   │   └── index.ts
    │   │   ├── LogQuotation
    │   │   │   └── index.ts
    │   │   ├── MelhorQuotation
    │   │   │   └── index.ts
    │   │   └── core
    │   │       └── types
    │   │           └── QuotationAdapter.ts
    │   ├── controllers
    │   │   └── quotation.controller.ts
    │   ├── data
    │   │   └── defaultData.ts
    │   ├── models
    │   │   ├── Customer.ts
    │   │   ├── Quotation.ts
    │   │   └── Shipping.ts
    │   ├── server.ts
    │   ├── services
    │   │   ├── location.service.ts
    │   │   └── packages.service.ts
    │   └── utils
    │       └── date.ts
    └── tsconfig.json

## COntribuição

Fork este repositório.
Crie uma branch para sua feature (git checkout -b feature/nova-feature).
Commit suas mudanças (git commit -am 'Adiciona nova feature').
Push para a branch (git push origin feature/nova-feature).
Abra um Pull Request.

## Licença
Este projeto está licenciado sob a MIT License.