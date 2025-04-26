import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

export interface PatientData {
  id: string;
  age: number;
  gender: string;
  lengthOfStay: number;
  primaryDiagnosis: string;
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  lungDisease: boolean;
  renalDisease: boolean;
  ventilatorSupport: boolean;
  vasopressors: boolean;
  dialysis: boolean;
  previousICUAdmission: boolean;
  readmissionRisk?: number;
  height?: number;
  weight?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  kidneyDisease?: boolean;
  cancer?: boolean;
  immunocompromised?: boolean;
  vasopressorUse?: boolean;
  surgeryDuringStay?: boolean;
}

export interface PredictionResult {
  risk: number;
  confidence: number;
  predictedOutcome: string;
  keyFactors: string[];
  patientSummary: {
    age: number;
    gender: string;
    primaryDiagnosis: string;
    comorbidities: string[];
    lengthOfStay: number;
    vitals: {
      key: string;
      value: string;
      status?: "normal" | "warning" | "critical";
    }[];
  };
}

interface PatientDataContextType {
  patientData: PatientData | null;
  patientHistory: PatientData[];
  setPatientData: (data: PatientData) => void;
  clearPatientData: () => void;
  loadSamplePatient: (id: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  predictionResult: PredictionResult | null;
  generatePrediction: (data: PatientData) => void;
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

export const PatientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null);
  const [patientHistory, setPatientHistory] = useState<PatientData[]>([]);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const { isAuthenticated } = useAuth();

