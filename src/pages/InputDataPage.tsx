
import MainLayout from "@/layouts/MainLayout";
import PatientForm from "@/components/PatientForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { usePatientData } from "@/contexts/PatientDataContext";
import { samplePatients } from "@/data/samplePatients";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
        )}

        <main className="medical-container mt-8">
          <PatientForm />
        </main>
      </div>
    </MainLayout>
  );
};

export default InputDataPage;
