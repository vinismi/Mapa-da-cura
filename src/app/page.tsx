
"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { generatePersonalizedResponse, checkForNameCorrection, type NameCorrectionCheckOutput, extractNameFromFirstMessage } from "@/ai/flows/personalized-response-flow";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/lib/types";
import { StatusView } from "@/components/chat/status-view";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/chat-message";

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
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        await showTypingIndicator(1500);
        addMessage({ sender: "bot", type: "text", content: `Ops, anotado! Vou te chamar de ${correction.newName} então. 😉` });
        await showTypingIndicator(2000);
        currentQuestion(); // Re-ask the current question
        return true;
    }
    return false;
  }
  
  const startConversation = async () => {
    setConversationStarted(true);
    addMessage({ sender: "user", type: "text", content: "Olá! Vi que estava interessado no mapa e quero saber mais." });
    await showTypingIndicator(1500);
    await showTypingIndicator(1000); // Simulate "recording"
    addMessage({
      sender: "bot",
      type: "audio",
      content: "https://unrivaled-gelato-f313ef.netlify.app/audio1.mp3",
    });
    setConversationStep(1); // Move to next step which is waiting for the user's name.
  };

  const handleCallEnd = async () => {
      setIsCallActive(false);
      setMessages(prev => prev.filter(m => m.type !== 'live-call'));
      await showTypingIndicator(2500);
      addMessage({ sender: "bot", type: "text", content: `Que energia! A Ana é a prova viva da transformação que estou te propondo.` });

      await showTypingIndicator(3000);
      addMessage({ sender: "bot", type: "text", content: `${userName}, quero ser 100% transparente com você. Minha missão é a sua cura, não o seu dinheiro.`});
      
      await showTypingIndicator(3000);
      addMessage({
          sender: "bot",
          type: "text",
          content: "Por isso, vou te dar ACESSO IMEDIATO aos BÔNUS COMPLETOS, antes mesmo de você investir um único centavo. É um presente meu pra você.",
      });

      await showTypingIndicator(3500);
      addMessage({ sender: "bot", type: "text", content: "Isso mesmo. Você recebe os bônus, e se sentir no seu coração que quer o mapa completo para a sua virada de chave, aí sim você efetua o pagamento. Confiança total.", options: ["Eu quero os bônus!", "Como funciona o pagamento?"] });

      setConversationStep(9);
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'live-call' && !isCallActive) {
        setIsCallActive(true);
    }
  }, [messages, isCallActive]);


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
            const nameAnalysis = await extractNameFromFirstMessage({ userInput: text });

            if (nameAnalysis.isNamePresent && nameAnalysis.extractedName) {
                const name = nameAnalysis.extractedName;
                setUserName(name);
                await showTypingIndicator(2500);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Prazer em te conhecer, ${name}! Vamos direto ao ponto. Me diga, com toda a sua força: o que você quer TRANSFORMAR na sua vida a partir de HOJE?`,
                });
                setConversationStep(3);
            } else {
                // Handle if user says "I'm fine" or similar, then ask for name again.
                const lowerCaseText = text.toLowerCase();
                 if (lowerCaseText.includes("tudo bem") || lowerCaseText.includes("estou bem") || lowerCaseText.includes("tudo ótimo")) {
                    await showTypingIndicator(1500);
                    addMessage({ sender: "bot", type: "text", content: "Que ótimo! Fico feliz em saber. 😊" });
                    await showTypingIndicator(2000);
                    addMessage({
                        sender: "bot",
                        type: "text",
                        content: "E para a gente se conhecer melhor, como posso te chamar?",
                    });
                    // Keep conversationStep at 1 to wait for the name
                } else {
                    // Fallback if AI can't detect name and it's not a "tudo bem" response, assume it's the name.
                    const name = text.trim();
                    setUserName(name);
                    await showTypingIndicator(2500);
                    addMessage({
                        sender: "bot",
                        type: "text",
                        content: `Prazer em te conhecer, ${name}! Vamos direto ao ponto. Me diga, com toda a sua força: o que você quer TRANSFORMAR na sua vida a partir de HOJE?`,
                    });
                    setConversationStep(3);
                }
            }
            break;

        case 3: // Asked about motivation
           const motivation = text;
           
           const nameCorrectionCheck = await checkForNameCorrection({ previousName: userName, currentInput: text });
           if (await handleNameCorrection(nameCorrectionCheck, text, () => {
               addMessage({ sender: "bot", type: "text", content: `Certo, ${nameCorrectionCheck.newName}! E qual seria a sua maior motivação para buscar a cura espiritual?` });
           })) return;

           setUserMotivation(motivation);
           
           await showTypingIndicator(3500);
           const empathyResponseForMotivation = await generatePersonalizedResponse({ userInput: `O usuário ${userName} disse que sua motivação é: "${motivation}". Crie uma resposta curta, poderosa e empática. Valide o sentimento dele(a) de forma direta, sem repetir o que foi dito. Use uma linguagem forte e inspiradora. Ex: "Eu entendo essa dor. E é exatamente essa força que vamos usar para virar o jogo."` });
           addMessage({
             sender: "bot",
             type: "text",
             content: empathyResponseForMotivation.personalizedResponse
           });

           await showTypingIndicator(2800);
           await showTypingIndicator(1000); // Simulate "recording"
           addMessage({ 
            sender: "bot", 
            type: "audio", 
            content: "https://unrivaled-gelato-f313ef.netlify.app/audio2.mp3" 
           });
          
          setConversationStep(4);
          break;
        
        case 4: // Asked about pain duration
            const duration = text;
            setUserPainDuration(duration);

            await showTypingIndicator(2500);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Entendo... Carregar esse peso por tanto tempo não é nada fácil.`,
            });
            
            await showTypingIndicator(2200);
            addMessage({ sender: "bot", type: "text", content: "Mas quero que saiba que você não está sozinha. Muitas pessoas que buscam o despertar passam por isso." });
            
            await showTypingIndicator(2800);
            addMessage({
              sender: "bot",
              type: "text",
              content: `E ${userName}, me conta, você já tentou outras coisas pra resolver isso? Como foi?`
            });
            setConversationStep(5);
            break;
            
        case 5: // Asked about previous attempts
            const attempts = text;
            setUserAttempts(attempts);

            await showTypingIndicator(4000);
             const empathyResponse2 = await generatePersonalizedResponse({ userInput: `O usuário ${userName} descreveu suas tentativas anteriores para resolver o problema com a seguinte frase: "${attempts}". Mostre empatia de forma breve e natural, sem repetir a frase dele. Reconheça que tentativas podem ser frustrantes, mas reforce que ele(a) está no lugar certo para a mudança definitiva. Use uma linguagem amigável, como se falasse com uma amiga.` });
            addMessage({
                sender: "bot",
                type: "text",
                content: empathyResponse2.personalizedResponse,
            });

            await showTypingIndicator(3800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Para te ajudar a se reconectar, tenho algo que vai te inspirar profundamente.`,
            });
            await showTypingIndicator(2500);
            addMessage({
                sender: "bot",
                type: "status",
                content: "Preparei depoimentos reais nos meus status. São histórias de pessoas que, como nós, buscaram e encontraram uma nova força. Espia lá e me diga o que sentiu.",
            });
            setConversationStep(7);
            break;

        case 6: // (This step seems to be skipped now, but keeping logic just in case)
            await showTypingIndicator(2800);
            addMessage({
                sender: "bot",
                type: "text",
                content: `Obrigada por abrir seu coração. É super importante a gente se lembrar desses momentos bons. Tenho uma coisinha que pode te inspirar...`
            });
            await showTypingIndicator(2500);
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
              await showTypingIndicator(3500);
              addMessage({ sender: "bot", type: "text", content: `Incrível, né? Ver a transformação de outras pessoas nos dá a certeza de que também somos capazes.` });
              
              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "text", content: `Senti uma conexão forte com a sua história, e por isso o universo está agindo.` });
              
              await showTypingIndicator(2000);
              addMessage({ sender: "bot", type: "text", content: `Uma pessoa que passou por algo muito parecido vai te ligar AGORA.` });

              await showTypingIndicator(1500);
              addMessage({ sender: "bot", type: "text", content: `Fica atenta, ela vai te mostrar o caminho que a libertou.` });

              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "live-call", content: "Chamada de Vídeo de Luz" });
              // The flow will now be continued by handleCallEnd
              break;
            }
        
        case 8: // (This step seems to be skipped now, keeping logic)
              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "text", content: `Que bom que você sentiu essa conexão! Agora, se prepara, que o universo conspira. Senti de te conectar com uma pessoa que viveu algo parecido com você... e ela vai te ligar!` });
              
              await showTypingIndicator(2000);
              addMessage({ sender: "bot", type: "text", content: `Ela vai te mostrar um caminho que a ajudou a florescer. Fica atenta!` });

              await showTypingIndicator(3000);
              addMessage({ sender: "bot", type: "live-call", content: "Chamada de Vídeo de Luz" });
              // The flow will now be continued by handleCallEnd
              break;

        case 9: // Access to bonuses before payment
            if (text.includes("quero") || text.includes("topo") || text.includes("Sim")) {
                await showTypingIndicator(2000);
                addMessage({ sender: "bot", type: "text", content: `Perfeito, ${userName}! Para te provar o poder dessa jornada, liberei SEUS PRESENTES. São ferramentas poderosas para você já começar sua transformação HOJE.` });
                
                await showTypingIndicator(3000);
                addMessage({ sender: "bot", type: "bonuses", content: "Sinta um gostinho da sua nova vida:" });

                await showTypingIndicator(3500);
                addMessage({ sender: "bot", type: "text", content: "Agora, para ter acesso ao tesouro principal, o seu GPS para a alma, preparei este vídeo que demonstra o mapa e como você vai acessá-lo após o pagamento." });

                await showTypingIndicator(2000);
                addMessage({ sender: "bot", type: "video", content: "https://placehold.co/600x400.png", meta: { videoTitle: "Demonstração e Acesso ao Mapa da Cura" } });

                await showTypingIndicator(12000); 
                addMessage({ sender: "bot", type: "text", content: "Viu só? Este mapa é a chave para redescobrir sua força, alinhar sua energia e despertar sua versão mais poderosa. Chega de se sentir perdida." });
                
                await showTypingIndicator(4000);
                addMessage({
                    sender: "bot",
                    type: "text",
                    content: `Os bônus já são seus, como prometido. Para ter o mapa completo e selar seu compromisso com a sua cura, o investimento simbólico é de R$39,99 via PIX.`,
                });

                await showTypingIndicator(2500);
                addMessage({ sender: "bot", type: "text", content: "Chave PIX (E-mail): contato@curaespritual.com" });
                
                await showTypingIndicator(2000);
                addMessage({ sender: "bot", type: "text", content: "Faça o PIX para receber seu acesso vitalício e iniciar sua transformação definitiva. Estarei aqui vibrando por cada conquista sua." });

                setConversationStep(10);
            } else { // "Como funciona o pagamento?"
                 await showTypingIndicator(3500);
                 addMessage({ sender: "bot", type: "text", content: `É simples: você já recebeu o acesso gratuito aos bônus como prova da minha confiança em você. O pagamento de R$39,99 via PIX (chave: contato@curaespritual.com) é para liberar o acesso ao Mapa da Cura Espiritual completo. Assim que o pagamento for confirmado, você recebe seu acesso vitalício.` });
                 await showTypingIndicator(3000);
                 addMessage({ sender: "bot", type: "text", content: `Pronta para dar o próximo passo?`, options: ["Sim, eu quero o mapa completo!"]});
                 // Keep step at 9 to handle the "Sim" response next, mapping it to the "quero" condition.
            }
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

  if (!isMounted) {
    return null;
  }
  
  if (isViewingStatus) {
    return <StatusView onFinish={handleStatusFinish} />;
  }
  
  const renderCallScreen = () => {
     if (!isCallActive) return null;
     const callMessage = messages.find(m => m.type === 'live-call');
     if (callMessage) {
        return (
          <div className="fixed inset-0 z-50">
             <ChatMessage key={callMessage.id} message={{ ...callMessage, meta: { ...callMessage.meta, onCallEnd: handleCallEnd } as any }} onSendMessage={handleSendMessage} />
          </div>
        )
     }
     return null;
  }


  if (!conversationStarted) {
    return (
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
    );
  }
  
  return (
    <main className="h-dvh max-h-dvh">
      {renderCallScreen()}
      <ChatLayout
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        userInput={userInput}
        onUserInput={setUserInput}
        hide={isCallActive}
      />
    </main>
  );
}
