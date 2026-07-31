'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useSocket } from '../../contexts/SocketContext';

interface TextChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isPartnerTyping: boolean;
  isConnectedPartner: boolean;
}

export const TextChat: React.FC<TextChatProps> = ({
  messages,
  onSendMessage,
  isPartnerTyping,
  isConnectedPartner,
}) => {
  const { socket } = useSocket();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    if (socket && isConnectedPartner) {
      socket.emit('typing');

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping');
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    if (inputText.trim() && isConnectedPartner) {
      onSendMessage(inputText);
      setInputText('');
      if (socket) socket.emit('stopTyping');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {isConnectedPartner ? 'Conversa Ativa' : 'Aguardando parceiro...'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Enter para enviar</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="my-auto text-center text-slate-400 text-xs py-8">
            Diga "Olá" para iniciar a conversa!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                msg.isSelf ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words shadow-sm ${
                  msg.isSelf
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isPartnerTyping && (
          <div className="self-start flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[11px] font-medium text-slate-400">Estranho digitando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2">
        <textarea
          rows={1}
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={!isConnectedPartner}
          placeholder={isConnectedPartner ? 'Digite sua mensagem...' : 'Aguarde conexão...'}
          className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={send}
          disabled={!inputText.trim() || !isConnectedPartner}
          className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white transition-colors flex items-center justify-center focus:outline-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
