
import { createContext, useContext, useState, ReactNode } from "react";
import { samplePatients } from "../data/samplePatients";

// Define the types for patient data
export interface PatientData {
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

export interface PredictionResult {
  risk: number;
  confidence: number;
  predictedOutcome: "High Risk" | "Moderate Risk" | "Low Risk";
  keyFactors: string[];
  patientSummary: {
    name: string;
    age: number;
    gender: string;
    vitalSigns: Array<{ name: string; value: string; unit: string; normal: boolean }>;
    medicalHistory: Array<{ condition: string; present: boolean }>;
    primaryDiagnosis: string;
    lengthOfStay: number;
    ventilatorSupport: boolean;
    vasopressorUse: boolean;
    surgeryDuringStay: boolean;
  };
}

interface PatientDataContextType {
  patientData: PatientData | null;
  predictionResult: PredictionResult | null;
  setPatientData: (data: PatientData) => void;
  generatePrediction: (data: PatientData) => PredictionResult;
  loadSamplePatient: (id: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const generatePrediction = (data: PatientData): PredictionResult => {
    // In a real application, this would call an ML model API
    // For now, we'll simulate prediction generation based on input factors
    
    // Calculate risk based on some basic rules (this is a simplistic model for demonstration)
    let riskScore = 0;
    let confidenceScore = 85;
    
    // Age factor (older patients have higher risk)
    const age = parseInt(data.age);
    if (age > 65) riskScore += 20;
    else if (age > 50) riskScore += 10;
    
    // Respiratory rate factor
    const respRate = parseInt(data.respiratoryRate);
    if (respRate > 24) riskScore += 15;
    
    // Length of stay factor
    const los = parseInt(data.lengthOfStay);
    if (los > 7) riskScore += 15;
    else if (los > 3) riskScore += 8;
    
    // Medical history factors
    if (data.diabetes) riskScore += 10;
    if (data.hypertension) riskScore += 8;
    if (data.heartDisease) riskScore += 12;
    if (data.lungDisease) riskScore += 15;
    if (data.kidneyDisease) riskScore += 10;
    
    // ICU interventions
    if (data.ventilatorSupport) riskScore += 20;
    if (data.vasopressorUse) riskScore += 15;
    if (data.surgeryDuringStay) riskScore += 5;
    
    // Normalize risk score to 0-100 range
    riskScore = Math.min(Math.max(riskScore, 0), 100);
    
    // Determine outcome based on risk score
    let predictedOutcome: "High Risk" | "Moderate Risk" | "Low Risk";
    if (riskScore >= 70) predictedOutcome = "High Risk";
    else if (riskScore >= 30) predictedOutcome = "Moderate Risk";
    else predictedOutcome = "Low Risk";
    
    // Generate key factors
    const keyFactors: string[] = [];
    
    if (age > 65) keyFactors.push(`Advanced age (${age} years)`);
    if (data.diabetes) keyFactors.push("History of diabetes");
    if (data.hypertension) keyFactors.push("History of hypertension");
    if (data.heartDisease) keyFactors.push("Heart disease");
    if (data.lungDisease) keyFactors.push("Lung disease");
    if (respRate > 24) keyFactors.push(`Elevated respiratory rate (${respRate} bpm)`);
    if (los > 7) keyFactors.push(`Extended ICU stay (${los} days)`);
    if (data.ventilatorSupport) keyFactors.push("Required ventilator support");
    if (data.vasopressorUse) keyFactors.push("Required vasopressors");
    
    // Limit to top 5 factors if more exist
    if (keyFactors.length > 5) {
      keyFactors.splice(5);
    }
    
    // If no key factors were identified, add a default message
    if (keyFactors.length === 0) {
      keyFactors.push("No significant risk factors identified");
    }
    
    // Construct patient vital signs for summary
    const vitalSigns = [
      { 
        name: "Heart Rate", 
        value: data.heartRate, 
        unit: "bpm", 
        normal: parseInt(data.heartRate) >= 60 && parseInt(data.heartRate) <= 100 
      },
      { 
        name: "Blood Pressure", 
        value: `${data.bloodPressureSystolic}/${data.bloodPressureDiastolic}`, 
        unit: "mmHg", 
        normal: parseInt(data.bloodPressureSystolic) < 140 && parseInt(data.bloodPressureDiastolic) < 90 
      },
      { 
        name: "Respiratory Rate", 
        value: data.respiratoryRate, 
        unit: "bpm", 
        normal: parseInt(data.respiratoryRate) >= 12 && parseInt(data.respiratoryRate) <= 20 
      },
      { 
        name: "Temperature", 
        value: data.temperature, 
        unit: "°C", 
        normal: parseFloat(data.temperature) >= 36.5 && parseFloat(data.temperature) <= 37.5 
      },
      { 
        name: "Oxygen Saturation", 
        value: data.oxygenSaturation, 
        unit: "%", 
        normal: parseInt(data.oxygenSaturation) >= 95 
      },
    ];
    
    // Construct medical history for summary
    const medicalHistory = [
      { condition: "Diabetes", present: data.diabetes },
      { condition: "Hypertension", present: data.hypertension },
      { condition: "Heart Disease", present: data.heartDisease },
      { condition: "Lung Disease", present: data.lungDisease },
      { condition: "Kidney Disease", present: data.kidneyDisease },
      { condition: "Cancer", present: data.cancer },
    ];
    
    // Create prediction result
    const result: PredictionResult = {
      risk: riskScore,
      confidence: confidenceScore,
      predictedOutcome,
      keyFactors,
      patientSummary: {
        name: "Patient", // We don't collect name in our form for privacy
        age,
        gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
        vitalSigns,
        medicalHistory,
        primaryDiagnosis: data.primaryDiagnosis === "respiratory" 
          ? "Respiratory Failure" 
          : data.primaryDiagnosis.charAt(0).toUpperCase() + data.primaryDiagnosis.slice(1),
        lengthOfStay: parseInt(data.lengthOfStay),
        ventilatorSupport: data.ventilatorSupport,
        vasopressorUse: data.vasopressorUse,
        surgeryDuringStay: data.surgeryDuringStay,
      }
    };
    
    // Update context state
    setPredictionResult(result);
    
    return result;
  };

  // Function to load sample patient data
  const loadSamplePatient = (id: string) => {
    const samplePatient = samplePatients.find(patient => patient.id === id);
    if (samplePatient) {
      setPatientData(samplePatient.data);
      generatePrediction(samplePatient.data);
    }
  };

  // Admin authentication
  const login = (email: string, password: string): boolean => {
    // Simple authentication for demonstration
    if (email === "abhinavraj5025@gmail.com" && password === "123456") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <PatientDataContext.Provider
      value={{
        patientData,
        predictionResult,
        setPatientData,
        generatePrediction,
        loadSamplePatient,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </PatientDataContext.Provider>
  );
}

export function usePatientData() {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error("usePatientData must be used within a PatientDataProvider");
  }
  return context;
}
