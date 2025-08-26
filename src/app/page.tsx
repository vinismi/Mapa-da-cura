
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


type ConversationState = {
  messages: Message[];
  conversationStep: number;
  userName: string;
  userMotivation: string;
  userPainDuration: string;
  userAttempts: string;
  conversationStarted: boolean;
};

const initialConversationState: ConversationState = {
  messages: [],
  conversationStep: 0,
  userName: "",
  userMotivation: "",
  userPainDuration: "",
  userAttempts: "",
  conversationStarted: false,
};


export default function Home() {
  const [conversationState, setConversationState] = useState<ConversationState>(initialConversationState);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();
  const [isViewingStatus, setIsViewingStatus] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chatLayoutRef = useRef<{ scrollToBottom: () => void }>(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("Digite uma mensagem...");
  const storageKey = "zap-sales-funnel-progress";

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedStateJSON = localStorage.getItem(storageKey);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        // We need to convert date strings back to Date objects
        savedState.messages = savedState.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
        }));
        setConversationState(savedState);

        // Restore placeholder based on step
        const currentStep = savedState.conversationStep;
        if (currentStep === 1 || currentStep === 2) setInputPlaceholder("Digite seu nome aqui...");
        else if (currentStep === 3) setInputPlaceholder("Descreva o que você quer mudar...");
        else if (currentStep === 5) setInputPlaceholder("Pode me contar, estou aqui pra te ouvir...");
        else if (currentStep === 10) setInputPlaceholder("Seu feedback sincero aqui...");

      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      setConversationState(initialConversationState);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) { // Prevent saving initial state before loading from storage
      try {
        const stateToSave = JSON.stringify(conversationState);
        localStorage.setItem(storageKey, stateToSave);
      } catch (error) {
        console.error("Failed to save state to localStorage:", error);
      }
    }
  }, [conversationState, isMounted]);


  const updateState = (updates: Partial<ConversationState>) => {
    setConversationState(prevState => ({ ...prevState, ...updates }));
  };


  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setConversationState(prev => {
      const newMessages = [
        ...prev.messages,
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ];
      // After state updates, force scroll
      setTimeout(() => chatLayoutRef.current?.scrollToBottom(), 0);
      return {...prev, messages: newMessages};
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
        updateState({ userName: correction.newName });
        await showTypingIndicator(2500);
        addMessage({ sender: "bot", type: "text", content: `Ops, anotado! Vou te chamar de ${correction.newName} então. 😉` });
        await showTypingIndicator(3000);
        currentQuestion(); // Re-ask the current question
        return true;
    }
    return false;
  }
  
  const startConversation = async () => {
    updateState({ conversationStarted: true });
    addMessage({ sender: "user", type: "text", content: "Chega de sofrer. Eu preciso encontrar a minha cura e vi que você pode me ajudar com o mapa." });
    await showTypingIndicator(2500);
    addMessage({
      sender: "bot",
      type: "audio",
      content: "https://unrivaled-gelato-f313ef.netlify.app/audio1.mp3",
    });
    updateState({ conversationStep: 1 });

    // After 10 seconds, send a text message asking for the name
    setTimeout(async () => {
      await showTypingIndicator(1500);
      addMessage({ sender: "bot", type: "text", content: "Para começarmos, como posso te chamar?" });
      setInputPlaceholder("Digite seu nome aqui...");
    }, 8000);
  };

  async function handleCallEnd() {
      setIsCallActive(false);
      
      // Add the "Call ended" summary message
      addMessage({ sender: "bot", type: "call-summary", content: "Chamada de vídeo encerrada" });
      
      await showTypingIndicator(3500);
      addMessage({ sender: "bot", type: "text", content: `A Ana é a prova de que a virada de chave é REAL.` });

      await showTypingIndicator(4000);
      addMessage({ sender: "bot", type: "text", content: `${conversationState.userName}, chega de desculpas. A sua transformação é minha prioridade, e vou provar isso.`});
      
      await showTypingIndicator(4000);
      addMessage({
          sender: "bot",
          type: "text",
          content: "Por isso, vou quebrar o protocolo. Você vai receber TODOS OS BÔNUS agora, de presente. Antes de pagar qualquer coisa.",
      });

      await showTypingIndicator(4500);
      addMessage({ sender: "bot", type: "text", content: "É isso mesmo. Você acessa os bônus, e se o seu coração disser 'É ISSO', você investe no mapa completo. Confiança total.", options: ["Eu quero os bônus agora!", "Como assim?"] });

      updateState({ conversationStep: 9 });
  }

  const continueAfterStatus = async () => {
      await showTypingIndicator(4000);
      addMessage({ sender: "bot", type: "text", content: `Viu só? A transformação é real e está ao seu alcance.` });
      
      await showTypingIndicator(4500);
      addMessage({ sender: "bot", type: "text", content: `Senti uma conexão forte com você, ${conversationState.userName}. Por isso, o universo vai te dar um sinal claro.` });
      
      await showTypingIndicator(4000);
      addMessage({ sender: "bot", type: "text", content: `Uma pessoa que viveu o mesmo que você vai te ligar. AGORA.` });

      await showTypingIndicator(3000);
      addMessage({ sender: "bot", type: "text", content: `Atenda. Ela vai te mostrar o caminho.` });

      await new Promise(resolve => setTimeout(resolve, 4000));
      setIsCallActive(true);
      updateState({ conversationStep: 8 }); // Move to a step where we wait for the call to end
  }


  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (text === 'Ver status') {
        setIsViewingStatus(true);
        // Remove options from the "Ver status" message
        updateState({
            messages: conversationState.messages.map(msg => msg.type === 'status' ? { ...msg, options: undefined } : msg)
        });
        return;
    }

    addMessage({ sender: "user", type: "text", content: text });
    
    setUserInput("");
    setInputPlaceholder("Digite uma mensagem...");
    // Clear all options from previous messages
    updateState({
        messages: conversationState.messages.map(msg => ({ ...msg, options: undefined }))
    });

    setTimeout(() => chatLayoutRef.current?.scrollToBottom(), 0);

    try {
      switch (conversationState.conversationStep) {
        case 1: // Asked for name
            const nameAnalysis = await extractNameFromFirstMessage({ userInput: text });

            if (nameAnalysis.isNamePresent && nameAnalysis.extractedName) {
                const name = nameAnalysis.extractedName;
                updateState({ userName: name });
                await showTypingIndicator(3500);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Prazer, ${name}! Fico feliz que você deu o primeiro passo. Me diga com toda a sua força: o que você quer transformar na sua vida a partir de HOJE?`,
                });
                setInputPlaceholder("Descreva o que você quer mudar...");
                updateState({ conversationStep: 3 });
            } else {
                 await showTypingIndicator(2500);
                 addMessage({ sender: "bot", type: "text", content: "Certo. E como posso te chamar?" });
                 setInputPlaceholder("Digite seu nome aqui...");
                 updateState({ conversationStep: 2 }); // Ask for name again
            }
            break;
            
        case 2: // Asked for name again
            const name = text.trim();
            updateState({ userName: name });
            await showTypingIndicator(3500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Ok, ${name}! Agora sim. Me diga com toda a sua força: o que você quer transformar na sua vida a partir de HOJE?`,
            });
            setInputPlaceholder("Descreva o que você quer mudar...");
            updateState({ conversationStep: 3 });
            break;

        case 3: // Asked about motivation
           const motivation = text;
           
           const nameCorrectionCheck = await checkForNameCorrection({ previousName: conversationState.userName, currentInput: text });
           if (await handleNameCorrection(nameCorrectionCheck, text, () => {
               addMessage({ sender: "bot", type: "text", content: `Certo, ${nameCorrectionCheck.newName}! E o que você quer transformar na sua vida a partir de hoje?` });
           })) return;

           updateState({ userMotivation: motivation });
           
           await showTypingIndicator(4500);
           const empathyResponseForMotivation = await generatePersonalizedResponse({ userInput: `A motivação da usuária é: "${motivation}". Crie uma resposta de UMA FRASE curta, poderosa e empática. Valide o sentimento dela e mostre que a transformação é possível. Use uma linguagem forte e inspiradora. Exemplo: "Compreendo essa dor. E é exatamente essa força que vamos usar para virar o jogo."` });
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
                addMessage({ 
                  sender: "bot", 
                  type: "text", 
                  content: "E há quanto tempo esse sentimento te acompanha?",
                  options: ["Menos de 1 ano", "De 1 a 5 anos", "De 5 a 10 anos", "Mais de 10 anos"]
                });
           }, 8000);
          
          updateState({ conversationStep: 4 });
          break;
        
        case 4: // Asked about pain duration
            const duration = text;
            updateState({ userPainDuration: duration });

            await showTypingIndicator(4500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Entendido. Carregar esse fardo por tanto tempo é exaustivo.`,
            });
            
            await showTypingIndicator(4800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `${conversationState.userName}, seja sincera: você já tentou outras coisas pra resolver isso? O que já fez?`
            });
            setInputPlaceholder("Pode me contar, estou aqui pra te ouvir...");
            updateState({ conversationStep: 5 });
            break;
            
        case 5: // Asked about previous attempts
            const attempts = text;
            updateState({ userAttempts: attempts });

            await showTypingIndicator(6000);
            const empathyResponse2 = await generatePersonalizedResponse({ userInput: `Sei como é frustrante tentar e não ver resultados. Muitas pessoas passam por isso. Mas o que importa é que sua busca termina aqui. O que você vai ver agora vai te provar que seu caso tem solução.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse2.personalizedResponse,
            });
            
            await showTypingIndicator(4500);
            addMessage({
                sender: "bot",
                type: "status",
                content: "Preparei depoimentos REAIS nos meus status. Gente como você, que virou o jogo. Espia lá e me diga o que sentiu.",
                options: ["Ver status"],
            });
            updateState({ conversationStep: 7 });
            break;

        case 6: // Fallback, not used in main flow
            // This case was left here for any potential future use, but is not currently triggered.
            break;

        case 7: // After Status
            // This case is now handled by handleStatusFinish to avoid user sending a message.
            break;
        
        case 8: // Waiting for call to end - no user input handled here
              // This case is mostly a placeholder to prevent other cases from running
              // while the call is active. The flow continues in handleCallEnd.
              break;

        case 9: // Access to bonuses before payment
            if (text.toLowerCase().includes("quero") || text.toLowerCase().includes("agora") || text.toLowerCase().includes("sim")) {
                await showTypingIndicator(4000);
                addMessage({ sender: "bot", type: "text", content: `Excelente decisão, ${conversationState.userName}! Seus presentes estão liberados. Use-os para iniciar sua virada de chave HOJE.` });
                
                await showTypingIndicator(5000);
                addMessage({ sender: "bot", type: "bonuses", content: "Sinta o poder da sua nova vida:" });

                await showTypingIndicator(4000);
                addMessage({ sender: "bot", type: "text", content: `Para finalizar e garantir que o mapa seja perfeito para você, me diga: O que você mais espera encontrar nele? E qual a sua avaliação para este nosso papo até aqui? Sua opinião é ouro pra mim.` });
                setInputPlaceholder("Seu feedback sincero aqui...");
                updateState({ conversationStep: 10 });

            } else { // "Como assim?"
                 await showTypingIndicator(5000);
                 addMessage({ sender: "bot", type: "text", content: `É simples: para você sentir o poder da transformação, eu liberei os presentes para você AGORA. São seus, de graça.` });
                 await showTypingIndicator(6000);
                 addMessage({ sender: "bot", type: "text", content: `O investimento de apenas R$19,70 é para você ter acesso ao Mapa da Cura completo, o passo a passo definitivo.` });
                 await showTypingIndicator(4000);
                 addMessage({ sender: "bot", type: "text", content: `Vamos dar o próximo passo juntas?`, options: ["Sim, eu quero o mapa completo!"]});
            }
            break;

        case 10: // Ask for Feedback
            const feedback = text;
            await showTypingIndicator(4000);
            addMessage({ sender: "bot", type: "text", content: "Perfeito! Seu feedback é o que nos move. Muito obrigada." });

            await showTypingIndicator(4500);
            addMessage({ sender: "bot", type: "text", content: "Tudo pronto. Para selar seu compromisso com a sua cura, aqui estão os tutoriais para te guiar:" });

            await showTypingIndicator(3500);
            addMessage({ sender: "bot", type: "wistia-video", content: "g8x5qmw7tx", meta: { videoTitle: "Tutorial: Como acessar seu mapa" } });
            
            await showTypingIndicator(3500);
            addMessage({ sender: "bot", type: "wistia-video", content: "yzbgyjbr1m", meta: { videoTitle: "Tutorial: Como realizar seu pagamento" } });
            
            setTimeout(async () => {
                await showTypingIndicator(4500);
                addMessage({ sender: "bot", type: "text", content: "E para sua total tranquilidade, você tem uma garantia incondicional de 30 dias. Seu risco é zero." });
    
                await showTypingIndicator(3000);
                addMessage({ sender: "bot", type: "button", content: "Ir para o pagamento seguro", meta: { buttonUrl: "https://www.ggcheckout.com/checkout/v2/Xg11vqZcGKAcMrkaHs36" } });
            }, 40000);


            updateState({ conversationStep: 12 });
            break;
        
        case 12: // After checkout link, handle questions
            await showTypingIndicator(4000);
            addMessage({
                sender: "bot",
                type: "text",
                content: "Compreendo! A maioria das dúvidas sobre o pagamento e o acesso estão explicadas nos vídeos tutoriais que te enviei. Se a sua dúvida não for respondida lá, pode me chamar no WhatsApp de suporte que irei te passar para garantir que você tenha a melhor experiência possível. ✨"
            });
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
            {!conversationState.conversationStarted ? (
              <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10 pointer-events-none"
                  poster="https://i.imgur.com/G2Fa071.jpeg"
                >
                  <source src="https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                    <div className="bg-background/50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-lg border border-white/10 animate-in fade-in-50 zoom-in-95 duration-500">
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
                            Sua cura interior está a uma conversa de distância. Inicie a jornada e desperte seu verdadeiro potencial.
                        </p>
                        <Button size="lg" className="w-full text-lg h-14 rounded-full group bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={startConversation}>
                            Iniciar Conversa Agora
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                    </div>
                </div>
              </div>
            ) : (
              <ChatLayout
                  ref={chatLayoutRef}
                  messages={conversationState.messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  userInput={userInput}
                  onUserInput={setUserInput}
                  inputPlaceholder={inputPlaceholder}
                />
            )}
        </div>
    </div>
  );
}

    