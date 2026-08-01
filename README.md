# 🚀 FluxChat - Plataforma de Chat Anônimo em Tempo Real

Aplicação web moderna, responsiva e de alta performance inspirada no Omegle, com suporte a chats por **Texto**, **Áudio** e **Vídeo (WebRTC)** em tempo real, sistema de **Matchmaking com Redis**, cadastro/opção anônima, gerenciamento de interesses e **Painel Administrativo**.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (Modo Claro & Escuro)
- **Comunicação:** Socket.IO Client & WebRTC Native API
- **Ícones:** Lucide React

### Backend
- **Ambiente:** Node.js + Express
- **Linguagem:** TypeScript
- **Comunicação:** Socket.IO Server & REST API
- **Autenticação:** JWT (JSON Web Token) + Bcryptjs
- **Validação:** Zod

### Banco de Dados & Armazenamento
- **Banco de Dados Relacional:** PostgreSQL
- **ORM:** Prisma ORM
- **Fila & Matchmaking:** Redis (ioredis com suporte a Provider In-Memory Fallback)

### Infraestrutura
- **Containers:** Docker & Docker Compose

---

## 📁 Estrutura de Pastas do Projeto

```text
Omegle/
├── backend/                  # Servidor API Express, Socket.IO & Lógica de Negócio
│   ├── src/
│   │   ├── config/           # Configurações de env, Prisma e Redis Client
│   │   ├── controllers/      # Controllers REST (Auth, User, Interest, Admin, Session)
│   │   ├── dtos/             # Schemas Zod e DTOs de entrada
│   │   ├── middlewares/      # Middlewares de Autenticação JWT e Tratamento de Erros
│   │   ├── repositories/     # Abstração do Prisma ORM (Repository Pattern)
│   │   ├── routes/           # Rotas REST da API (/api/v1)
│   │   ├── services/         # Regras de Negócio (Auth, User, Matchmaking, Admin)
│   │   ├── sockets/          # Handlers de eventos Socket.IO (Match, Chat, WebRTC)
│   │   ├── types/            # Tipagens TypeScript
│   │   └── utils/            # Hashing de Senhas, Tokens JWT e Logger
├── database/                 # Modelagem e Migrações do Banco de Dados
│   └── prisma/
│       ├── schema.prisma     # Schema Prisma (User, Session, Interest, ConnectionHistory, Log)
│       └── seed.ts           # Script de população inicial do banco
├── frontend/                 # Aplicação Next.js 14
│   ├── src/
│   │   ├── app/              # Next.js App Router (Página Inicial, Chat, Admin, Auth)
│   │   ├── components/       # Componentes reutilizáveis (UI, Home, Chat, Admin)
│   │   ├── contexts/         # Contextos React (Auth, Socket, Theme, WebRTC)
│   │   ├── hooks/            # Custom Hooks (Dispositivos de mídia, atalhos)
│   │   ├── services/         # Cliente Axios REST
│   │   └── types/            # Tipos do Frontend
├── docker/                   # Arquivos de Containerização
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/                     # Documentação de Arquitetura e Especificações
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   └── WEBSOCKET_EVENTS.md
├── docker-compose.yml        # Orquestração completa dos containers
└── README.md
```

---

## ⚡ Como Executar o Projeto

### Opção 1: Execução Simplificada via Docker Compose (Recomendado)

Requisitos: Docker e Docker Compose instalados.

1. Clone o repositório e acesse a pasta raiz:
```bash
git clone https://github.com/Lainho08/fluxchat.git
cd fluxchat
```

2. Suba a aplicação inteira (Frontend, Backend, PostgreSQL e Redis) com um único comando:
```bash
docker-compose up --build
```

3. Acesse no seu navegador:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000/health](http://localhost:4000/health)

---

### Opção 2: Execução Local (Modo Desenvolvimento)

#### 1. Pré-requisitos
- Node.js v18+ 
- PostgreSQL ativo na porta 5432
- Redis ativo na porta 6379 (Opcional, o backend possui fallback in-memory)

#### 2. Configurar e Subir o Backend

```bash
cd backend
npm install

# Copie e ajuste as variáveis de ambiente caso necessário
cp .env.example .env

# Gere os arquivos do Prisma Client
npm run prisma:generate

# Execute as migrações no banco PostgreSQL
npm run prisma:migrate

# Popule o banco com dados iniciais (Interesses e usuário Admin)
npm run prisma:seed

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

O servidor backend estará escutando na porta `http://localhost:4000`.

#### 3. Configurar e Subir o Frontend

Em um novo terminal:

```bash
cd frontend
npm install

# Copie as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra seu navegador em `http://localhost:3000`.

---

## 🔑 Credenciais do Administrador (Padrão)

- **Email:** `admin@fluxchat.com`
- **Senha:** `Admin123!`
- **Acesso ao Painel Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🌟 Funcionalidades Implementadas

- **Matchmaking Inteligente:** Algoritmo no Redis que prioriza pareamento por interesses em comum, caindo na fila global FIFO quando necessário.
- **Chat de Texto Instantâneo:** Troca instantânea de mensagens com indicador "digitando...", horário das mensagens e atalho `Enter` para enviar.
- **Chat de Vídeo e Voz WebRTC:** Chamada P2P de vídeo e voz direta no navegador.
- **Controles de Mídia:** Alternar câmera, mutar microfone, compartilhar tela e alternar dispositivos de entrada/saída (câmeras e microfones).
- **Recurso Pular Parceiro:** Tecla `ESC` ou botão "Próximo" reconectam instantaneamente a uma nova pessoa livre.
- **Modo Anônimo:** Entrada direta com 1 clique sem obrigatoriedade de cadastro.
- **Design de Alto Padrão:** Interface limpa, modo claro e escuro, componentes acessíveis e animações suaves.
- **Painel Administrativo:** Acompanhamento de usuários online, salas ativas, total de conexões e logs de auditoria do sistema.

---

## 📜 Licença

Projeto desenvolvido sob a licença MIT.
