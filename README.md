# TurboFit Backend

API backend para o projeto TurboFit.

## Visão geral

O backend é uma API Express com suporte a:
- autenticação JWT
- banco de dados PostgreSQL
- integração com Stripe (pagamentos, checkout e webhooks)
- integração com OpenAI para funcionalidades de IA
- rotas de usuário, treinos, hábitos, vídeos e assinaturas

## Pré-requisitos

- Node.js 18+ (recomendado)
- npm
- PostgreSQL

## Instalação

1. Copie o arquivo de exemplo para `.env`:

```bash
cd turbofit-backend
copy .env.example .env
```

2. Preencha as variáveis de ambiente no `.env`.

3. Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Use as seguintes variáveis no arquivo `.env`:

```env
PORT=3001
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_ANNUAL_PRICE_ID=
FRONTEND_URL=http://localhost:5173
```

### Observações

- `DATABASE_URL`: string de conexão PostgreSQL.
- `JWT_SECRET`: segredo para assinar/verificar tokens JWT.
- `OPENAI_API_KEY`: chave de API OpenAI.
- `STRIPE_SECRET_KEY`: chave secreta Stripe.
- `STRIPE_WEBHOOK_SECRET`: segredo do webhook Stripe.
- `STRIPE_MONTHLY_PRICE_ID` e `STRIPE_ANNUAL_PRICE_ID`: IDs dos preços configurados no Stripe.
- `FRONTEND_URL`: URL do frontend usada em CORS e redirecionamentos.

## Scripts úteis

- `npm run dev`: inicia o servidor em modo de desenvolvimento com `nodemon`
- `npm run build`: compila o projeto com TypeScript (`tsc`)
- `npm start`: inicia a versão compilada a partir de `dist`
- `npm test`: placeholder para testes

## Executando o projeto

### Modo de desenvolvimento

```bash
npm run dev
```

### Build e produção

```bash
npm run build
npm start
```

## Banco de dados

O projeto inclui arquivos de esquema em `database/schema.sql` e `db/schema.sql`.

Crie o banco e execute as migrações/esquemas manualmente antes de rodar a aplicação.

## Endpoints principais

- `GET /health` — verifica se a API está ativa
- `POST /auth/login` — login do usuário
- `POST /auth/register` — cadastro do usuário
- `POST /stripe/create-checkout-session` — cria sessão de checkout
- `POST /stripe/webhook` — endpoint de webhook Stripe
- `POST /ai` — rota de IA usando OpenAI

## Observações finais

As variáveis `Resend__*` não são usadas neste backend e podem ser ignoradas.
