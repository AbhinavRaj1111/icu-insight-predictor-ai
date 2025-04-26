
export interface CSVPatientData {
  patient_id: string;
  age: number;
  gender: string;
  length_of_stay: number;
  primary_diagnosis: string;
  diabetes: boolean;
  hypertension: boolean;
  heart_disease: boolean;
  lung_disease: boolean;
  renal_disease: boolean;
  ventilator_support: boolean;
  vasopressors: boolean;
  dialysis: boolean;
  previous_icu_admission: boolean;
}

// Parse CSV string to array of objects
export function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const data: Record<string, string> = {};
    
    headers.forEach((header, i) => {
      data[header] = values[i] || "";
    });
    
    return data;
  });
}

// Convert string values to appropriate types for patient data
export function convertToTypedPatientData(rawData: Record<string, string>[]): CSVPatientData[] {
  return rawData.map(row => {
    return {
      patient_id: row.patient_id || '',
      age: parseInt(row.age) || 0,
      gender: row.gender || '',
      length_of_stay: parseInt(row.length_of_stay) || 0,
      primary_diagnosis: row.primary_diagnosis || '',
      diabetes: row.diabetes === "1" || row.diabetes?.toLowerCase() === "true",
      hypertension: row.hypertension === "1" || row.hypertension?.toLowerCase() === "true",
      heart_disease: row.heart_disease === "1" || row.heart_disease?.toLowerCase() === "true",
      lung_disease: row.lung_disease === "1" || row.lung_disease?.toLowerCase() === "true",
      renal_disease: row.renal_disease === "1" || row.renal_disease?.toLowerCase() === "true",
      ventilator_support: row.ventilator_support === "1" || row.ventilator_support?.toLowerCase() === "true",
      vasopressors: row.vasopressors === "1" || row.vasopressors?.toLowerCase() === "true",
      dialysis: row.dialysis === "1" || row.dialysis?.toLowerCase() === "true",
      previous_icu_admission: row.previous_icu_admission === "1" || row.previous_icu_admission?.toLowerCase() === "true"
    };
  });
}

// Analyze CSV data and return insights
export function analyzeCSVData(data: CSVPatientData[]): string[] {
  if (!data || data.length === 0) {
    return ["No data available for analysis."];
  }

  try {
    // Extract basic statistics
    const patientCount = data.length;
    
    // Age analysis
    const ages = data.map(p => p.age).filter(age => age > 0);
    const avgAge = ages.length ? ages.reduce((sum, age) => sum + age, 0) / ages.length : 0;
    const maxAge = Math.max(...ages);
    const minAge = Math.min(...ages);
    
    // Gender distribution
    const maleCount = data.filter(p => p.gender.toLowerCase() === "male").length;
    const femaleCount = data.filter(p => p.gender.toLowerCase() === "female").length;
    const malePercentage = (maleCount / patientCount) * 100;
    const femalePercentage = (femaleCount / patientCount) * 100;
    
    // Length of stay analysis
    const stayDays = data.map(p => p.length_of_stay);
    const avgStay = stayDays.reduce((sum, days) => sum + days, 0) / patientCount;
    
    // Condition prevalence
    const diabetesCount = data.filter(p => p.diabetes).length;
    const hypertensionCount = data.filter(p => p.hypertension).length;
    const heartDiseaseCount = data.filter(p => p.heart_disease).length;
    const lungDiseaseCount = data.filter(p => p.lung_disease).length;
    
    // Ventilator and vasopressor usage
    const ventilatorCount = data.filter(p => p.ventilator_support).length;
    const vasopressorCount = data.filter(p => p.vasopressors).length;
    
    // Create readmission risk model (simplified)
    const highRiskPatients = data.filter(p => {
      let riskFactors = 0;
      if (p.diabetes) riskFactors++;
      if (p.hypertension) riskFactors++;
      if (p.heart_disease) riskFactors++;
      if (p.lung_disease) riskFactors++;
      if (p.ventilator_support) riskFactors++;
      if (p.previous_icu_admission) riskFactors += 2;
      if (p.age > 65) riskFactors++;
      return riskFactors >= 3;
    });
    
    const highRiskPercentage = (highRiskPatients.length / patientCount) * 100;

    // Generate insights
    const insights = [
      `Patient Population (${patientCount} total)`,
      `Average age: ${avgAge.toFixed(1)} years (range: ${minAge} - ${maxAge})`,
      `Gender distribution: ${malePercentage.toFixed(1)}% male, ${femalePercentage.toFixed(1)}% female`,
      
      `Hospital Stay Metrics`,
      `Average length of stay: ${avgStay.toFixed(1)} days`,
      
      `Medical Conditions`,
      `Diabetes: ${((diabetesCount / patientCount) * 100).toFixed(1)}%`,
      `Hypertension: ${((hypertensionCount / patientCount) * 100).toFixed(1)}%`,
      `Heart Disease: ${((heartDiseaseCount / patientCount) * 100).toFixed(1)}%`,
      `Lung Disease: ${((lungDiseaseCount / patientCount) * 100).toFixed(1)}%`,
      
      `Treatment Indicators`,
      `Ventilator support: ${((ventilatorCount / patientCount) * 100).toFixed(1)}%`,
      `Vasopressor therapy: ${((vasopressorCount / patientCount) * 100).toFixed(1)}%`,
      
      `Readmission Risk Assessment`,
      `High-risk patients: ${highRiskPercentage.toFixed(1)}% of population`,
      `Patients needing close follow-up: ${highRiskPatients.length}`
    ];
    
    return insights;
  } catch (error) {
    console.error("Error analyzing CSV data:", error);
    return ["Error analyzing CSV data. Please check format and try again."];
  }
}

// Get sample CSV data for demonstration
export function getCSVSampleData(): string {
  return `patient_id,age,gender,length_of_stay,primary_diagnosis,diabetes,hypertension,heart_disease,lung_disease,renal_disease,ventilator_support,vasopressors,dialysis,previous_icu_admission
P001,72,Male,12,Respiratory Failure,1,1,1,1,0,1,1,0,1
P002,45,Female,5,Sepsis,0,1,0,0,0,0,1,0,0
P003,59,Male,8,Cardiovascular Disorder,1,1,1,0,1,0,0,1,1
P004,68,Female,10,Respiratory Failure,1,1,0,1,0,1,0,0,0
P005,51,Male,7,Trauma,0,0,0,0,0,0,1,0,0
P006,79,Female,15,Sepsis,1,1,1,1,1,1,1,1,1
P007,62,Male,6,Gastrointestinal Bleeding,0,1,1,0,0,0,1,0,0
P008,55,Female,4,Acute Pancreatitis,0,0,0,0,0,0,0,0,0
P009,83,Male,11,Pneumonia,0,1,1,1,1,1,0,0,1
P010,49,Female,3,Diabetic Ketoacidosis,1,0,0,0,0,0,0,0,1`;
}
