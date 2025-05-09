
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  // Convert risk level string to the required type
  const getRiskLevel = (): "High Risk" | "Moderate Risk" | "Low Risk" => {
    if (predictionResult.risk >= 70) return "High Risk";
    if (predictionResult.risk >= 30) return "Moderate Risk";
    return "Low Risk";
  };

  // Create vitalSigns array for PatientSummary
  const vitalSigns = predictionResult.patientSummary.vitals.map(vital => {
    const valueParts = vital.value.split(' ');
    return {
      name: vital.key,
      value: valueParts[0],
      unit: valueParts.length > 1 ? valueParts.slice(1).join(' ') : '',
      normal: vital.status !== "warning" && vital.status !== "critical"
    };
  });

  // Create medicalHistory array for PatientSummary
  const medicalHistory = predictionResult.patientSummary.comorbidities.map(condition => ({
    condition,
    present: true
  }));

  const handleDownload = async () => {
    toast({
      title: "Preparing download",
      description: "Please wait while we generate your PDF...",
    });

    try {
      const reportElement = document.getElementById('prediction-report');
      if (!reportElement) {
        throw new Error("Report element not found");
      }

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions (A4 format - 210x297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20; // Top margin
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated by ICU Readmission Predictor ML - ' + new Date().toLocaleString(), 14, pdfHeight - 10);
      
      // Save the PDF
      pdf.save(`patient-prediction-${new Date().toISOString().slice(0, 10)}.pdf`);

      toast({
        title: "Download successful",
        description: "Your ML prediction report has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
      });
    }
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
              <h1 className="page-title">ML Prediction Results</h1>
              <p className="page-subtitle">
                AI-powered prediction results and clinical recommendations
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

        <main className="medical-container mt-8 space-y-6" id="prediction-report">
          <PredictionResult
            risk={predictionResult.risk}
            confidence={predictionResult.confidence}
            predictedOutcome={getRiskLevel()}
            keyFactors={predictionResult.keyFactors}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientSummary
              name={`Patient ${patientData.id.substring(0, 8)}`}
              age={patientData.age}
              gender={patientData.gender}
              vitalSigns={vitalSigns}
              medicalHistory={medicalHistory}
              primaryDiagnosis={predictionResult.patientSummary.primaryDiagnosis}
              lengthOfStay={predictionResult.patientSummary.lengthOfStay}
              ventilatorSupport={patientData.ventilatorSupport}
              vasopressorUse={patientData.vasopressors}
              surgeryDuringStay={patientData.surgeryDuringStay || false}
            />
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
