
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
  readmissionRisk: number;
}

interface PatientDataContextType {
  patientData: PatientData | null;
  patientHistory: PatientData[];
  setPatientData: (data: PatientData) => void;
  clearPatientData: () => void;
  loadSamplePatient: (id: string) => void;
  isAuthenticated: boolean;
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

export const PatientDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null);
  const [patientHistory, setPatientHistory] = useState<PatientData[]>([]);
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

  // Clear current patient data
  const clearPatientData = () => {
    setPatientDataState(null);
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
      
      // Set the patient data with calculated risk
      setPatientData({
        ...samplePatient,
        readmissionRisk: parseFloat(adjustedRisk.toFixed(2))
      });
    }
  };

  return (
    <PatientDataContext.Provider value={{ 
      patientData, 
      patientHistory, 
      setPatientData, 
      clearPatientData, 
      loadSamplePatient,
      isAuthenticated
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
