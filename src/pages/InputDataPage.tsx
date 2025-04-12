
import MainLayout from "@/layouts/MainLayout";
import PatientForm from "@/components/PatientForm";

const InputDataPage = () => {
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
        <main className="medical-container mt-8">
          <PatientForm />
        </main>
      </div>
    </MainLayout>
  );
};

export default InputDataPage;
