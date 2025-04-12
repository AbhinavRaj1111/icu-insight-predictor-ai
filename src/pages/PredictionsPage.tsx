
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import PredictionResult from "@/components/PredictionResult";
import PatientSummary from "@/components/PatientSummary";
import RecommendationSection from "@/components/RecommendationSection";
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PredictionsPage = () => {
  const { toast } = useToast();
  
  // This would normally come from an API or state management
  // Here we're using mock data for demonstration
  const [predictionData] = useState({
    risk: 75,
    confidence: 89,
    predictedOutcome: "High Risk" as const,
    keyFactors: [
      "History of hypertension and diabetes",
      "Elevated respiratory rate (28 bpm)",
      "Length of ICU stay (10 days)",
      "Required ventilator support",
      "Age (72 years)"
    ],
    patientSummary: {
      name: "John Doe",
      age: 72,
      gender: "Male",
      vitalSigns: [
        { name: "Heart Rate", value: "98", unit: "bpm", normal: true },
        { name: "Blood Pressure", value: "142/95", unit: "mmHg", normal: false },
        { name: "Respiratory Rate", value: "28", unit: "bpm", normal: false },
        { name: "Temperature", value: "37.2", unit: "°C", normal: true },
        { name: "Oxygen Saturation", value: "94", unit: "%", normal: false },
      ],
      medicalHistory: [
        { condition: "Diabetes", present: true },
        { condition: "Hypertension", present: true },
        { condition: "Heart Disease", present: false },
        { condition: "Lung Disease", present: true },
        { condition: "Kidney Disease", present: false },
        { condition: "Cancer", present: false },
      ],
      primaryDiagnosis: "Respiratory Failure",
      lengthOfStay: 10,
      ventilatorSupport: true,
      vasopressorUse: false,
      surgeryDuringStay: false,
    },
  });

  const handleDownload = () => {
    toast({
      title: "Report Downloaded",
      description: "The prediction report has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Report Shared",
      description: "The prediction report has been shared successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="py-10">
        <header className="medical-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="page-title">Prediction Results</h1>
              <p className="page-subtitle">
                AI-generated prediction results and clinical recommendations
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        <main className="medical-container mt-8 space-y-6">
          <PredictionResult
            risk={predictionData.risk}
            confidence={predictionData.confidence}
            predictedOutcome={predictionData.predictedOutcome}
            keyFactors={predictionData.keyFactors}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientSummary {...predictionData.patientSummary} />
            <RecommendationSection 
              riskLevel={predictionData.risk >= 70 ? "high" : predictionData.risk >= 30 ? "moderate" : "low"} 
            />
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default PredictionsPage;
