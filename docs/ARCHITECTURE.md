# Arquitetura do Sistema - Omegle Next

## 1. Visão Geral
A plataforma é baseada em uma arquitetura de microsserviços e comunicação bidirecional em tempo real para permitir conexões ultrarrápidas entre usuários desconhecidos via texto, áudio e vídeo.

```
[ Frontend: Next.js 14 / WebRTC ] 
       │                      ▲
       │ REST HTTP            │ Socket.IO Signaling (WebRTC SDP/ICE)
       ▼                      ▼
[ Backend: Node.js / Express / Socket.IO ]
       │                      │
       ▼                      ▼
[ PostgreSQL (Prisma) ]   [ Redis (Queue & Matchmaking) ]
```

## 2. Padrões de Projeto & SOLID
- **Controllers**: Gerenciam as requisições HTTP e serialização de respostas.
- **Services**: Contêm a lógica de negócio isolada (Autenticação, Matchmaking, Admin).
- **Repositories**: Encapsulam chamadas ao banco PostgreSQL via Prisma ORM.
- **DTOs**: Validam a estrutura das requisições REST usando Zod.
- **Middlewares**: Processam tokens JWT e tratamento centralizado de erros.

## 3. Fluxo de Matchmaking
1. Usuário envia evento `findPartner` via Socket.IO contendo o modo (`TEXT`, `VIDEO`, `AUDIO`) e a lista de interesses.
2. O `MatchmakingService` busca pares compatíveis no Redis. Se houver correspondência de interesses, conecta prioritariamente; caso contrário, utiliza a fila global FIFO.
3. Ao formar um par, uma sala exclusiva `room:<uuid>` é criada e os sockets entram no canal.
4. Para vídeo/voz, inicia-se a negociação WebRTC (troca de SDP offer, answer e ICE candidates via Socket.IO).
5. Mensagens instantâneas trafegam diretamente entre a sala do Socket.IO.
