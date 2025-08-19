"use client";

import { useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse, checkForNameCorrection, type NameCorrectionCheckOutput } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { StatusView } from "@/components/chat/status-view";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [userMotivation, setUserMotivation] = useState("");
  const [userPainDuration, setUserPainDuration] = useState("");
  const [userAttempts, setUserAttempts] = useState("");
  const [isViewingStatus, setIsViewingStatus] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

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

  const handleNameCorrection = async (correction: NameCorrectionCheckOutput, text: string, currentQuestion: () => void) => {
    if (correction.isCorrectingName && correction.newName) {
        setUserName(correction.newName);
        await showTypingIndicator(2000);
        addMessage({ sender: "bot", type: "text", content: `Entendido, irei te chamar de ${correction.newName} daqui para frente.` });
        await showTypingIndicator(3000);
        currentQuestion(); // Re-ask the current question
        return true;
    }
    return false;
  }
  
  const startConversation = async () => {
    setConversationStarted(true);
    addMessage({ sender: "user", type: "text", content: "Olá! Vi sobre a Jornada e quero saber mais." });
    await showTypingIndicator(2500);
    addMessage({
        sender: "bot",
        type: "text",
        content: "Olá! Que bom que você veio. Tudo bem com você?",
        options: ["Tudo bem!", "Não muito bem."]
    });
    setConversationStep(1); // Move to next step which is asking for name
  };


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
        case 1: // Asked how user is
            await showTypingIndicator(2000);
            if (text.toLowerCase().includes("não")) {
                addMessage({ sender: "bot", type: "text", content: "Sinto muito por isso. Espero que nossa conversa possa trazer um pouco de luz para o seu dia." });
            } else {
                addMessage({ sender: "bot", type: "text", content: "Que ótimo! Fico feliz em saber." });
            }
            
            await showTypingIndicator(3000);
            addMessage({
                sender: "bot",
                type: "audio",
                content: "/initial_audio.mp3",
                meta: {
                audioText: "Para começar nossa jornada, me diga seu nome, por favor."
                },
            });
            setConversationStep(2);
            break;

        case 2: // Asked for name
          const name = text.trim();
          setUserName(name);
          
          await showTypingIndicator(4500);
          addMessage({
            sender: "bot",
            type: "text",
            content: `Que bom ter você aqui, ${name}! Queria saber o que mais te motiva a querer buscar essa cura espiritual, poderia me dizer?`,
          });
          
          setConversationStep(3);
          break;

        case 3: // Asked about motivation
           const motivation = text;
           
           const nameCorrection = await checkForNameCorrection({ previousName: userName, currentInput: text });
           if (await handleNameCorrection(nameCorrection, text, () => {
               addMessage({ sender: "bot", type: "text", content: `Certo, ${nameCorrection.newName}! E qual seria a sua maior motivação para buscar a cura espiritual?` });
           })) return;

           setUserMotivation(motivation);
           
           await showTypingIndicator(5500);
           const empathyResponseForMotivation = await generatePersonalizedResponse({ userInput: `O usuário ${userName} tem a seguinte motivação: "${motivation}". Gere uma resposta de empatia que seja verdadeiramente personalizada e relevante para o que foi dito, sem repetir as palavras do usuário.` });
           addMessage({
             sender: "bot",
             type: "text",
             content: empathyResponseForMotivation.personalizedResponse
           });

           await showTypingIndicator(4800);
           addMessage({ sender: "bot", type: "text", content: "Há quanto tempo você sente que essa área da sua vida precisa de atenção?" });
          
          setConversationStep(4);
          break;
        
        case 4: // Asked about pain duration
            const duration = text;
            setUserPainDuration(duration);

            await showTypingIndicator(5500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Carregar isso por tanto tempo pode ser realmente desgastante.`,
            });
            
            await showTypingIndicator(4200);
            addMessage({ sender: "bot", type: "text", content: "Muitas pessoas chegam até mim com essa mesma questão, você não está sozinho(a)." });
            
            await showTypingIndicator(4800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `E ${userName}, você já tentou alguma coisa para resolver isso? Como foi a experiência?`
            });
            setConversationStep(5);
            break;
            
        case 5: // Asked about previous attempts
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
            setConversationStep(6);
            break;

        case 6: // Answered last time felt connected
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
            });
            setConversationStep(7);
            break;

        case 7: // After Status
            if (text === "Ver status") {
                setIsViewingStatus(true);
                return; 
            }
            
            if (text === "Já vi os status!") {
              await showTypingIndicator(4500);
              addMessage({ sender: "bot", type: "text", content: `Incrível, não é? Ver a jornada de outras pessoas nos dá força.` });
              
              await showTypingIndicator(5000);
              addMessage({ sender: "bot", type: "text", content: `Essas histórias ressoaram com você de alguma forma? Me diga o que achou.` });
              
              setConversationStep(8);
            }
            break;
        
        case 8: // User reacts to testimonials
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
                  addMessage({ sender: "bot", type: "text", content: `${userName}, quero que nossa relação seja de total confiança. Por isso, vou te dar acesso a tudo ANTES de você pagar.`});
                  
                  await showTypingIndicator(5000);
                  addMessage({
                      sender: "bot",
                      type: "text",
                      content: "Você receberá o Mapa da Cura Espiritual completo e todos os bônus. Se sentir no coração que é o caminho certo, você realiza o pagamento.",
                  });

                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: "Você está disposto(a) a seguir com essa confiança mútua?", options: ["Sim, estou disposto!", "Como funciona o pagamento?"] });

                  setConversationStep(9);
              }, 15000); // Increased duration for the call
              break;

        case 9: // Access before payment
            if (text === "Sim, estou disposto!") {
                await showTypingIndicator(4000);
                addMessage({ sender: "bot", type: "text", content: `Excelente, ${userName}! Fico muito feliz com sua confiança. Preparei um vídeo rápido para te guiar:` });

                await showTypingIndicator(3000);
                addMessage({ sender: "bot", type: "video", content: "https://placehold.co/600x400.png", meta: { videoTitle: "Tutorial Rápido: Como usar o Mapa da Cura" } });

                await showTypingIndicator(6000);
                addMessage({ sender: "bot", type: "text", content: "Este mapa é o resultado de anos de estudo e prática, condensado em um guia passo a passo para você redescobrir sua força interior, alinhar sua energia e manifestar a vida que você merece." });
                
                await showTypingIndicator(5000);
                addMessage({ sender: "bot", type: "bonuses", content: "E não é só isso! Para potencializar sua jornada, você recebe acesso imediato a estes bônus exclusivos:" });
                
                await showTypingIndicator(4500);
                addMessage({ sender: "bot", type: "image", content: "https://placehold.co/600x400.png", dataAiHint:"spiritual map golden light", meta: { title: "Seu Mapa da Cura Espiritual" }});
                
                await showTypingIndicator(6000);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Todo este material transformador, que já guiou centenas de pessoas, foi enviado para o seu acesso. Sinta a energia, explore cada detalhe. Quando seu coração confirmar que este é o caminho, finalize sua inscrição com o investimento simbólico de R$39,99 via PIX.`,
                });

                await showTypingIndicator(3500);
                addMessage({ sender: "bot", type: "text", content: "Chave PIX (E-mail): contato@curaespritual.com" });
                addMessage({ sender: "bot", type: "text", content: "Após o pagamento, sua jornada de transformação estará selada. Estou aqui para te apoiar em cada passo." });

                setConversationStep(10);
            } else { // "Como funciona o pagamento?"
                 await showTypingIndicator(4500);
                 addMessage({ sender: "bot", type: "text", content: `É simples! Você recebe acesso a todo o material agora mesmo. Pode explorar, sentir a energia e começar sua transformação. O pagamento de R$39,99 é feito por PIX para a chave contato@curaespritual.com. Você só paga se sentir que é o caminho certo para você.` });
                 await showTypingIndicator(4000);
                 addMessage({ sender: "bot", type: "text", content: `Pronto para começar?`, options: ["Sim, estou disposto!"]});
                 // Keep step at 9 to handle the "Sim" response next.
            }
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

  const handleStatusFinish = () => {
    setIsViewingStatus(false);
    if (conversationStep === 7) {
      handleSendMessage("Já vi os status!");
    }
  };

  if (isViewingStatus) {
    return <StatusView onFinish={handleStatusFinish} />;
  }

  if (!conversationStarted) {
    return (
      <div className="flex h-screen flex-col">
        <div 
          className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-repeat bg-center"
          style={{ 
            backgroundImage: "url('/spiritual-bg.png')",
            backgroundSize: '300px 300px' 
          }}
        >
            <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md">
                <h1 className="text-3xl font-bold text-primary mb-2">Jornada do Despertar Espiritual</h1>
                <p className="text-foreground/80 mb-6">Receba orientação personalizada e encontre o caminho para a sua cura interior.</p>
                <Button size="lg" className="w-full text-lg h-14 rounded-full" onClick={startConversation}>
                    Iniciar Conversa
                    <Send className="ml-2 h-5 w-5"/>
                </Button>
            </div>
        </div>
      </div>
    );
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
