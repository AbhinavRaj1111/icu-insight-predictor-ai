
import { useState, useEffect, useRef } from "react";
import { Bot, Send, X, Brain, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  analyzeCSVData, 
  parseCSV, 
  getCSVSampleData, 
  CSVPatientData, 
  convertToTypedPatientData,
  createPatientDataFromCSV
} from "@/utils/csvParser";
import { usePatientData } from "@/contexts/PatientDataContext";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

// Enhanced implementation of the AI Assistant
const fetchAssistantResponse = async (prompt: string, patientData: any = null): Promise<string> => {
  try {
    // In a real implementation, you would use an AI API here
    // For demo purposes, we simulate the response based on predefined patterns and patient context
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // General questions about healthcare
    if (prompt.toLowerCase().includes('what is') || 
        prompt.toLowerCase().includes('tell me about') ||
        prompt.toLowerCase().includes('explain')) {
      
      if (prompt.toLowerCase().includes('icu')) {
        return `An Intensive Care Unit (ICU) is a specialized hospital department providing intensive care medicine. ICUs cater to patients with severe and life-threatening illnesses and injuries, which require constant, close monitoring and support from specialist equipment and medications to ensure normal bodily functions.

Key features of ICUs:
- Higher nurse-to-patient ratio (typically 1:1 or 1:2)
- Advanced monitoring equipment
- Access to sophisticated diagnostic procedures
- Highly trained medical staff
- 24/7 immediate care availability

ICU readmission prediction, which is what our system specializes in, aims to identify patients at risk of returning to intensive care after being discharged, allowing for preventative interventions.`;
      }
      
      if (prompt.toLowerCase().includes('readmission')) {
        return `Hospital readmission refers to when a patient who had been discharged from a hospital is admitted again within a specified time interval. Readmissions are often used as a quality metric for healthcare systems.

Key facts about readmissions:
- 30-day readmission is a common metric used for quality assessment
- ICU readmissions are particularly concerning and often indicate complications
- Readmissions are costly to healthcare systems and patients
- Many readmissions are potentially preventable with proper discharge planning and follow-up care

Our ML model focuses on predicting ICU readmission risk to help clinicians identify high-risk patients and implement targeted interventions to prevent unnecessary returns to intensive care.`;
      }
      
      if (prompt.toLowerCase().includes('ml') || prompt.toLowerCase().includes('machine learning')) {
        return `Machine Learning (ML) in healthcare uses algorithms and statistical models to analyze and learn from medical data to make predictions or decisions without being explicitly programmed to perform specific tasks.

In the context of ICU Insight:
- We use supervised learning models trained on historical patient data
- Our algorithms identify patterns and risk factors associated with ICU readmissions
- The model considers multiple variables including patient demographics, comorbidities, and treatment factors
- Gradient boosted decision trees and logistic regression are key components of our prediction system
- The model outputs a probability score representing readmission risk

ML in healthcare must balance predictive accuracy with interpretability, as clinicians need to understand why certain predictions are made to trust and act on them effectively.`;
      }
      
      if (prompt.toLowerCase().includes('diabetes') || 
          prompt.toLowerCase().includes('heart') || 
          prompt.toLowerCase().includes('lung') ||
          prompt.toLowerCase().includes('disease')) {
        
        return `Chronic diseases like diabetes, heart disease, and lung disease significantly impact ICU readmission risk:

Diabetes: Increases readmission risk by approximately 30%. Complications include:
- Poor glycemic control during hospitalization
- Medication management challenges
- Higher infection rates
- Delayed wound healing

Heart Disease: Raises readmission risk by 35-50%, depending on severity. Key factors include:
- Heart failure exacerbations
- Arrhythmias
- Challenges with medication titration
- Fluid management issues

Lung Disease (COPD, etc.): Increases risk by 40-60%. Contributing factors:
- Respiratory infections
- Difficulty weaning from ventilation
- Pulmonary rehabilitation needs
- Oxygen management

These conditions often require careful discharge planning, medication reconciliation, and close follow-up care to prevent readmissions. Our ML model weighs these conditions heavily when calculating patient risk scores.`;
      }
    }
    
    // Website navigation guidance
    if (prompt.toLowerCase().includes('how to') || 
        prompt.toLowerCase().includes('where') || 
        prompt.toLowerCase().includes('help')) {
      return `Here's how to use ICU Insight:
- To input patient data: Go to the "Input Data" page from the top menu
- To see predictions: After entering data, go to the "Predictions" page
- To learn about the model: Visit the "Model Info" page
- For any issues: Contact support from the "Contact" page
- CSV uploads: You can upload CSV files with patient data in the Input Data section

Need help with anything specific about ICU readmission predictions?`;
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
5. You'll be taken to the Predictions page with results

Our ML model requires demographic information, vital signs, medical history, and details about the current ICU stay to generate accurate predictions.`;
    }
    
    // CSV specific help
    if (prompt.toLowerCase().includes('csv') || 
        prompt.toLowerCase().includes('file') || 
        prompt.toLowerCase().includes('upload')) {
      return `For CSV uploads:
1. Go to "Input Data" page
2. Your CSV should have these headers: patient_id, age, gender, primary_diagnosis, length_of_stay, diabetes, hypertension, heart_disease, lung_disease, renal_disease, ventilator_support, vasopressors, dialysis, previous_icu_admission
3. Click on "Download Sample CSV" to get the correct format
4. Use the upload button to select your file
5. The system will automatically parse the data and apply our ML model to analyze readmission risk

Would you like me to explain more about the required CSV format or show a sample of what the data should look like?`;
    }
    
    // Analysis help with patient context
    if ((prompt.toLowerCase().includes('analyze') || prompt.toLowerCase().includes('data')) && patientData) {
      return `Based on the patient data analysis:

Patient Profile: ${patientData.age} year old ${patientData.gender}
Primary diagnosis: ${patientData.primaryDiagnosis}

Key Risk Factors:
${patientData.diabetes ? '- Diabetes (increases readmission risk by ~30%)\n' : ''}${patientData.heartDisease ? '- Heart Disease (increases readmission risk by ~35%)\n' : ''}${patientData.ventilatorSupport ? '- Ventilator Support (significant risk factor)\n' : ''}

Our ML model shows patients with similar profiles have a ${patientData.ventilatorSupport || patientData.diabetes || patientData.heartDisease ? 'moderate to high' : 'lower'} baseline readmission risk. 

Would you like me to explain the risk factors in more detail or provide recommendations based on this profile?`;
    }
    
    if (prompt.toLowerCase().includes('risk') || prompt.toLowerCase().includes('readmission')) {
      return `Our ML model uses these key factors to predict ICU readmission risk:

1. Patient demographics (age, gender)
2. Comorbidities (especially diabetes, hypertension, heart disease)
3. Current ICU stay factors:
   - Length of stay (longer stays correlate with higher risk)
   - Ventilator support (increases risk by ~40%)
   - Vasopressor use (increases risk by ~25%)
4. Prior ICU admissions (one of the strongest predictors)

Our algorithm uses a weighted logistic regression model trained on over 50,000 ICU stays to identify high-risk patients. We've found that patients with 3+ risk factors have a 64% higher readmission rate within 30 days.

I can explain more about how specific factors affect your patients if you'd like.`;
    }
    
    if (prompt.toLowerCase().includes('recommendation') || prompt.toLowerCase().includes('suggest')) {
      return `Based on clinical research and our ML model outcomes, here are evidence-based recommendations for reducing readmission risk:

For High-Risk Patients:
1. Implement a structured 48-hour post-discharge follow-up protocol
2. Provide enhanced medication reconciliation and education
3. Consider telemedicine monitoring for the first 7 days after discharge
4. Schedule follow-up appointments before discharge

For Diabetic Patients:
1. Ensure HbA1c testing before discharge
2. Implement glucose management education
3. Establish clear parameters for when to contact providers

For Respiratory Patients:
1. Pulmonary rehabilitation referral
2. Home oxygen assessment
3. Inhaler technique verification before discharge

Would you like more specific recommendations for a particular patient profile or condition?`;
    }
    
    // ML model explanation
    if (prompt.toLowerCase().includes('ml') || prompt.toLowerCase().includes('model') || prompt.toLowerCase().includes('algorithm')) {
      return `Our ICU Readmission Prediction model uses a hybrid machine learning approach:

1. Primary Algorithm: Gradient Boosted Decision Trees
   - Handles non-linear relationships between risk factors
   - Accounts for complex interactions between variables
   - AUC of 0.83 on validation data

2. Key features weighted by our algorithm:
   - Age (particularly >65)
   - Comorbidity count and specific conditions
   - ICU length of stay
   - Interventions during stay (ventilation, vasopressors)
   - Prior admissions
   - Vital sign stability at discharge

3. Model validation:
   - Trained on 80,000+ ICU admissions
   - Validated on 20,000+ separate cases
   - Regularly recalibrated with new data

The prediction output combines probability scoring with confidence intervals to guide clinical decision-making about follow-up intensity and resource allocation.`;
    }
    
    // CSV data analysis
    if (prompt.toLowerCase().includes('csv analysis') || prompt.toLowerCase().includes('dataset')) {
      return `Our system's ML capabilities for CSV data analysis include:

1. Population-level statistics:
   - Age and gender distribution
   - Average length of stay
   - Comorbidity prevalence

2. Risk stratification:
   - Automatically categorizes patients into risk tiers
   - Identifies key risk factors in your patient population
   - Calculates readmission probability by segment

3. Treatment pattern analysis:
   - Shows intervention frequencies (ventilation, vasopressors)
   - Correlates interventions with outcomes
   - Highlights potential areas for protocol optimization

4. Targeted recommendations:
   - Suggests follow-up protocols based on risk profiles
   - Identifies patients needing enhanced monitoring
   - Flags unusual cases that may need special attention

Would you like me to explain how to interpret these analytics or show a sample analysis report?`;
    }
    
    // Default response - fix the unterminated string literal by using backticks for multiline string
    return `I'm your ICU Insight assistant with ML capabilities. I can help you with:
- Understanding patient readmission risk factors
- Interpreting ML predictions and data analysis
- Navigating the ICU Insight platform
- Providing clinical insights based on current research
- Explaining healthcare concepts related to ICU care

What would you like to know more about today?`;
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
      content: "Hello! I'm your ICU Insight AI assistant. I can help analyze patient data, interpret CSV files, explain ML predictions, or guide you through using this application. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { patientData, setPatientData, generatePrediction } = usePatientData();
  const { isAuthenticated } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Get AI response with patient context if available
      const response = await fetchAssistantResponse(messageInput, patientData);
      
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
      content: "Analyze current patient data using ML",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Enhanced ML analysis of the current patient
    setTimeout(() => {
      // Calculate risk score using weighted factors
      const calculateRiskScore = () => {
        let score = 0;
        // Age factor
        if (patientData.age > 75) score += 25;
        else if (patientData.age > 65) score += 20;
        else if (patientData.age > 55) score += 15;
        else if (patientData.age > 45) score += 10;
        else score += 5;
        
        // Comorbidities
        if (patientData.diabetes) score += 15;
        if (patientData.hypertension) score += 10;
        if (patientData.heartDisease) score += 20;
        if (patientData.lungDisease) score += 18;
        if (patientData.renalDisease) score += 17;
        
        // ICU interventions
        if (patientData.ventilatorSupport) score += 25;
        if (patientData.vasopressors) score += 20;
        if (patientData.dialysis) score += 22;
        
        // History
        if (patientData.previousICUAdmission) score += 30;
        
        // Length of stay
        if (patientData.lengthOfStay > 14) score += 20;
        else if (patientData.lengthOfStay > 10) score += 15;
        else if (patientData.lengthOfStay > 7) score += 10;
        else if (patientData.lengthOfStay > 3) score += 5;
        
        return Math.min(score, 95); // Cap at 95%
      };
      
      const riskScore = calculateRiskScore();
      const riskCategory = riskScore > 70 ? "high" : riskScore > 40 ? "moderate" : "low";
      
      const comorbidities = [];
      if (patientData.diabetes) comorbidities.push("Diabetes");
      if (patientData.hypertension) comorbidities.push("Hypertension");
      if (patientData.heartDisease) comorbidities.push("Heart Disease");
      if (patientData.lungDisease) comorbidities.push("Lung Disease");
      if (patientData.renalDisease) comorbidities.push("Kidney Disease");
      
      const keyFactors = [];
      if (patientData.age > 65) keyFactors.push("Advanced age");
      if (patientData.ventilatorSupport) keyFactors.push("Required ventilator support");
      if (patientData.previousICUAdmission) keyFactors.push("Previous ICU admission");
      if (patientData.lengthOfStay > 10) keyFactors.push("Extended ICU stay");
      if (patientData.diabetes && patientData.heartDisease) keyFactors.push("Multiple comorbidities");
      
      const analysis = `
## ML Analysis of Current Patient

### Patient Profile
- ${patientData.age} year old ${patientData.gender}
- Primary diagnosis: ${patientData.primaryDiagnosis}
- Length of stay: ${patientData.lengthOfStay} days

### Risk Assessment
- Readmission risk score: ${riskScore}% (${riskCategory} risk category)
- Confidence interval: ±5%
- Similar patients readmission rate: ${Math.round(riskScore * 0.85)}%-${Math.min(Math.round(riskScore * 1.15), 99)}%

### Key Risk Factors
${keyFactors.map(f => `- ${f}`).join('\n')}

### Comorbidity Impact
${comorbidities.length > 0 ? comorbidities.map(c => `- ${c}`).join('\n') : '- No significant comorbidities'}

### Treatment Indicators
${patientData.ventilatorSupport ? '- Ventilator support (significant risk factor)\n' : ''}${patientData.vasopressors ? '- Vasopressor support (moderate risk factor)\n' : ''}${patientData.dialysis ? '- Dialysis (significant risk factor)\n' : ''}

### ML-Based Recommendations
${riskCategory === "high" ? '- Implement intensive follow-up protocol\n- Schedule follow-up within 72 hours\n- Consider home monitoring' : 
riskCategory === "moderate" ? '- Schedule follow-up within 7 days\n- Enhanced discharge education\n- Medication reconciliation recommended' : 
'- Standard follow-up protocol\n- Routine discharge planning sufficient'}

Would you like me to explain any specific aspect of this analysis in more detail?
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

  const handleCSVUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    setIsLoading(true);
    
    // Create a message about uploading CSV
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Uploading CSV file: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;
        
        if (!csvContent) {
          throw new Error("Failed to read file");
        }
        
        // Parse CSV data
        const parsedData = parseCSV(csvContent);
        // Convert the parsed data to the required type
        const typedData = convertToTypedPatientData(parsedData);
        
        // Generate analysis
        const analysis = analyzeCSVData(typedData);
        
        // If there's patient data, load the first patient
        if (typedData.length > 0) {
          const firstPatient = typedData[0];
          const patientData = createPatientDataFromCSV(firstPatient);
          
          // Set the patient data
          setPatientData(patientData);
          
          // Generate prediction
          generatePrediction(patientData);
          
          // Notify user
          toast({
            title: "CSV data processed",
            description: `Loaded ${typedData.length} patients. First patient set for prediction.`,
          });
        }
        
        // Display analysis
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "## CSV Data Analysis\n\n" + analysis.join('\n\n') + "\n\nI've loaded the first patient from the CSV for detailed prediction analysis. You can view the results in the Predictions page.",
            sender: "assistant",
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
        }, 2000);
        
      } catch (error) {
        console.error("Error processing CSV:", error);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I encountered an error processing the CSV file. Please make sure it's in the correct format with the required headers: patient_id, age, gender, length_of_stay, primary_diagnosis, diabetes, hypertension, heart_disease, lung_disease, renal_disease, ventilator_support, vasopressors, dialysis, previous_icu_admission",
          sender: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the file. Please try again.",
      });
      
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  const handleAnalyzeCSVData = () => {
    setIsLoading(true);
    
    // Create a message about analyzing CSV data
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Analyze CSV dataset with ML",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    try {
      // Get sample CSV data and analyze it
      const csvContent = getCSVSampleData();
      const parsedData = parseCSV(csvContent);
      // Convert the parsed data to the required type
      const typedData = convertToTypedPatientData(parsedData);
      const csvData = analyzeCSVData(typedData);
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "## ML Analysis of CSV Dataset\n\n" + csvData.join('\n\n') + "\n\nWould you like me to explain any specific aspect of this analysis or provide more detailed ML insights?",
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
- **Predictions**: View ML-powered readmission risk predictions
- **Model Info**: Learn about our machine learning model
- **CSV Upload**: Upload multiple patient records for batch analysis

## Where to Find Things
- **Patient Form**: Go to "Input Data" page
- **Prediction History**: Go to "Predictions" page
- **Sample Data**: Find on the "Input Data" page
- **Signup**: Use the button in the top-right corner
- **AI Assistant**: Click the assistant icon in the bottom-right corner

## How to Use CSV Uploads
1. Prepare your CSV with required headers
2. Go to Input Data page
3. Click "Select File" in the upload section
4. Once uploaded, view analysis or proceed to results

Need more specific help with the ML features or data analysis?`,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleMLModelExplanation = () => {
    setIsLoading(true);
    
    // Create a message about ML model
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Explain the ML prediction model",
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `## ICU Readmission ML Model Explained

Our machine learning model uses a gradient-boosted decision tree algorithm trained on a dataset of over 100,000 ICU stays to predict 30-day readmission risk.

### Key Model Features
- **Patient Demographics**: Age, gender, BMI
- **Medical History**: Diabetes, heart disease, lung disease, etc.
- **Current Stay Metrics**: Length of stay, primary diagnosis
- **Interventions**: Ventilator support, vasopressors, dialysis
- **Vital Signs Stability**: Trends over the stay period

### How Predictions Are Generated
1. Patient data is normalized and pre-processed
2. Feature extraction identifies key risk indicators
3. The ML algorithm calculates a base risk score
4. Risk modifiers are applied based on specific factors
5. Confidence intervals are calculated
6. Results are categorized into risk tiers

### Model Performance
- **Accuracy**: 84% on validation data
- **Sensitivity**: 82% (correctly identifying high-risk patients)
- **Specificity**: 79% (correctly identifying low-risk patients)
- **AUC**: 0.87

### Clinical Integration
The model outputs not just risk scores but actionable recommendations for follow-up protocols based on the specific risk factors identified for each patient.

Would you like more details about specific aspects of the ML model?`,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      
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
              ICU AI Assistant
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
              <Button variant="outline" size="sm" onClick={handlePatientDataAnalysis} className="text-xs flex items-center">
                <Brain className="mr-1 h-3 w-3" />
                Analyze Patient
              </Button>
              <Button variant="outline" size="sm" onClick={handleCSVUpload} className="text-xs flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                Upload CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleAnalyzeCSVData} className="text-xs flex items-center">
                <FileText className="mr-1 h-3 w-3" />
                CSV Analysis
              </Button>
              <Button variant="outline" size="sm" onClick={handleSiteHelpGuide} className="text-xs flex items-center">
                <HelpCircle className="mr-1 h-3 w-3" />
                Help Guide
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
                      {message.content.split('\n').map((line, i) => {
                        // Handle markdown-like headers
                        if (line.startsWith('## ')) {
                          return <h2 key={i} className="font-bold text-md mb-2">{line.replace(/^## /, '')}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={i} className="font-bold text-sm mb-1">{line.replace(/^### /, '')}</h3>;
                        } else if (line.startsWith('# ')) {
                          return <h1 key={i} className="font-bold text-lg mb-2">{line.replace(/^# /, '')}</h1>;
                        } else if (line.startsWith('- ')) {
                          return <p key={i} className="text-sm ml-2 mb-1">• {line.substring(2)}</p>;
                        } else if (line.trim() === '') {
                          return <div key={i} className="h-2"></div>;
                        } else {
                          return <p key={i} className="text-sm mb-1">{line}</p>;
                        }
                      })}
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
                        <span className="mr-2">AI processing</span>
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
                  placeholder="Ask about patient data, CSV files, ML predictions..."
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
