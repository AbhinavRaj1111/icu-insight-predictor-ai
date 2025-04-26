
import MainLayout from "@/layouts/MainLayout";
import PatientForm from "@/components/PatientForm";
import AIAssistant from "@/components/AIAssistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload, FileDown } from "lucide-react";
import { usePatientData } from "@/contexts/PatientDataContext";
import { samplePatients } from "@/data/samplePatients";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getCSVSampleData } from "@/utils/csvParser";
import { useAuth } from "@/contexts/AuthContext";

const InputDataPage = () => {
  const { loadSamplePatient } = usePatientData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

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
    
    toast({
      title: "Sample CSV downloaded",
      description: "You can use this as a template for your own patient data uploads.",
    });
  };

  return (
    <MainLayout>
      <div className="py-10">
        <header className="medical-container">
          <h1 className="page-title">Patient Data Input</h1>
          <p className="page-subtitle">
            Enter patient information to generate an ICU readmission prediction using our ML model. Fill out the form below or upload a CSV file
            containing patient data.
          </p>

          {!isAuthenticated && (
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-700">
                  <strong>Create an account or login</strong> to save your predictions and access all features.
                </p>
              </CardContent>
            </Card>
          )}
        </header>

        <div className="medical-container mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Sample Patients</CardTitle>
              <CardDescription>
                Load sample patient data to quickly see ML prediction results
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
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDown className="mr-2 h-5 w-5" />
                CSV Data Import
              </CardTitle>
              <CardDescription>
                Download a sample CSV file or upload your patient data for ML analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Our ML model can analyze CSV datasets to identify patterns and risk factors across multiple patients.
                Download the sample CSV template below to see the required format.
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="p-6 h-auto flex flex-col items-center justify-center space-y-2"
                  onClick={handleDownloadSampleCSV}
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="font-medium">Download Sample CSV</span>
                  <span className="text-xs text-gray-500">15 sample patients with complete data</span>
                </Button>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <h4 className="font-medium text-sm mb-2">Required CSV Headers:</h4>
                <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  patient_id, age, gender, length_of_stay, primary_diagnosis, diabetes, hypertension, heart_disease, lung_disease, renal_disease, ventilator_support, vasopressors, dialysis, previous_icu_admission
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Boolean values should be represented as 1 (true) or 0 (false).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <main className="medical-container mt-8">
          <PatientForm />
        </main>

        <AIAssistant />
      </div>
    </MainLayout>
  );
};

export default InputDataPage;