  // Set patient data and add to history
  const setPatientData = (data: PatientData) => {
    setPatientDataState(data);
    
    // Add to history if authenticated
    if (isAuthenticated) {
      setPatientHistory(prev => {
        // Check if patient already exists in history
        const exists = prev.some(p => p.id === data.id);
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
      
      // Save to localStorage if authenticated
      try {
        const savedHistory = JSON.parse(localStorage.getItem("patientHistory") || "[]");
        const exists = savedHistory.some((p: PatientData) => p.id === data.id);
        
        if (!exists) {
          const updatedHistory = [...savedHistory, data];
          localStorage.setItem("patientHistory", JSON.stringify(updatedHistory));
        }
      } catch (error) {
        console.error("Error saving patient history:", error);
      }
    }
  };

  // Generate prediction based on patient data
  const generatePrediction = (data: PatientData) => {
    // Calculate risk factors
    let riskFactors = [
      data.diabetes, 
      data.hypertension, 
      data.heartDisease,
      data.lungDisease,
      data.previousICUAdmission,
      data.ventilatorSupport,
      data.vasopressors || data.vasopressorUse
    ].filter(Boolean).length;
    
    // Base risk calculation
    const baseRisk = 10 + (riskFactors * 10);
    
    // Adjust for age
    const ageRisk = data.age > 65 ? 15 : data.age > 50 ? 8 : 0;
    
    // Adjust for length of stay
    const stayRisk = data.lengthOfStay > 10 ? 15 : data.lengthOfStay > 5 ? 7 : 0;
    
    // Total risk (capped at 95%)
    const risk = Math.min(baseRisk + ageRisk + stayRisk, 95);
    
    // Create confidence level (randomized for demo)
    const confidence = Math.floor(70 + Math.random() * 25);
    
    // Set key factors
    const keyFactors: string[] = [];
    if (data.age > 65) keyFactors.push("Advanced age (>65)");
    if (data.diabetes) keyFactors.push("Diabetes");
    if (data.hypertension) keyFactors.push("Hypertension");
    if (data.heartDisease) keyFactors.push("Heart disease");
    if (data.lungDisease) keyFactors.push("Lung disease");
    if (data.ventilatorSupport) keyFactors.push("Required ventilator support");
    if (data.vasopressors || data.vasopressorUse) keyFactors.push("Required vasopressors");
    if (data.lengthOfStay > 7) keyFactors.push(`Extended ICU stay (${data.lengthOfStay} days)`);
    if (data.previousICUAdmission) keyFactors.push("Previous ICU admission");
    
    // Create predicted outcome
    const predictedOutcome = risk > 70 
      ? "High risk of ICU readmission within 30 days" 
      : risk > 30 
      ? "Moderate risk of ICU readmission within 30 days" 
      : "Low risk of ICU readmission within 30 days";
    
    // Create comorbidities list
    const comorbidities = [];
    if (data.diabetes) comorbidities.push("Diabetes");
    if (data.hypertension) comorbidities.push("Hypertension");
    if (data.heartDisease) comorbidities.push("Heart Disease");
    if (data.lungDisease) comorbidities.push("Lung Disease");
    if (data.renalDisease) comorbidities.push("Renal Disease");
    if (data.kidneyDisease) comorbidities.push("Kidney Disease");
    if (data.cancer) comorbidities.push("Cancer");
    if (data.immunocompromised) comorbidities.push("Immunocompromised");
    
    // Create vitals
    const vitals = [
      { key: "Heart Rate", value: `${data.heartRate || "N/A"} bpm` },
      { key: "Blood Pressure", value: `${data.bloodPressureSystolic || "N/A"}/${data.bloodPressureDiastolic || "N/A"} mmHg` },
      { key: "Respiratory Rate", value: `${data.respiratoryRate || "N/A"} bpm` },
      { key: "Temperature", value: `${data.temperature || "N/A"} °C` },
      { key: "Oxygen Saturation", value: `${data.oxygenSaturation || "N/A"}%` }
    ];
    
    // Set the prediction result
    setPredictionResult({
      risk,
      confidence,
      predictedOutcome,
      keyFactors,
      patientSummary: {
        age: data.age,
        gender: data.gender,
        primaryDiagnosis: data.primaryDiagnosis,
        comorbidities,
        lengthOfStay: data.lengthOfStay,
        vitals
      }
    });
  };

  // Clear current patient data
  const clearPatientData = () => {
    setPatientDataState(null);
    setPredictionResult(null);
  };

  // Mock login function for the admin page
  const login = (email: string, password: string): boolean => {
    // This is a simplified login that just checks for non-empty fields
    // In a real app, you'd validate against a database
    if (email && password) {
      return true;
    }
    return false;
  };

  // Load sample patient from samples
  const loadSamplePatient = (id: string) => {
    // Find sample patient in the sample data
    const samplePatient = samplePatients.find(patient => patient.id === id);
    
    if (samplePatient) {
      // Calculate readmission risk based on factors
      const riskFactors = [
        samplePatient.diabetes, 
        samplePatient.hypertension, 
        samplePatient.heartDisease,
        samplePatient.lungDisease,
        samplePatient.renalDisease,
        samplePatient.ventilatorSupport,
        samplePatient.vasopressors,
        samplePatient.dialysis,
        samplePatient.previousICUAdmission
      ];
      
      const trueCount = riskFactors.filter(Boolean).length;
      const baseRisk = 0.1 + (trueCount * 0.05);
      let adjustedRisk = baseRisk;
      
      // Age adjustment
      if (samplePatient.age > 65) {
        adjustedRisk += 0.15;
      } else if (samplePatient.age > 45) {
        adjustedRisk += 0.05;
      }
      
      // Length of stay adjustment
      if (samplePatient.lengthOfStay > 10) {
        adjustedRisk += 0.1;
      } else if (samplePatient.lengthOfStay > 5) {
        adjustedRisk += 0.05;
      }
      
      // Cap at 0.95
      adjustedRisk = Math.min(adjustedRisk, 0.95);
      
      const patientDataWithRisk = {
        ...samplePatient,
        readmissionRisk: adjustedRisk
      };
      
      // Set the patient data with calculated risk
      setPatientData(patientDataWithRisk);
      
      // Generate prediction for the patient
      generatePrediction(patientDataWithRisk);
    }
  };

  return (
    <PatientDataContext.Provider value={{ 
      patientData, 
      patientHistory, 
      setPatientData, 
      clearPatientData, 
      loadSamplePatient,
      isAuthenticated,
      login,
      predictionResult,
      generatePrediction
    }}>
      {children}
    </PatientDataContext.Provider>
  );
};

export const usePatientData = () => {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error("usePatientData must be used within a PatientDataProvider");
  }
  return context;
};

// Sample patients data
const samplePatients = [
  {
    id: "sample1",
    name: "John Smith",
    age: 72,
    gender: "Male",
    lengthOfStay: 12,
    primaryDiagnosis: "Respiratory Failure",
    diabetes: true,
    hypertension: true,
    heartDisease: true,
    lungDisease: true,
    renalDisease: false,
    ventilatorSupport: true,
    vasopressors: true,
    dialysis: false,
    previousICUAdmission: true
  },
  {
    id: "sample2",
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    lengthOfStay: 5,
    primaryDiagnosis: "Sepsis",
    diabetes: false,
    hypertension: true,
    heartDisease: false,
    lungDisease: false,
    renalDisease: false,
    ventilatorSupport: false,
    vasopressors: true,
    dialysis: false,
    previousICUAdmission: false
  },
  {
    id: "sample3",
    name: "Robert Chen",
    age: 59,
    gender: "Male",
    lengthOfStay: 8,
    primaryDiagnosis: "Cardiovascular Disorder",
    diabetes: true,
    hypertension: true,
    heartDisease: true,
    lungDisease: false,
    renalDisease: true,
    ventilatorSupport: false,
    vasopressors: false,
    dialysis: true,
    previousICUAdmission: true
  }
];
