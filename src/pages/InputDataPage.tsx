
import MainLayout from "@/layouts/MainLayout";
import PatientForm from "@/components/PatientForm";
import AIAssistant from "@/components/AIAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload } from "lucide-react";
import { usePatientData } from "@/contexts/PatientDataContext";
import { samplePatients } from "@/data/samplePatients";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getCSVSampleData } from "@/utils/csvParser";

const InputDataPage = () => {
  const { loadSamplePatient, isAuthenticated } = usePatientData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoadSample = (id: string) => {
    loadSamplePatient(id);
    toast({
      title: "Sample data loaded",
      description: "Sample patient data has been loaded successfully.",
    });
    navigate("/predictions");
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = getCSVSampleData();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_patient_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="py-10">
        <header className="medical-container">
          <h1 className="page-title">Patient Data Input</h1>
          <p className="page-subtitle">
            Enter patient information to generate an ICU readmission prediction. Fill out the form below or upload a file
            containing patient data.
          </p>
        </header>

        {isAuthenticated && (
          <>
            <div className="medical-container mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Patients</CardTitle>
                  <CardDescription>
                    Load sample patient data to quickly see prediction results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {samplePatients.map((patient) => (
                      <Button
                        key={patient.id}
                        variant="outline"
                        className="p-6 h-auto flex flex-col items-center justify-center space-y-2"
                        onClick={() => handleLoadSample(patient.id)}
                      >
                        <Database className="h-8 w-8 mb-2" />
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-xs text-gray-500">Click to load</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="medical-container mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sample CSV Data</CardTitle>
                  <CardDescription>
                    Download a sample CSV file to see the required format
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="p-6 h-auto flex flex-col items-center justify-center space-y-2"
                    onClick={handleDownloadSampleCSV}
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="font-medium">Download Sample CSV</span>
                    <span className="text-xs text-gray-500">Click to download</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <main className="medical-container mt-8">
          <PatientForm />
        </main>

        {isAuthenticated && <AIAssistant />}
      </div>
    </MainLayout>
  );
};

export default InputDataPage;
