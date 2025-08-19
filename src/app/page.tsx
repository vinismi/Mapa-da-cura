
"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse, checkForNameCorrection, type NameCorrectionCheckOutput } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { StatusView } from "@/components/chat/status-view";
import { Button } from "@/components/ui/button";
import { ChevronRight, Send, Sparkles } from "lucide-react";

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
        addMessage({ sender: "bot", type: "text", content: `Ops, anotado! Vou te chamar de ${correction.newName} então. 😉` });
        await showTypingIndicator(3000);
        currentQuestion(); // Re-ask the current question
        return true;
    }
    return false;
  }
  
  const startConversation = async () => {
    setConversationStarted(true);
    addMessage({ sender: "user", type: "text", content: "Olá! Vi sobre a Jornada e quero saber mais." });
    await showTypingIndicator(3000);
    addMessage({
      sender: "bot",
      type: "audio",
      content: "https://darling-otter-f7bf47.netlify.app/audio.mp3",
      meta: {
        audioText: "Olá! Que bom que você veio, tudo bem? Para que a gente se conheça um pouquinho melhor, como eu posso te chamar?",
      },
    });
    setConversationStep(1); // Move to next step which is waiting for the user's name.
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
        case 1: // Asked for name in audio
            const name = text.trim();
            const lowerCaseText = text.toLowerCase();

            // Handle if user says "I'm fine" or similar, then ask for name again.
            if (lowerCaseText.includes("tudo bem") || lowerCaseText.includes("estou bem") || lowerCaseText.includes("tudo ótimo")) {
                await showTypingIndicator(2000);
                addMessage({ sender: "bot", type: "text", content: "Que ótimo! Fico feliz em saber. 😊" });
                await showTypingIndicator(2500);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: "E para a gente se conhecer melhor, como posso te chamar?",
                });
                // Keep conversationStep at 1 to wait for the name
            } else {
                setUserName(name);
                await showTypingIndicator(4500);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `É um prazer te conhecer, ${name}! Fico super curiosa... o que te trouxe até aqui? Me conta qual a sua maior motivação para buscar essa cura espiritual.`,
                });
                setConversationStep(3);
            }
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
           addMessage({ sender: "bot", type: "text", content: "E me diga uma coisa, há quanto tempo você sente que essa área da sua vida precisa de um carinho especial?" });
          
          setConversationStep(4);
          break;
        
        case 4: // Asked about pain duration
            const duration = text;
            setUserPainDuration(duration);

            await showTypingIndicator(5500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Uau, é um tempinho, né? Carregar esse peso todo não é fácil.`,
            });
            
            await showTypingIndicator(4200);
            addMessage({ sender: "bot", type: "text", content: "Mas olha, muitas pessoas incríveis que converso sentem o mesmo. Você não está sozinha nessa, de verdade." });
            
            await showTypingIndicator(4800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `E ${userName}, me conta, você já tentou alguma coisa pra dar um jeito nisso? Como foi?`
            });
            setConversationStep(5);
            break;
            
        case 5: // Asked about previous attempts
            const attempts = text;
            setUserAttempts(attempts);

            await showTypingIndicator(6000);
             const empathyResponse2 = await generatePersonalizedResponse({ userInput: `O usuário ${userName} já tentou o seguinte para resolver seu problema: "${attempts}". Mostre que você entende e que muitas tentativas podem ser frustrantes, mas que há um caminho. Use uma linguagem amigável e um pouco de humor, como se estivesse conversando com uma amiga.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse2.personalizedResponse,
            });

            await showTypingIndicator(4800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Qual foi a última vez que você se sentiu 100% conectada e em paz, daquele jeito que a gente até suspira?`,
            });
            setConversationStep(6);
            break;

        case 6: // Answered last time felt connected
            await showTypingIndicator(4800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Obrigada por abrir seu coração. É super importante a gente se lembrar desses momentos bons. Tenho uma coisinha que pode te inspirar...`
            });
            await showTypingIndicator(3500);
            addMessage({
                sender: "bot",
                type: "status",
                content: "Preparei umas histórias lindas nos meus status, de gente que, como a gente, buscou e achou um novo brilho. Dá uma espiadinha lá e me diz o que achou!",
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
              addMessage({ sender: "bot", type: "text", content: `E aí, não é de arrepiar? Ver a história de outras pessoas renova nossas forças, né?` });
              
              await showTypingIndicator(5000);
              addMessage({ sender: "bot", type: "text", content: `Alguma daquelas histórias mexeu com você de um jeito especial?` });
              
              setConversationStep(8);
            }
            break;
        
        case 8: // User reacts to testimonials
              await showTypingIndicator(5000);
              addMessage({ sender: "bot", type: "text", content: `Que bom que você sentiu essa conexão! Agora, se prepara, que o universo conspira. Senti de te conectar com uma pessoa que viveu algo parecido com você... e ela vai te ligar!` });
              
              await showTypingIndicator(4000);
              addMessage({ sender: "bot", type: "text", content: `Ela vai te mostrar um caminho que a ajudou a florescer. Fica atenta!` });

              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "live-call", content: "Chamada de Vídeo de Luz" });

              setTimeout(async () => {
                  setMessages(prev => prev.filter(m => m.type !== 'live-call'));
                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: `Que papo incrível! Espero que a energia da Ana tenha te contagiado.` });

                  await showTypingIndicator(5000);
                  addMessage({ sender: "bot", type: "text", content: `${userName}, quero que nossa relação seja de total confiança, de amiga para amiga. Por isso, vou te dar acesso a TUDO antes mesmo de você pensar em investir.`});
                  
                  await showTypingIndicator(5000);
                  addMessage({
                      sender: "bot",
                      type: "text",
                      content: "Você vai receber o Mapa da Cura Espiritual completo e todos os bônus. Se o seu coração vibrar e disser 'é isso!', aí sim você realiza o pagamento.",
                  });

                  await showTypingIndicator(4500);
                  addMessage({ sender: "bot", type: "text", content: "Topa seguir nessa base de confiança mútua?", options: ["Com certeza! Eu topo!", "Como funciona o pagamento?"] });

                  setConversationStep(9);
              }, 15000); // Increased duration for the call
              break;

        case 9: // Access before payment
            if (text.includes("topo")) {
                await showTypingIndicator(4000);
                addMessage({ sender: "bot", type: "text", content: `Maravilha, ${userName}! Sabia que você era das minhas! Preparei um vídeo rapidinho pra te mostrar o tesouro que você vai receber:` });

                await showTypingIndicator(3000);
                addMessage({ sender: "bot", type: "video", content: "https://placehold.co/600x400.png", meta: { videoTitle: "Tutorial Rápido: Desbravando seu Mapa da Cura" } });

                await showTypingIndicator(6000);
                addMessage({ sender: "bot", type: "text", content: "Pensa nesse mapa como seu GPS para a alma. Ele é o resultado de anos de estudo e vivências, tudo mastigadinho pra você redescobrir sua força, alinhar sua energia e manifestar a vida espetacular que você merece." });
                
                await showTypingIndicator(5000);
                addMessage({ sender: "bot", type: "bonuses", content: "E como amiga boa não deixa na mão, olha só o que vem junto pra turbinar sua jornada:" });
                
                await showTypingIndicator(4500);
                addMessage({ sender: "bot", type: "image", content: "https://placehold.co/600x400.png", dataAiHint:"spiritual map golden light", meta: { title: "Seu Mapa da Cura Espiritual" }});
                
                await showTypingIndicator(6000);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Todo esse material, que já transformou centenas de vidas, já é seu. Mergulhe, sinta, explore. Quando seu coração der aquele pulinho de 'encontrei!', você finaliza sua inscrição com um investimento simbólico de R$39,99 via PIX. Um valor de cafezinho para uma transformação de vida!`,
                });

                await showTypingIndicator(3500);
                addMessage({ sender: "bot", type: "text", content: "Chave PIX (E-mail): contato@curaespritual.com" });
                addMessage({ sender: "bot", type: "text", content: "Depois disso, sua jornada de transformação estará selada e eu estarei aqui vibrando por cada conquista sua." });

                setConversationStep(10);
            } else { // "Como funciona o pagamento?"
                 await showTypingIndicator(4500);
                 addMessage({ sender: "bot", type: "text", content: `Funciona na base da confiança! Você recebe acesso a TUDO agora. Explora, usa, sente a transformação. O pagamento de R$39,99 é feito por PIX para a chave contato@curaespritual.com, mas só depois que você sentir que valeu a pena. Sem pressão!` });
                 await showTypingIndicator(4000);
                 addMessage({ sender: "bot", type: "text", content: `Pronta pra começar essa revolução interior?`, options: ["Com certeza! Eu topo!"]});
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
          "Ops, minha bola de cristal tá meio embaçada aqui. A conexão falhou. Poderia tentar de novo em um instante?",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleStatusFinish = () => {
    setIsViewingStatus(false);
    if (conversationStep === 7) {
      // Use a timeout to ensure state update happens after render cycle
      setTimeout(() => handleSendMessage("Já vi os status!"), 0);
    }
  };

  if (isViewingStatus) {
    return <StatusView onFinish={handleStatusFinish} />;
  }

  if (!conversationStarted) {
    return (
      <div className="flex h-screen w-full flex-col">
        <div 
          className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/spiritual-bg.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-lg border border-white/10">
                <div className="flex justify-center items-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse"/>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mx-2">
                      Jornada do Despertar Espiritual
                  </h1>
                  <Sparkles className="h-6 w-6 text-primary animate-pulse"/>
                </div>
                <p className="text-foreground/80 mb-8 text-base md:text-lg">
                    Receba orientação personalizada e encontre o caminho para a sua cura interior. Inicie uma conversa e descubra o seu potencial.
                </p>
                <Button size="lg" className="w-full text-lg h-14 rounded-full group bg-primary/90 hover:bg-primary" onClick={startConversation}>
                    Iniciar Conversa Agora
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
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

    

    
