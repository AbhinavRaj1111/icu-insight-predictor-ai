
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import PredictionResult from "@/components/PredictionResult";
import PatientSummary from "@/components/PatientSummary";
import RecommendationSection from "@/components/RecommendationSection";
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatientData } from "@/contexts/PatientDataContext";

const PredictionsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { predictionResult, patientData } = usePatientData();
  
  // If there's no prediction data, redirect to the input page
  useEffect(() => {
    if (!predictionResult || !patientData) {
      toast({
        variant: "destructive",
        title: "No prediction data",
        description: "Please enter patient data to generate a prediction.",
      });
      navigate("/input-data");
    }
  }, [predictionResult, patientData, navigate, toast]);

  // If still loading or no data, return early
  if (!predictionResult || !patientData) {
    return null;
  }

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
            risk={predictionResult.risk}
            confidence={predictionResult.confidence}
            predictedOutcome={predictionResult.predictedOutcome}
            keyFactors={predictionResult.keyFactors}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientSummary {...predictionResult.patientSummary} />
            <RecommendationSection 
              riskLevel={predictionResult.risk >= 70 ? "high" : predictionResult.risk >= 30 ? "moderate" : "low"} 
            />
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default PredictionsPage;
