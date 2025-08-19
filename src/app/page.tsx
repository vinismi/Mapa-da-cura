"use client";

import { useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { StatusView } from "@/components/chat/status-view";

const initialMessages: Message[] = [
  {
    id: "0",
    sender: "bot",
    type: "audio",
    content: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Placeholder
    timestamp: new Date(new Date().getTime() - 1000), // Ensure audio is slightly before text
  },
  {
    id: "1",
    sender: "bot",
    type: "text",
    content: "Olá! Antes de te mostrar como posso ajudar na sua jornada, me diga seu nome, por favor.",
    timestamp: new Date(),
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userMotivation, setUserMotivation] = useState("");
  const [userPainDuration, setUserPainDuration] = useState("");
  const [userAttempts, setUserAttempts] = useState("");
  const [isViewingStatus, setIsViewingStatus] = useState(false);

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

    // Don't add automatic messages as user messages
    if (text !== "Já vi os status!") {
        addMessage({ sender: "user", type: "text", content: text });
    }
    
    setUserInput("");
    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));

    try {
      switch (conversationStep) {
        case 0: // Asked for name
          const name = text.trim();
          setUserName(name);
          
          await showTypingIndicator(4500);
          addMessage({
            sender: "bot",
            type: "text",
            content: `Que bom ter você aqui, ${name}! Queria saber o que mais te motiva a querer buscar essa cura espiritual, poderia me dizer?`,
          });
          
          setConversationStep(1);
          break;

        case 1: // Asked about motivation
           const motivation = text;
           setUserMotivation(motivation);
           
           await showTypingIndicator(5500);
           const empathyResponseForMotivation = await generatePersonalizedResponse({ userInput: `O usuário ${userName} tem a seguinte motivação: "${motivation}". Demonstre que você entende o que ele(a) busca de forma breve e empática, sem repetir o que ele disse.` });
           addMessage({
             sender: "bot",
             type: "text",
             content: empathyResponseForMotivation.personalizedResponse
           });

           await showTypingIndicator(4800);
           addMessage({ sender: "bot", type: "text", content: "Há quanto tempo você sente que essa área da sua vida precisa de atenção?" });
          
          setConversationStep(2);
          break;
        
        case 2: // Asked about pain duration
            const duration = text;
            setUserPainDuration(duration);

            await showTypingIndicator(5500);
            const empathyResponse = await generatePersonalizedResponse({ userInput: `O usuário ${userName} sente essa dor há ${duration}. Mostre empatia de forma breve, dizendo que entende o quão desgastante isso pode ser.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse.personalizedResponse,
            });
            
            await showTypingIndicator(4200);
            addMessage({ sender: "bot", type: "text", content: "Muitas pessoas chegam até mim com essa mesma questão, você não está sozinho(a)." });
            
            await showTypingIndicator(4800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `E ${userName}, você já tentou alguma coisa para resolver isso? Como foi a experiência?`
            });
            setConversationStep(3);
            break;
            
        case 3: // Asked about previous attempts
            const attempts = text;
            setUserAttempts(attempts);

            await showTypingIndicator(6000);
             const empathyResponse2 = await generatePersonalizedResponse({ userInput: `O usuário ${userName} já tentou o seguinte para resolver seu problema: "${attempts}". Mostre que você entende e que muitas tentativas podem ser frustrantes, mas que há um caminho.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse2.personalizedResponse,
            });

            await showTypingIndicator(4800);
            addMessage({
                sender: "bot",
                type: "text",
                content: "Para eu ter uma ideia, qual foi a última vez que você se sentiu verdadeiramente conectado(a) e em paz consigo mesmo(a)?",
            });
            setConversationStep(4);
            break;

        case 4: // Answered last time felt connected
            await showTypingIndicator(4800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Obrigado por compartilhar isso. É importante reconhecer esses momentos. Tenho algo que pode te inspirar.`
            });
            await showTypingIndicator(3500);
            addMessage({
                sender: "bot",
                type: "status",
                content: "Preparei algo nos meus status para você ver histórias de pessoas que, como nós, buscaram e encontraram um novo caminho. Dê uma olhada e volte aqui!",
                options: ["Ver status"]
            });
            setConversationStep(5);
            break;

        case 5: // After Status
            if (text === "Ver status") {
                setIsViewingStatus(true);
                return; 
            }
            
            if (text === "Já vi os status!") {
              await showTypingIndicator(4500);
              addMessage({ sender: "bot", type: "text", content: `Incrível, não é? Ver a jornada de outras pessoas nos dá força.` });
              
              await showTypingIndicator(5000);
              addMessage({ sender: "bot", type: "text", content: `Essas histórias ressoaram com você de alguma forma? Me diga o que achou.` });
              
              setConversationStep(6);
            }
            break;
        
        case 6: // User reacts to testimonials
              await showTypingIndicator(5000);
              addMessage({ sender: "bot", type: "text", content: `Fico feliz em saber. Agora, prepare-se. Senti que seria importante para você e uma pessoa que passou pela mesma situação que a sua vai te ligar.` });
              
              await showTypingIndicator(4000);
              addMessage({ sender: "bot", type: "text", content: `Ela vai te apresentar os benefícios do que a ajudou.` });

              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "live-call", content: "Chamada de Vídeo de Luz" });

              setTimeout(async () => {
                  setMessages(prev => prev.filter(m => m.type !== 'live-call'));
                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: `Uau, que conversa! Espero que a conexão com a Ana tenha te inspirado.` });

                  await showTypingIndicator(5000);
                  addMessage({ sender: "bot", type: "video", content: "https://placehold.co/600x400.png", meta: { videoTitle: "Tutorial Rápido: Como usar o Mapa da Cura" } });

                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: `${userName}, quero que nossa relação seja de total confiança. Por isso, vou te dar acesso a tudo ANTES de você pagar.`});
                  
                  await showTypingIndicator(5000);
                  addMessage({
                      sender: "bot",
                      type: "text",
                      content: "Você receberá o Mapa da Cura Espiritual completo e todos os bônus. Se sentir no coração que é o caminho certo, você realiza o pagamento.",
                  });

                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: "Você está disposto(a) a seguir com essa confiança mútua?", options: ["Sim, estou disposto!", "Como funciona o pagamento?"] });

                  setConversationStep(7);
              }, 15000); // Increased duration for the call
              break;

        case 7: // Access before payment
            await showTypingIndicator(4000);
            addMessage({ sender: "bot", type: "bonuses", content: "Esses são os bônus que você recebe:" });
            await showTypingIndicator(4500);
            addMessage({ sender: "bot", type: "image", content: "https://placehold.co/600x400.png", dataAiHint:"spiritual map golden light", meta: { title: "Seu Mapa da Cura Espiritual" }});
            await showTypingIndicator(5000);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Todo o material foi enviado para você. Sinta a energia, explore o conteúdo. Quando estiver pronto, pode finalizar com o pagamento de R$39,99 via PIX.`,
            });
            await showTypingIndicator(3500);
            addMessage({ sender: "bot", type: "text", content: "Chave PIX (E-mail): contato@curaespritual.com" });
            addMessage({ sender: "bot", type: "text", content: "Após o pagamento, sua jornada de transformação estará completa. Estou aqui para o que precisar." });
            setConversationStep(8);
            break;
            
        default:
          await showTypingIndicator(3000);
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

  const handleCloseStatus = () => {
    setIsViewingStatus(false);
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === 'status' && conversationStep === 5) {
        handleSendMessage("Já vi os status!");
    }
  };

  if (isViewingStatus) {
    return <StatusView onClose={handleCloseStatus} />;
  }
  
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
