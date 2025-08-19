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
    content: "audio-placeholder",
    meta: {
      audioText: "Olá! Eu sou João e estou aqui para te guiar nessa jornada de despertar espiritual. Em breve, você terá acesso ao Mapa da Cura Espiritual, um material exclusivo que pode transformar sua vida. Mas antes de qualquer coisa, gostaria de fazer algo diferente e apresentar o conteúdo para você de forma antecipada. Vamos começar?"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: "2",
    sender: "bot",
    type: "image",
    content: "https://placehold.co/600x400.png",
    dataAiHint: "spiritual map scroll",
    meta: {
      title: "Desbloqueie seu poder espiritual agora!"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    options: ["Vamos começar!"],
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const { toast } = useToast();
  const [userName, setUserName] = useState(""); // We can still use name for personalization

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
    
    // Disable options on previous messages
    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      switch (conversationStep) {
        case 0: // Welcome
          const namePrompt = await generatePersonalizedResponse({
              userInput: `O usuário está pronto para começar. Peça o nome dele para personalizar a conversa.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: namePrompt.personalizedResponse,
          });
          setConversationStep(1);
          break;
        case 1: // Asked for name
          const name = text.trim();
          setUserName(name);
          addMessage({
            sender: "bot",
            type: "text",
            content: `Que bom ter você aqui, ${name}! Para te ajudar da melhor forma, me diga: qual área da sua vida você sente que mais precisa de cura espiritual? Isso nos ajudará a te mostrar como o Mapa da Cura pode transformar sua jornada.`,
            options: ["Saúde física e mental", "Prosperidade financeira", "Relacionamentos pessoais", "Energia espiritual"],
          });
          setConversationStep(2);
          break;
        case 2: // Asked about area to heal
           addMessage({
            sender: "bot",
            type: "text",
            content: "O Mapa da Cura Espiritual vai te ajudar a desbloquear toda a sabedoria que você precisa para prosperar em qualquer área da sua vida. O melhor de tudo: vamos te dar acesso antecipado ao conteúdo, para que você possa testar o material e sentir os benefícios antes de decidir.",
          });
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          addMessage({
            sender: "bot",
            type: "video",
            content: "https://placehold.co/600x400.png",
            dataAiHint: "spiritual guidance video",
            meta: {
              videoTitle: "Aperitivo do Mapa da Cura Espiritual"
            }
          })
          
          addMessage({
            sender: "bot",
            type: "text",
            content: "Assista ao vídeo acima e descubra como o Mapa da Cura Espiritual pode transformar sua vida. Assim que terminar, me diga o que achou!",
            options: ["Sim, sinto que é o que preciso!", "Preciso de mais informações.", "Ainda não estou certo."]
          });
          setConversationStep(3);
          break;

        case 3: // After video
          if (text.toLowerCase().includes("preciso de mais informações")) {
              const moreInfo = await generatePersonalizedResponse({ userInput: `O usuário ${userName} precisa de mais informações. Detalhe os benefícios do Mapa da Cura e mencione os bônus exclusivos (Áudio de Meditação, Ritual de Proteção, Livro dos Salmos, Desconto especial).` });
              addMessage({ sender: "bot", type: "text", content: moreInfo.personalizedResponse, options: ["Entendi! Parece ótimo.", "Ainda tenho dúvidas."] });
          } else if (text.toLowerCase().includes("não estou certo")) {
              addMessage({ sender: "bot", type: "text", content: "Entendo perfeitamente. Às vezes, ver a transformação em outras pessoas nos ajuda a ter mais clareza." });
              addMessage({ sender: "bot", type: "testimonial", content: "Eu nunca imaginei que algo simples poderia transformar minha vida! Após usar o Mapa da Cura, senti uma paz interior profunda que nunca tinha experimentado antes.", meta: { author: "Ana S." } });
              await new Promise(resolve => setTimeout(resolve, 500));
              addMessage({ sender: "bot", type: "text", content: "O que você acha de um depoimento como esse?", options: ["É inspirador!", "Quero saber mais."] });
          } else { // "Sim, sinto que é o que preciso!"
              addMessage({ sender: "bot", type: "text", content: `Incrível, ${userName}! Agora, para você sentir a verdadeira transformação, preparei alguns depoimentos no meu status do WhatsApp. Lá, você verá histórias reais de pessoas que usaram o Mapa e mudaram suas vidas.` });
              await new Promise(resolve => setTimeout(resolve, 500));
              addMessage({ sender: "bot", type: "status", content: "Dê uma olhada no meu status e volte aqui!", meta: { buttonText: "Ver Status do WhatsApp" } });
              await new Promise(resolve => setTimeout(resolve, 1500));
              addMessage({ sender: "bot", type: "text", content: `O depoimento de Ana sobre como o Mapa da Cura transformou sua vida vai te inspirar. Ela passou por um processo de despertar espiritual profundo.`});
              addMessage({ sender: "bot", type: "text", content: `Agora, gostaria de te oferecer algo ainda mais especial. Vamos te chamar para uma ligação de vídeo ao vivo com um especialista. Ele vai conversar com você sobre sua jornada e como o Mapa pode ajudar. Vamos fazer essa conexão?`, options: ["Sim, estou pronto para a ligação.", "Não, prefiro continuar por aqui."] });
          }
          setConversationStep(4);
          break;

        case 4: // After social proof / more info
            if (text.toLowerCase().includes("ligação")) {
                addMessage({ sender: "bot", type: "text", content: "Perfeito! Nosso especialista espiritual já está disponível para conversar com você! Aceite a ligação de vídeo e vamos conversar sobre sua jornada." });
                addMessage({ sender: "bot", type: "live-call", content: "Ligação ao vivo com Especialista Espiritual" });
                await new Promise(resolve => setTimeout(resolve, 2000));
                addMessage({ sender: "bot", type: "text", content: "Espero que a conversa tenha sido esclarecedora!" });
            }

            const finalOffer = await generatePersonalizedResponse({
                userInput: `O usuário ${userName} já viu as provas e talvez até falou com um especialista. Crie uma mensagem de oferta final. Diga que agora que ele viu a transformação, está pronto para o primeiro passo. Mencione o preço de R$39,99 e convide-o a finalizar a compra para garantir o acesso imediato e os bônus.`,
            });

            addMessage({
                sender: "bot",
                type: "text",
                content: finalOffer.personalizedResponse,
            });
            
            addMessage({ sender: "bot", type: "text", content: "E o melhor: com nossa garantia de 7 dias, você pode testar o Mapa da Cura e todos os bônus sem risco algum. Se não ficar satisfeito, basta nos avisar. Estamos 100% comprometidos com sua transformação espiritual!", options: ["Sim, quero garantir minha jornada espiritual!"] });
            setConversationStep(5);
            break;

        case 5: // Final CTA
            addMessage({ sender: "bot", type: "text", content: "Clique abaixo para garantir sua jornada espiritual e acessar todos os bônus exclusivos. Sua transformação começa agora. Estamos esperando por você." });
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
            setConversationStep(6);
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
