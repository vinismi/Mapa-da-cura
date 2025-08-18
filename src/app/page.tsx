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
      "Olá! 🌟 Bem-vindo à sua Jornada do Despertar Espiritual. Estou aqui para te ajudar a descobrir o poder do Mapa da Cura Espiritual que transformará sua vida. Em alguns minutos, você terá acesso a um conhecimento sagrado que foi escondido por séculos. Preparado para iniciar?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    options: ["Sim, estou pronto!", "Quero saber mais."],
  },
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
        case 0: // Welcome, asking if ready
          addMessage({
            sender: "bot",
            type: "text",
            content: "Para começar, qual o seu nome?",
          });
          setConversationStep(1);
          break;
        case 1: // Asked for name
          const name = text.trim();
          setUserName(name);
          const welcomeResponse = await generatePersonalizedResponse({
            userInput: `O nome do usuário é ${name}. Dê as boas-vindas calorosas e pergunte qual área da vida (Saúde física e emocional, Relacionamentos e conexões, Prosperidade e abundância, Minha energia espiritual) ele sente que precisa de mais cura espiritual.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: welcomeResponse.personalizedResponse,
            options: ["Saúde física e emocional", "Relacionamentos e conexões", "Prosperidade e abundância", "Minha energia espiritual", "Não sei ainda"],
          });
          setConversationStep(2);
          break;
        case 2: // Asked about area to heal
          const area = text.trim();
           const productIntro = await generatePersonalizedResponse({
            userInput: `O usuário ${userName} escolheu a área "${area}" para focar sua cura. Apresente o "Mapa da Cura Espiritual" como a solução ideal para essa área. Diga que é um guia com práticas, orações e rituais. Mencione o preço exclusivo de R$39,99.`,
          });
          addMessage({
            sender: "bot",
            type: "text",
            content: productIntro.personalizedResponse,
          });

          await new Promise(resolve => setTimeout(resolve, 1000));
          addMessage({
            sender: "bot",
            type: "image",
            content: "https://placehold.co/600x400.png",
            dataAiHint: "spiritual map product"
          })
          addMessage({
            sender: "bot",
            type: "text",
            content: "O que você gostaria de saber agora?",
            options: ["Quero saber mais sobre o Mapa!", "Quais são os bônus?"],
          });
          setConversationStep(3);
          break;
        case 3: // Product presented, asking about map or bonus
            if (text.toLowerCase().includes("bônus")) {
                 addMessage({ sender: "bot", type: "text", content: "Além do Mapa da Cura, você receberá bônus exclusivos que potencializarão ainda mais sua jornada de transformação. Veja o que você vai ganhar ao adquirir o produto agora:" });
                 addMessage({ sender: "bot", type: "bonuses", content: ""}); // Special type for bonus list
                 await new Promise(resolve => setTimeout(resolve, 1000));
                 addMessage({ sender: "bot", type: "text", content: "Esses bônus são exclusivos e não estarão disponíveis por muito tempo. Aproveite enquanto ainda estão disponíveis!", options: ["Quero aproveitar essa oferta agora!", "Me fale mais sobre esses bônus."] });
            } else {
                 const mapDetails = await generatePersonalizedResponse({ userInput: `O usuário ${userName} quer saber mais sobre o Mapa da Cura. Explique que o mapa é um guia passo a passo com sabedoria ancestral para desbloquear a cura. Detalhe que ele contém práticas diárias simples, rituais poderosos e meditações para transformar a vida.` });
                 addMessage({ sender: "bot", type: "text", content: mapDetails.personalizedResponse, options: ["Quais são os bônus?", "Como funciona na prática?"]});
            }
            setConversationStep(4);
            break;
        case 4: // Bonuses presented or more details given
          addMessage({ sender: "bot", type: "text", content: "Muitos como você já transformaram suas vidas. Veja o que um deles disse:" });
          addMessage({ sender: "bot", type: "testimonial", content: "Eu nunca imaginei que algo simples poderia transformar minha vida! Após usar o Mapa da Cura, senti uma paz interior profunda que nunca tinha experimentado antes.", meta: { author: "Ana S." } });
          await new Promise(resolve => setTimeout(resolve, 500));
          addMessage({ sender: "bot", type: "testimonial", content: "O Mapa da Cura me ajudou a superar obstáculos emocionais que me impediam de alcançar meus objetivos. Eu recomendo para todos que buscam equilíbrio espiritual.", meta: { author: "João P." } });
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          addMessage({ sender: "bot", type: "text", content: "Nosso especialista, João, gravou um áudio para você:" });
          addMessage({ sender: "bot", type: "audio", content: "audio-placeholder" });

          await new Promise(resolve => setTimeout(resolve, 1000));
          const response3 = await generatePersonalizedResponse({ userInput: `Pergunte ao usuário ${userName} o que ele achou dos depoimentos e se isso o inspira.` });
          addMessage({ sender: 'bot', type: 'text', content: response3.personalizedResponse, options: ["Isso é incrível! Quero começar!", "Como funciona na prática?"] });
          setConversationStep(5);
          break;
        case 5: // After social proof
            addMessage({ sender: "bot", type: "text", content: "Nós confiamos tanto no poder transformador do Mapa da Cura que oferecemos uma garantia de 7 dias. Se você não sentir a transformação espiritual que prometemos, pode solicitar o reembolso completo, sem perguntas." });
            await new Promise(resolve => setTimeout(resolve, 1000));
             addMessage({ sender: 'bot', type: 'text', content: "Isso te dá mais segurança para começar?", options: ["Sim, me dá muita confiança!", "Como garanto minha oferta?"] });
            setConversationStep(6);
            break;
        case 6: // After guarantee
            const finalOffer = await generatePersonalizedResponse({
                userInput: `O usuário ${userName} está confiante. Crie uma mensagem de oferta final com urgência. Diga que a oportunidade é por tempo limitado. Reforce o Mapa da Cura e todos os bônus pelo preço de R$39,99 e convide-o a transformar sua vida agora.`,
              });
              addMessage({
                sender: "bot",
                type: "text",
                content: finalOffer.personalizedResponse,
                 options: ["Sim, quero garantir o meu agora!", "Quais outras ofertas você tem no checkout?"]
              });
            setConversationStep(7);
            break;
        case 7: // Final CTA
            addMessage({ sender: "bot", type: "text", content: "Clique abaixo para garantir sua jornada espiritual e acessar todos os bônus exclusivos. Sua transformação começa agora. Estamos esperando por você." });
            addMessage({
                sender: "bot",
                type: "button",
                content: "Clique aqui para garantir sua jornada espiritual!",
                 meta: {
                  text: "Você acaba de garantir seu acesso ao Mapa da Cura Espiritual e todos os bônus. Prepare-se para uma transformação profunda! Em breve, você receberá todas as informações para acessar seu conteúdo.",
                  image: "https://placehold.co/600x400.png",
                  imageHint: "spiritual map golden light"
                },
              });
            setConversationStep(8);
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

    