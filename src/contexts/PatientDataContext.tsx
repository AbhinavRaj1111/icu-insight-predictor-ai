
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
  login?: (email: string, password: string) => Promise<boolean> | boolean;
  predictionResult: PredictionResult | null;
  generatePrediction: (data: PatientData) => void;
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

// Import sample patients from data file
import { samplePatients } from "@/data/samplePatients";

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

  // Generate prediction based on patient data using ML-like approach
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
    
    // Base risk calculation (simulating ML model)
    const baseRisk = 10 + (riskFactors * 10);
    
    // Adjust for age (ML feature weight)
    const ageRisk = data.age > 75 ? 20 : data.age > 65 ? 15 : data.age > 50 ? 8 : 0;
    
    // Adjust for length of stay (ML feature weight)
    const stayRisk = data.lengthOfStay > 14 ? 20 : data.lengthOfStay > 10 ? 15 : data.lengthOfStay > 5 ? 7 : 0;
    
    // Interaction effects (ML model would detect these relationships)
    let interactionRisk = 0;
    if (data.diabetes && data.heartDisease) interactionRisk += 10;
    if (data.ventilatorSupport && data.lengthOfStay > 7) interactionRisk += 8;
    if (data.age > 65 && data.lungDisease) interactionRisk += 12;
    
    // Total risk (capped at 95%)
    const risk = Math.min(baseRisk + ageRisk + stayRisk + interactionRisk, 95);
    
    // Create confidence level (simulated from ML model)
    const confidence = Math.floor(70 + Math.random() * 25);
    
    // Set key factors (feature importance from ML model)
    const keyFactors: string[] = [];
    
    if (data.age > 75) keyFactors.push("Advanced age (>75)");
    else if (data.age > 65) keyFactors.push("Advanced age (>65)");
    
    if (data.diabetes) keyFactors.push("Diabetes");
    if (data.hypertension) keyFactors.push("Hypertension");
    if (data.heartDisease) keyFactors.push("Heart disease");
    if (data.lungDisease) keyFactors.push("Lung disease");
    if (data.ventilatorSupport) keyFactors.push("Required ventilator support");
    if (data.vasopressors || data.vasopressorUse) keyFactors.push("Required vasopressors");
    if (data.lengthOfStay > 10) keyFactors.push(`Extended ICU stay (${data.lengthOfStay} days)`);
    if (data.previousICUAdmission) keyFactors.push("Previous ICU admission");
    if (data.dialysis) keyFactors.push("Required dialysis");
    
    // Sort factors by importance (simulating ML feature importance)
    keyFactors.sort((a, b) => {
      const importanceA = a.includes("ventilator") ? 5 : 
                          a.includes("Previous ICU") ? 4 :
                          a.includes("dialysis") ? 3 :
                          a.includes("Extended ICU") ? 2 : 1;
                          
      const importanceB = b.includes("ventilator") ? 5 : 
                          b.includes("Previous ICU") ? 4 :
                          b.includes("dialysis") ? 3 :
                          b.includes("Extended ICU") ? 2 : 1;
      
      return importanceB - importanceA;
    });
    
    // Take top 4 factors at most
    const topFactors = keyFactors.slice(0, 4);
    
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
    
    // Create vitals with status based on normal ranges
    const vitals = [
      { 
        key: "Heart Rate", 
        value: `${data.heartRate || "N/A"} bpm`,
        status: data.heartRate ? (data.heartRate < 60 || data.heartRate > 100 ? "warning" : "normal") : undefined
      },
      { 
        key: "Blood Pressure", 
        value: `${data.bloodPressureSystolic || "N/A"}/${data.bloodPressureDiastolic || "N/A"} mmHg`,
        status: data.bloodPressureSystolic ? 
          (data.bloodPressureSystolic > 140 || data.bloodPressureSystolic < 90 ? "warning" : "normal") : undefined
      },
      { 
        key: "Respiratory Rate", 
        value: `${data.respiratoryRate || "N/A"} bpm`,
        status: data.respiratoryRate ? 
          (data.respiratoryRate > 20 || data.respiratoryRate < 12 ? "warning" : "normal") : undefined
      },
      { 
        key: "Temperature", 
        value: `${data.temperature || "N/A"} °C`,
        status: data.temperature ? 
          (data.temperature > 38 ? "warning" : data.temperature > 39 ? "critical" : "normal") : undefined
      },
      { 
        key: "Oxygen Saturation", 
        value: `${data.oxygenSaturation || "N/A"}%`,
        status: data.oxygenSaturation ? 
          (data.oxygenSaturation < 94 ? "warning" : data.oxygenSaturation < 90 ? "critical" : "normal") : undefined
      }
    ];
    
    // Set the prediction result
    setPredictionResult({
      risk,
      confidence,
      predictedOutcome,
      keyFactors: topFactors,
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

  // Mock login function that returns a Promise
  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a simplified login that just checks for non-empty fields
    // In a real app, you'd validate against a database
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(email.length > 0 && password.length > 0);
      }, 1000);
    });
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
