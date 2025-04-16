
// Sample patient data for demonstration
export interface SamplePatient {
  id: string;
  name: string;
  data: {
    // Demographics
    age: string;
    gender: string;
    height: string;
    weight: string;
    
    // Vital Signs
    heartRate: string;
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
    respiratoryRate: string;
    temperature: string;
    oxygenSaturation: string;
    
    // Medical History
    diabetes: boolean;
    hypertension: boolean;
    heartDisease: boolean;
    lungDisease: boolean;
    kidneyDisease: boolean;
    cancer: boolean;
    immunocompromised: boolean;
    
    // Current ICU Stay
    primaryDiagnosis: string;
    lengthOfStay: string;
    ventilatorSupport: boolean;
    vasopressorUse: boolean;
    surgeryDuringStay: boolean;
  }
}

export const samplePatients: SamplePatient[] = [
  {
    id: "sample1",
    name: "Patient A (High Risk)",
    data: {
      age: "72",
      gender: "male",
      height: "175",
      weight: "82",
      heartRate: "92",
      bloodPressureSystolic: "158",
      bloodPressureDiastolic: "95",
      respiratoryRate: "26",
      temperature: "38.1",
      oxygenSaturation: "92",
      diabetes: true,
      hypertension: true,
      heartDisease: true,
      lungDisease: true,
      kidneyDisease: false,
      cancer: false,
      immunocompromised: false,
      primaryDiagnosis: "respiratory",
      lengthOfStay: "9",
      ventilatorSupport: true,
      vasopressorUse: true,
      surgeryDuringStay: false
    }
  },
  {
    id: "sample2",
    name: "Patient B (Moderate Risk)",
    data: {
      age: "58",
      gender: "female",
      height: "165",
      weight: "74",
      heartRate: "85",
      bloodPressureSystolic: "145",
      bloodPressureDiastolic: "88",
      respiratoryRate: "22",
      temperature: "37.4",
      oxygenSaturation: "94",
      diabetes: true,
      hypertension: true,
      heartDisease: false,
      lungDisease: false,
      kidneyDisease: false,
      cancer: false,
      immunocompromised: false,
      primaryDiagnosis: "sepsis",
      lengthOfStay: "5",
      ventilatorSupport: false,
      vasopressorUse: true,
      surgeryDuringStay: false
    }
  },
  {
    id: "sample3",
    name: "Patient C (Low Risk)",
    data: {
      age: "42",
      gender: "male",
      height: "180",
      weight: "75",
      heartRate: "72",
      bloodPressureSystolic: "125",
      bloodPressureDiastolic: "78",
      respiratoryRate: "16",
      temperature: "36.8",
      oxygenSaturation: "98",
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      lungDisease: false,
      kidneyDisease: false,
      cancer: false,
      immunocompromised: false,
      primaryDiagnosis: "postoperative",
      lengthOfStay: "2",
      ventilatorSupport: false,
      vasopressorUse: false,
      surgeryDuringStay: true
    }
  }
];
