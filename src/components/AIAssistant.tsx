
import { useState, useEffect, useRef } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { analyzeCSVData, parseCSV, getCSVSampleData, CSVPatientData } from "@/utils/csvParser";
import { usePatientData } from "@/contexts/PatientDataContext";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

// Simple implementation of the AI Assistant
const fetchAssistantResponse = async (prompt: string): Promise<string> => {
  try {
    // In a real implementation, you would use an AI API here
    // For demo purposes, we'll simulate the response based on predefined patterns
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Website navigation guidance
    if (prompt.toLowerCase().includes('how to') || 
        prompt.toLowerCase().includes('where') || 
        prompt.toLowerCase().includes('help')) {
      return `Here's how to use ICU Insight:
- To input patient data: Go to the "Input Data" page from the top menu
- To see predictions: After entering data, go to the "Predictions" page
- To learn about the model: Visit the "Model Info" page
- For any issues: Contact support from the "Contact" page`;
    }
    
    // Data input guidance
    if (prompt.toLowerCase().includes('input') || 
        prompt.toLowerCase().includes('enter') || 
        prompt.toLowerCase().includes('data')) {
      return `To input patient data:
1. Navigate to "Input Data" page from the main menu
2. Fill in all required fields in the patient form
3. You can also upload CSV files with patient data
4. Click "Generate Prediction" when you're done
5. You'll be taken to the Predictions page with results`;
    }
    
    // CSV specific help
    if (prompt.toLowerCase().includes('csv') || 
        prompt.toLowerCase().includes('file') || 
        prompt.toLowerCase().includes('upload')) {
      return `For CSV uploads:
1. Go to "Input Data" page
2. Your CSV should have these headers: patient_id, age, gender, diagnosis, length_of_stay, etc.
3. Click on "Download Sample CSV" to get the correct format
4. Use the upload button to select your file
5. The system will automatically parse the data`;
    }
    
    // Analysis help
    if (prompt.toLowerCase().includes('analyze') || prompt.toLowerCase().includes('data')) {
      return "Based on the patient data analysis, there's a higher prevalence of respiratory conditions (28% of cases) which correlates with increased ventilator usage. Average length of stay is 8.6 days, with patients requiring vasopressors staying 25% longer on average.";
    }
    
    if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('readmission')) {
      return "Patients with both diabetes and hypertension show a 64% higher risk of ICU readmission within 30 days. Those over 65 with respiratory conditions are particularly vulnerable, with readmission rates approaching 40%.";
    }
    
    if (prompt.toLowerCase().includes('recommendation') || prompt.toLowerCase().includes('suggest')) {
      return "For high-risk respiratory patients, consider extending monitoring post-discharge and implementing a 48-hour follow-up protocol. Early intervention for blood glucose management in diabetic patients has shown to reduce readmission rates by up to 30%.";
    }
    
    // Default response
    return "I'm your ICU Insight assistant. I can help you navigate the website, understand the patient data input process, analyze results, or provide guidance on using CSV uploads. What would you like to know about?";
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm having trouble processing your request. Please try again later.";
  }
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your ICU Insight assistant. How can I help you navigate the website, analyze patient data, or explain predictions?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { patientData } = usePatientData();
  const { isAuthenticated } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await fetchAssistantResponse(messageInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientDataAnalysis = () => {
    if (!patientData) {
      toast({
        variant: "destructive",
        title: "No patient data",
        description: "Please load or enter patient data first.",
      });
      return;
    }

    setIsLoading(true);
    
    // Create a message about analyzing current patient data
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Analyze current patient data",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate analysis of the current patient
    setTimeout(() => {
      const analysis = `
Based on my analysis of the current patient:
- ${patientData.age} year old ${patientData.gender}
- Primary diagnosis: ${patientData.primaryDiagnosis}
- Length of stay: ${patientData.lengthOfStay} days

Risk factors identified:
${patientData.diabetes ? '- Diabetes\n' : ''}${patientData.hypertension ? '- Hypertension\n' : ''}${patientData.heartDisease ? '- Heart Disease\n' : ''}${patientData.lungDisease ? '- Lung Disease\n' : ''}

This patient has a ${patientData.ventilatorSupport ? 'higher' : 'lower'} than average risk of readmission based on ${patientData.ventilatorSupport ? 'requiring ventilator support' : 'not requiring ventilator support'} during their stay.

Recommended follow-up: ${patientData.diabetes || patientData.heartDisease ? 'Close monitoring and early follow-up (within 72 hours)' : 'Standard follow-up protocol'}.
      `;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: analysis.trim(),
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleAnalyzeCSVData = () => {
    setIsLoading(true);
    
    // Create a message about analyzing CSV data
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Analyze CSV dataset insights",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      // Get sample CSV data and analyze it
      const csvContent = getCSVSampleData();
      const parsedData = parseCSV(csvContent);
      const csvData = analyzeCSVData(parsedData as CSVPatientData[]); // Type casting the parsed data
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "## CSV Data Analysis Results\n\n" + csvData.join('\n\n'),
          sender: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error analyzing CSV data:", error);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I encountered an error while analyzing the CSV data. Please make sure the file is in the correct format.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }
  };

  const handleSiteHelpGuide = () => {
    setIsLoading(true);
    
    // Create a message about site help
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "How to use this website?",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `# ICU Insight Quick Guide

## Main Features
- **Input Data**: Enter patient information or upload CSV files
- **Predictions**: View readmission risk predictions for patients
- **Model Info**: Learn about how our AI model works
- **CSV Upload**: Upload multiple patient records via CSV

## Where to Find Things
- **Patient Form**: Go to "Input Data" page
- **Prediction History**: Go to "Predictions" page
- **Sample Data**: Find on the "Input Data" page
- **Login/Signup**: Use the buttons in the top-right corner

Need more specific help? Just ask me!`,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-medical-600 hover:bg-medical-700 text-white shadow-lg"
        >
          <Bot size={24} />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 sm:w-96 h-96 shadow-xl">
          <CardHeader className="p-4 flex flex-row items-center justify-between bg-medical-600 text-white rounded-t-lg">
            <CardTitle className="text-lg flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              ICU Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-white hover:bg-medical-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b">
              <Button variant="outline" size="sm" onClick={handlePatientDataAnalysis} className="text-xs">
                Analyze Current Patient
              </Button>
              <Button variant="outline" size="sm" onClick={handleAnalyzeCSVData} className="text-xs">
                Analyze CSV Dataset
              </Button>
              <Button variant="outline" size="sm" onClick={handleSiteHelpGuide} className="text-xs">
                Website Help
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-medical-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('#') ? 'font-bold text-sm mb-1' : 'text-sm'}>
                          {line.startsWith('#') ? line.replace(/^#+\s*/, '') : line}
                        </p>
                      ))}
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                      <span className="flex items-center">
                        <span className="mr-2">Thinking</span>
                        <span className="animate-pulse">...</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a question about the website or patient data..."
                  className="resize-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  className="h-full bg-medical-600 hover:bg-medical-700"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
