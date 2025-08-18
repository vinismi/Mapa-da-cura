"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    type: "text",
    content:
      "Olá! Sou seu assistente de vendas da ZapSales. Para começarmos, qual seu nome?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const { toast } = useToast();

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now().toString(), timestamp: new Date() },
    ]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ sender: "user", type: "text", content: text });
    setUserInput("");
    setIsTyping(true);

    // Add a small delay to simulate human response time
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Scripted + AI flow
      switch (conversationStep) {
        case 0: // Greeting, asked for name
          const name = text.trim();
          const response1 = await generatePersonalizedResponse({
            userInput: `O usuário disse que seu nome é ${name}. Dê as boas-vindas de forma calorosa e pergunte qual é o seu maior desafio em vendas hoje.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: response1.personalizedResponse,
          });
          setConversationStep(1);
          break;
        case 1: // Asked about sales challenge
          const challenge = text.trim();
          const response2 = await generatePersonalizedResponse({
            userInput: `O desafio de vendas do usuário é: "${challenge}". Reconheça o desafio com empatia e diga que temos uma solução que pode ajudar muito.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: response2.personalizedResponse,
          });
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          addMessage({ sender: "bot", type: "text", content: "Dê uma olhada em como nossa ferramenta pode te ajudar com isso:" });
          addMessage({ sender: "bot", type: "video", content: "https://placehold.co/600x400.png", dataAiHint: 'product demo' });
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          addMessage({ sender: "bot", type: "text", content: "Muitos dos nossos clientes tinham o mesmo problema. Veja o que um deles disse:" });
          addMessage({ sender: "bot", type: "image", content: "https://placehold.co/400x250.png", dataAiHint: 'customer testimonial' });
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          addMessage({ sender: "bot", type: "text", content: "Nosso especialista em vendas, João, gravou uma mensagem de áudio especialmente para você:" });
          addMessage({ sender: "bot", type: "audio", content: "audio-placeholder" });
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          const response3 = await generatePersonalizedResponse({ userInput: 'Pergunte ao usuário o que ele achou das demonstrações e se ele tem alguma dúvida.' });
          addMessage({ sender: 'bot', type: 'text', content: response3.personalizedResponse });

          setConversationStep(2);
          break;
        case 2: // After all media, offer upsell
          const interest = text.trim();
          const finalResponse = await generatePersonalizedResponse({
            userInput: `O usuário respondeu "${interest}" após ver as demonstrações. Agradeça o feedback e ofereça um desconto exclusivo por tempo limitado e um link para checkout para fechar a venda. Mencione que a oferta inclui uma garantia de acesso antecipado a todos os bônus.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: finalResponse.personalizedResponse,
          });
          addMessage({
            sender: "bot",
            type: "button",
            content: "Garantir Acesso com Desconto",
            meta: {
              text: "Temos uma oferta de upsell para você também! Após a compra, você terá acesso a um desconto exclusivo em nossos produtos complementares para potencializar ainda mais seus resultados.",
            },
          });
          setConversationStep(3);
          break;
        default:
          const genericResponse = await generatePersonalizedResponse({
            userInput: text,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: genericResponse.personalizedResponse,
          });
          break;
      }
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description:
          "Não foi possível obter uma resposta. Por favor, tente novamente.",
      });
      addMessage({
        sender: "bot",
        type: "text",
        content:
          "Desculpe, estou com alguns problemas técnicos no momento. Poderia tentar novamente em um instante?",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="h-screen max-h-screen">
      <ChatLayout
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        userInput={userInput}
        onUserInput={setUserInput}
      />
    </main>
  );
}
