# Referência de Eventos WebSocket (Socket.IO)

## Eventos Cliente -> Servidor

| Evento | Payload | Descrição |
|---|---|---|
| `findPartner` | `{ mode: 'TEXT' \| 'VIDEO' \| 'AUDIO', interests?: string[], partnerGender?: 'MALE' \| 'FEMALE' \| 'BOTH', myGender?: 'MALE' \| 'FEMALE' \| 'UNSPECIFIED' }` | Solicita pareamento de conversa com filtros de gênero e interesses |
| `skipPartner` | `{}` | Cancela conversa atual e solicita novo parceiro |
| `leaveRoom` | `{}` | Abandona a sala de conversa |
| `sendMessage` | `{ text: string }` | Envia mensagem de texto para a sala |
| `typing` | `{}` | Notifica que o usuário está digitando |
| `stopTyping` | `{}` | Notifica que o usuário parou de digitar |
| `videoOffer` | `{ offer: RTCSessionDescriptionInit }` | Envia oferta WebRTC SDP |
| `videoAnswer` | `{ answer: RTCSessionDescriptionInit }` | Envia resposta WebRTC SDP |
| `iceCandidate` | `{ candidate: RTCIceCandidateInit }` | Envia candidato ICE |

## Eventos Servidor -> Cliente

| Evento | Payload | Descrição |
|---|---|---|
| `waitingForPartner` | `{ message: string }` | Confirmou entrada na fila de espera |
| `partnerFound` | `{ roomId, partnerId, partnerName, isInitiator, mode }` | Notifica que um parceiro foi encontrado |
| `partnerLeft` | `{ message: string }` | Notifica que o parceiro encerrou ou desconectou |
| `receiveMessage` | `{ senderId, senderName, text, timestamp }` | Mensagem recebida |
| `typing` | `{ userId }` | Notifica digitação do parceiro |
| `stopTyping` | `{ userId }` | Notifica parada de digitação do parceiro |
| `videoOffer` | `{ offer, senderId }` | Oferta WebRTC recebida |
| `videoAnswer` | `{ answer, senderId }` | Resposta WebRTC recebida |
| `iceCandidate` | `{ candidate, senderId }` | Candidato ICE recebido |
