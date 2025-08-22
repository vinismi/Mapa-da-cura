
"use client";

import { useState, useEffect, useRef } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse, checkForNameCorrection, type NameCorrectionCheckOutput, extractNameFromFirstMessage } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { StatusView } from "@/components/chat/status-view";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/chat-message";
import { cn } from "@/lib/utils";

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
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [isViewingStatus, setIsViewingStatus] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chatLayoutRef = useRef<{ scrollToBottom: () => void }>(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("Digite uma mensagem...");


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ];
      // After state updates, force scroll
      setTimeout(() => chatLayoutRef.current?.scrollToBottom(), 0);
      return newMessages;
    });
  };
  
  const showTypingIndicator = async (duration: number) => {
      setIsTyping(true);
      setTimeout(() => chatLayoutRef.current?.scrollToBottom(), 100);
      await new Promise(resolve => setTimeout(resolve, duration));
      setIsTyping(false);
  }

  const handleNameCorrection = async (correction: NameCorrectionCheckOutput, text: string, currentQuestion: () => void) => {
    if (correction.isCorrectingName && correction.newName) {
        setUserName(correction.newName);
        await showTypingIndicator(2500);
        addMessage({ sender: "bot", type: "text", content: `Ops, anotado! Vou te chamar de ${correction.newName} então. 😉` });
        await showTypingIndicator(3000);
        currentQuestion(); // Re-ask the current question
        return true;
    }
    return false;
  }
  
  const startConversation = async () => {
    setConversationStarted(true);
    addMessage({ sender: "user", type: "text", content: "Chega de sofrer. Eu preciso encontrar a minha cura e vi que você pode me ajudar com o mapa." });
    await showTypingIndicator(4000);
    addMessage({
      sender: "bot",
      type: "audio",
      content: "https://unrivaled-gelato-f313ef.netlify.app/audio1.mp3",
    });
    setConversationStep(1);

    // After 10 seconds, send a text message asking for the name
    setTimeout(async () => {
      await showTypingIndicator(2000);
      addMessage({ sender: "bot", type: "text", content: "Como devo te chamar?" });
      setInputPlaceholder("Digite seu nome aqui...");
    }, 10000);
  };

  async function handleCallEnd() {
      setIsCallActive(false);
      await showTypingIndicator(3500);
      addMessage({ sender: "bot", type: "text", content: `A Ana é a prova de que a virada de chave é REAL.` });

      await showTypingIndicator(4000);
      addMessage({ sender: "bot", type: "text", content: `${userName}, chega de desculpas. A sua transformação é minha prioridade, e vou provar isso.`});
      
      await showTypingIndicator(4000);
      addMessage({
          sender: "bot",
          type: "text",
          content: "Por isso, vou quebrar o protocolo. Você vai receber TODOS OS BÔNUS agora, de presente. Antes de pagar qualquer coisa.",
      });

      await showTypingIndicator(4500);
      addMessage({ sender: "bot", type: "text", content: "É isso mesmo. Você acessa os bônus, e se o seu coração disser 'É ISSO', você investe no mapa completo. Confiança total.", options: ["Eu quero os bônus agora!", "Como assim?"] });

      setConversationStep(9);
  }

  const handleUserInput = (text: string) => {
      setUserInput(text);
  }

  const continueAfterStatus = async () => {
      await showTypingIndicator(7000);
      addMessage({ sender: "bot", type: "text", content: `Viu só? A transformação é real e está ao seu alcance.` });
      
      await showTypingIndicator(8500);
      addMessage({ sender: "bot", type: "text", content: `Senti uma conexão forte com você, ${userName}. Por isso, o universo vai te dar um sinal claro.` });
      
      await showTypingIndicator(9000);
      addMessage({ sender: "bot", type: "text", content: `Uma pessoa que viveu o mesmo que você vai te ligar. AGORA.` });

      await showTypingIndicator(7000);
      addMessage({ sender: "bot", type: "text", content: `Atenda. Ela vai te mostrar o caminho.` });

      await new Promise(resolve => setTimeout(resolve, 5000));
      setIsCallActive(true);
      setConversationStep(8); // Move to a step where we wait for the call to end
  }


  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage({ sender: "user", type: "text", content: text });
    
    setUserInput("");
    setInputPlaceholder("Digite uma mensagem...");
    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));
    setTimeout(() => chatLayoutRef.current?.scrollToBottom(), 0);

    try {
      switch (conversationStep) {
        case 1: // Asked for name in audio
            const nameAnalysis = await extractNameFromFirstMessage({ userInput: text });

            if (nameAnalysis.isNamePresent && nameAnalysis.extractedName) {
                const name = nameAnalysis.extractedName;
                setUserName(name);
                await showTypingIndicator(3500);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Prazer, ${name}! Chega de rodeios. Me diga com toda a sua força: o que você quer transformar na sua vida a partir de HOJE?`,
                });
                setConversationStep(3);
            } else {
                const lowerCaseText = text.toLowerCase();
                 if (lowerCaseText.includes("tudo bem") || lowerCaseText.includes("estou bem") || lowerCaseText.includes("tudo ótimo")) {
                    await showTypingIndicator(2500);
                    addMessage({ sender: "bot", type: "text", content: "Ótimo. 😊" });
                    await showTypingIndicator(3000);
                    addMessage({
                        sender: "bot",
                        type: "text",
                        content: "Como devo te chamar?",
                    });
                     setInputPlaceholder("Digite seu nome aqui...");
                } else {
                    const name = text.trim();
                    setUserName(name);
                    await showTypingIndicator(3500);
                    addMessage({
                        sender: "bot",
                        type: "text",
                        content: `Ok, ${name}. Sem rodeios. Me diga com toda a sua força: o que você quer transformar na sua vida a partir de HOJE?`,
                    });
                    setConversationStep(3);
                }
            }
            break;

        case 3: // Asked about motivation
           const motivation = text;
           
           const nameCorrectionCheck = await checkForNameCorrection({ previousName: userName, currentInput: text });
           if (await handleNameCorrection(nameCorrectionCheck, text, () => {
               addMessage({ sender: "bot", type: "text", content: `Certo, ${nameCorrectionCheck.newName}! E o que você quer transformar na sua vida a partir de hoje?` });
           })) return;

           setUserMotivation(motivation);
           
           await showTypingIndicator(4500);
           const empathyResponseForMotivation = await generatePersonalizedResponse({ userInput: `O usuário ${userName} disse que sua motivação é: "${motivation}". Crie uma resposta curta, poderosa e empática. Valide o sentimento dele(a) de forma direta, sem repetir o que foi dito. Use uma linguagem forte e inspiradora. Ex: "Eu entendo essa força. E é exatamente ela que vamos usar para virar o jogo."` });
           addMessage({
             sender: "bot",
             type: "text",
             content: empathyResponseForMotivation.personalizedResponse
           });

           await showTypingIndicator(3800);
           addMessage({ 
            sender: "bot", 
            type: "audio", 
            content: "https://unrivaled-gelato-f313ef.netlify.app/audio2.mp3" 
           });

           setTimeout(async () => {
                await showTypingIndicator(2000);
                addMessage({ sender: "bot", type: "text", content: "Me diga, há quanto tempo esse sentimento te acompanha?" });
                setInputPlaceholder("Diga aqui há quanto tempo...");
           }, 8000);
          
          setConversationStep(4);
          break;
        
        case 4: // Asked about pain duration
            const duration = text;
            setUserPainDuration(duration);

            await showTypingIndicator(4500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Entendido. Carregar esse fardo por tanto tempo acaba com qualquer um.`,
            });
            
            await showTypingIndicator(4800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `${userName}, seja sincera: você já tentou outras coisas pra resolver isso? O que fez?`
            });
            setConversationStep(5);
            break;
            
        case 5: // Asked about previous attempts
            const attempts = text;
            setUserAttempts(attempts);

            await showTypingIndicator(6000);
            const empathyResponse2 = await generatePersonalizedResponse({ userInput: `A conversa até agora é sobre as frustrações do usuário ${userName}. A última resposta dele(a) sobre tentativas passadas foi: "${attempts}". Continue a conversa de forma empática e natural, sem saudações. Reconheça a frustração sem usar frases prontas como "eu entendo". Mostre que a situação é comum mas que agora será diferente. Use uma linguagem amigável, como se falasse com uma amiga.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse2.personalizedResponse,
            });

            await showTypingIndicator(5800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `O que você vai ver agora vai te provar que seu caso tem solução.`,
            });
            
            await showTypingIndicator(4500);
            addMessage({
                sender: "bot",
                type: "status",
                content: "Preparei depoimentos REAIS nos meus status. Gente como você, que virou o jogo. Espia lá e me diga o que sentiu.",
            });
            setConversationStep(7);
            break;

        case 6: // Fallback, not used in main flow
            await showTypingIndicator(3800);
            addMessage({ sender: "bot", type: "text", content: `Obrigada por abrir seu coração.` });
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
            break;
        
        case 8: // Waiting for call to end - no user input handled here
              // This case is mostly a placeholder to prevent other cases from running
              // while the call is active. The flow continues in handleCallEnd.
              break;

        case 9: // Access to bonuses before payment
            if (text.includes("quero") || text.includes("topo") || text.includes("Sim")) {
                await showTypingIndicator(4000);
                addMessage({ sender: "bot", type: "text", content: `Excelente decisão, ${userName}! Seus presentes estão liberados. Use-os para iniciar sua virada de chave HOJE.` });
                
                await showTypingIndicator(5000);
                addMessage({ sender: "bot", type: "bonuses", content: "Sinta o poder da sua nova vida:" });

                await showTypingIndicator(5500);
                addMessage({ sender: "bot", type: "text", content: "Para garantir que você receba o acesso e nosso suporte, por favor, me informe seu WhatsApp com DDD. Não vamos te mandar spam, é apenas para segurança." });
                setInputPlaceholder("Seu WhatsApp com DDD");
                setConversationStep(10);

            } else { // "Como assim?"
                 await showTypingIndicator(4500);
                 addMessage({ sender: "bot", type: "text", content: `É simples: você já ganhou os bônus. O pagamento de R$19 libera o Mapa da Cura completo. Assim que o pagamento for confirmado, o acesso é seu para sempre.` });
                 await showTypingIndicator(4000);
                 addMessage({ sender: "bot", type: "text", content: `Vamos dar o próximo passo?`, options: ["Sim, eu quero o mapa completo!"]});
            }
            break;

        case 10: // Ask for WhatsApp
            const whatsapp = text;
            setUserWhatsapp(whatsapp);
            await showTypingIndicator(3000);
            addMessage({ sender: "bot", type: "text", content: `Obrigada, ${userName}. Anotado.` });

            await showTypingIndicator(4000);
            addMessage({ sender: "bot", type: "text", content: `Para finalizar e garantir que o mapa seja perfeito para você, me diga: O que você mais espera encontrar nele? E qual a sua avaliação para este nosso papo até aqui? Sua opinião é ouro pra mim.` });
            setInputPlaceholder("Seu feedback sincero aqui...");
            setConversationStep(11);
            break;
        
        case 11: // Ask for Feedback
            const feedback = text;
            await showTypingIndicator(4000);
            addMessage({ sender: "bot", type: "text", content: "Perfeito! Seu feedback é o que nos move. Muito obrigada." });

            await showTypingIndicator(4500);
            addMessage({ sender: "bot", type: "text", content: "Tudo pronto. Para selar seu compromisso com a sua cura, aqui estão os tutoriais para te guiar:" });

            await showTypingIndicator(3500);
            addMessage({ sender: "bot", type: "video", content: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", meta: { videoTitle: "Tutorial: Como realizar seu pagamento" } });
            
            await showTypingIndicator(3500);
            addMessage({ sender: "bot", type: "video", content: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", meta: { videoTitle: "Tutorial: Como acessar seu mapa" } });

            await showTypingIndicator(3000);
            addMessage({ sender: "bot", type: "button", content: "Ir para o pagamento seguro", meta: { buttonUrl: "https://www.ggcheckout.com/checkout/v2/Xg11vqZcGKAcMrkaHs36" } });

            setConversationStep(12);
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

  const handleStatusFinish = async () => {
    setIsViewingStatus(false);
    // Use a timeout to ensure the state update for isViewingStatus is processed first
    // and the chat layout is visible again before sending the message.
    await new Promise(resolve => setTimeout(resolve, 100));
    await continueAfterStatus();
  };

  if (!isMounted) {
    return null;
  }
  
  if (isViewingStatus) {
    return <StatusView onFinish={handleStatusFinish} />;
  }

  return (
    <div className="relative h-dvh w-full">
        {/* Call UI - Rendered on top */}
        <div className={cn("absolute inset-0 z-50", isCallActive ? 'visible' : 'invisible')}>
             {isCallActive && (
                 <ChatMessage 
                      message={{
                          id: "live-call-message",
                          sender: "bot",
                          type: "live-call",
                          content: "Chamada de Vídeo de Luz",
                          timestamp: new Date(),
                          meta: { onCallEnd: handleCallEnd }
                      }} 
                      onSendMessage={handleSendMessage} 
                  />
             )}
        </div>

        {/* Main Content - Welcome screen or Chat */}
        <div className={cn("h-full w-full", isCallActive ? 'invisible' : 'visible')}>
            {!conversationStarted ? (
              <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                  poster="https://i.imgur.com/G2Fa071.jpeg"
                >
                  <source src="https://videos.pexels.com/video-files/3253459/3253459-hd_1920_1080_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                    <div className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg border border-white/10 animate-in fade-in-50 zoom-in-95 duration-500">
                        <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-background/50 shadow-lg">
                          <AvatarImage src="https://i.imgur.com/IhZA0Ke.png" alt="Luz" />
                          <AvatarFallback>L</AvatarFallback>
                        </Avatar>
                        <div className="flex justify-center items-center mb-4">
                          <Sparkles className="h-6 w-6 text-primary animate-pulse"/>
                          <h1 className="text-3xl md:text-4xl font-bold text-primary mx-2">
                              Jornada do Despertar Espiritual
                          </h1>
                          <Sparkles className="h-6 w-6 text-primary animate-pulse"/>
                        </div>
                        <p className="text-foreground/90 mb-8 text-base md:text-lg">
                            Receba orientação personalizada e encontre o caminho para a sua cura interior. Inicie uma conversa e descubra o seu potencial.
                        </p>
                        <Button size="lg" className="w-full text-lg h-14 rounded-full group bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={startConversation}>
                            Iniciar Conversa Agora
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                    </div>
                </div>
              </div>
            ) : (
              <ChatLayout
                  ref={chatLayoutRef}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  userInput={userInput}
                  onUserInput={handleUserInput}
                  inputPlaceholder={inputPlaceholder}
                />
            )}
        </div>
    </div>
  );
}
