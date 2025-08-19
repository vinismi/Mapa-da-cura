"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    type: "audio",
    content: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Placeholder audio
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
     meta: {
      audioText: "Olá! Eu sou João, seu guia nesta jornada de despertar espiritual. Preparei algo especial para você. Vamos começar?"
    }
  },
  {
    id: "2",
    sender: "bot",
    type: "text",
    content: "Para começar, como posso te chamar?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const { toast } = useToast();
  const [userName, setUserName] = useState("");

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now().toString(), timestamp: new Date() },
    ]);
  };
  
  const showTypingIndicator = async (duration: number) => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, duration));
      setIsTyping(false);
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ sender: "user", type: "text", content: text });
    setUserInput("");
    
    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));

    try {
      switch (conversationStep) {
        case 0: // Welcome, asked for name
          const name = text.trim();
          setUserName(name);
          
          await showTypingIndicator(2000);
          addMessage({
            sender: "bot",
            type: "text",
            content: `Que bom ter você aqui, ${name}!`,
          });
          
          await showTypingIndicator(2200);

          addMessage({
            sender: "bot",
            type: "text",
            content: "Qual área da sua vida você sente que precisa de mais foco e cura agora?",
            options: ["Saúde física e mental", "Prosperidade financeira", "Relacionamentos", "Energia espiritual"],
          });
          setConversationStep(1);
          break;

        case 1: // Asked about area to heal
           const area = text;
           
           await showTypingIndicator(2500);
           const empathyResponse = await generatePersonalizedResponse({ userInput: `O usuário ${userName} escolheu a área "${area}" para focar. Mostre empatia, dizendo que entende perfeitamente e que também já passou por uma situação parecida nessa área. Seja breve e direto.` });

           addMessage({
            sender: "bot",
            type: "text",
            content: empathyResponse.personalizedResponse
          });
          
          await showTypingIndicator(2500);

          addMessage({ sender: "bot", type: "text", content: "Muitas pessoas chegam até mim com essa mesma questão. E o primeiro passo que damos juntos é sempre o mais importante." });
          
          await showTypingIndicator(2200);

          addMessage({
            sender: "bot",
            type: "text",
            content: "Eu acredito tanto no poder da transformação que preparei algo que pode realmente te ajudar. Você me permite te mostrar o caminho?",
            options: ["Sim, pode mostrar!", "Como assim?", "Não tenho certeza..."]
          });
          setConversationStep(2);
          break;

        case 2: // After permission
            await showTypingIndicator(1800);
            addMessage({ sender: "bot", type: "text", content: "Que ótimo! Fico feliz com sua abertura." });
            await showTypingIndicator(2200);
            addMessage({ sender: "bot", type: "text", content: "Preparei algo nos meus status para você ver histórias de pessoas que, como nós, buscaram e encontraram um novo caminho." });
            await showTypingIndicator(2500);
            addMessage({ sender: "bot", type: "status", content: "Dê uma olhada e volte aqui para me dizer o que achou!", options: ["Vi os status, é inspirador!", "Pronto, e agora?"] });
            setConversationStep(3);
            break;

        case 3: // After Status
            await showTypingIndicator(2500);
            addMessage({ sender: "bot", type: "text", content: `Incrível, não é? Ver a jornada de outras pessoas nos dá força.` });
            await showTypingIndicator(2500);
            addMessage({ sender: "bot", type: "text", content: `Fico feliz que tenha se inspirado, ${userName}.` });
            await showTypingIndicator(3000);
            addMessage({ sender: "bot", type: "text", content: "Agora, prepare-se. Senti uma forte conexão com sua energia e nosso especialista vai te ligar agora para uma conversa rápida e esclarecedora." });
            
            // Trigger the live call
            await showTypingIndicator(3000);
            addMessage({ sender: "bot", type: "live-call", content: "Chamada de Vídeo de Luz" });

            // Simulate conversation after call ends
            setTimeout(async () => {
                setMessages(prev => prev.filter(m => m.type !== 'live-call'));
                await showTypingIndicator(2500);
                addMessage({ sender: "bot", type: "text", content: `Uau, que conversa! Espero que a conexão com nosso especialista tenha clareado seu caminho.` });

                await showTypingIndicator(3000);
                addMessage({ sender: "bot", type: "testimonial", content: "Eu nunca imaginei que algo simples poderia transformar minha vida! Após usar o Mapa da Cura, senti uma paz interior profunda que nunca tinha experimentado antes.", meta: { author: "Ana S." } });
                
                await showTypingIndicator(2500);
                addMessage({ sender: "bot", type: "text", content: `O depoimento da Ana é poderoso, não acha, ${userName}? Isso é o que o Mapa da Cura faz.`});
                
                await showTypingIndicator(3000);
                 const finalOffer = await generatePersonalizedResponse({
                    userInput: `O usuário ${userName} acabou de falar com um especialista e viu um depoimento. Crie uma mensagem curta de oferta final. Diga que agora ele está pronto para o primeiro passo. Mencione o preço de R$39,99 e convide-o a finalizar a compra.`,
                });
                
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: finalOffer.personalizedResponse,
                });

                await showTypingIndicator(2500);
                
                addMessage({ sender: "bot", type: "text", content: "E o melhor: com nossa garantia de 7 dias, seu risco é zero. Se não ficar satisfeito, basta nos avisar.", options: ["Sim, quero garantir minha jornada!"] });

                setConversationStep(4);
            }, 10000); // Wait 10 seconds to simulate call duration

            break;

        case 4: // Final CTA
            await showTypingIndicator(2000);
            addMessage({ sender: "bot", type: "text", content: "Clique abaixo para garantir sua jornada espiritual e acessar todos os bônus. Sua transformação começa agora." });
            await showTypingIndicator(1500);
            addMessage({
                sender: "bot",
                type: "button",
                content: "Sim, quero garantir minha jornada espiritual!",
                 meta: {
                  text: "Você acaba de garantir seu acesso ao Mapa da Cura Espiritual e todos os bônus. Prepare-se para uma transformação profunda! Em breve, você receberá todas as informações para acessar seu conteúdo.",
                  image: "https://placehold.co/600x400.png",
                  imageHint: "spiritual map golden light"
                },
              });
            setConversationStep(5);
            break;
            
        default:
          await showTypingIndicator(2000);
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
