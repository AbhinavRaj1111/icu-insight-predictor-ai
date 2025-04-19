
export interface CSVPatientData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  heartRate: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  respiratoryRate: string;
  temperature: string;
  oxygenSaturation: string;
  diabetes: string;
  hypertension: string;
  heartDisease: string;
  lungDisease: string;
  kidneyDisease: string;
  cancer: string;
  immunocompromised: string;
  primaryDiagnosis: string;
  lengthOfStay: string;
  ventilatorSupport: string;
  vasopressorUse: string;
  surgeryDuringStay: string;
}

export const parseCSV = (csvContent: string): CSVPatientData[] => {
  // Split the CSV content by new line
  const lines = csvContent.trim().split("\n");
  
  // Extract headers from the first line
  const headers = lines[0].split(",").map(header => header.trim());
  
  // Parse each line into an object
  return lines.slice(1).map(line => {
    const values = line.split(",").map(value => value.trim());
    const patientData: Record<string, string> = {};
    
    // Map each value to its corresponding header
    headers.forEach((header, index) => {
      patientData[header] = values[index] || "";
    });
    
    // Ensure all required fields of CSVPatientData are present
    const requiredFields: (keyof CSVPatientData)[] = [
      'age', 'gender', 'height', 'weight', 'heartRate', 
      'bloodPressureSystolic', 'bloodPressureDiastolic', 'respiratoryRate', 
      'temperature', 'oxygenSaturation', 'diabetes', 'hypertension', 
      'heartDisease', 'lungDisease', 'kidneyDisease', 'cancer', 
      'immunocompromised', 'primaryDiagnosis', 'lengthOfStay', 
      'ventilatorSupport', 'vasopressorUse', 'surgeryDuringStay'
    ];
    
    // Set default empty string for any missing fields
    requiredFields.forEach(field => {
      if (patientData[field] === undefined) {
        patientData[field] = "";
      }
    });
    
    // Create a new object that explicitly matches CSVPatientData interface
    const typedPatientData: CSVPatientData = {
      age: patientData.age || '',
      gender: patientData.gender || '',
      height: patientData.height || '',
      weight: patientData.weight || '',
      heartRate: patientData.heartRate || '',
      bloodPressureSystolic: patientData.bloodPressureSystolic || '',
      bloodPressureDiastolic: patientData.bloodPressureDiastolic || '',
      respiratoryRate: patientData.respiratoryRate || '',
      temperature: patientData.temperature || '',
      oxygenSaturation: patientData.oxygenSaturation || '',
      diabetes: patientData.diabetes || '',
      hypertension: patientData.hypertension || '',
      heartDisease: patientData.heartDisease || '',
      lungDisease: patientData.lungDisease || '',
      kidneyDisease: patientData.kidneyDisease || '',
      cancer: patientData.cancer || '',
      immunocompromised: patientData.immunocompromised || '',
      primaryDiagnosis: patientData.primaryDiagnosis || '',
      lengthOfStay: patientData.lengthOfStay || '',
      ventilatorSupport: patientData.ventilatorSupport || '',
      vasopressorUse: patientData.vasopressorUse || '',
      surgeryDuringStay: patientData.surgeryDuringStay || ''
    };
    
    return typedPatientData;
  });
};

export const convertCSVToPatientData = (csvData: CSVPatientData) => {
  return {
    age: csvData.age,
    gender: csvData.gender,
    height: csvData.height,
    weight: csvData.weight,
    heartRate: csvData.heartRate,
    bloodPressureSystolic: csvData.bloodPressureSystolic,
    bloodPressureDiastolic: csvData.bloodPressureDiastolic,
    respiratoryRate: csvData.respiratoryRate,
    temperature: csvData.temperature,
    oxygenSaturation: csvData.oxygenSaturation,
    diabetes: csvData.diabetes === "true" || csvData.diabetes === "1",
    hypertension: csvData.hypertension === "true" || csvData.hypertension === "1",
    heartDisease: csvData.heartDisease === "true" || csvData.heartDisease === "1",
    lungDisease: csvData.lungDisease === "true" || csvData.lungDisease === "1",
    kidneyDisease: csvData.kidneyDisease === "true" || csvData.kidneyDisease === "1",
    cancer: csvData.cancer === "true" || csvData.cancer === "1",
    immunocompromised: csvData.immunocompromised === "true" || csvData.immunocompromised === "1",
    primaryDiagnosis: csvData.primaryDiagnosis,
    lengthOfStay: csvData.lengthOfStay,
    ventilatorSupport: csvData.ventilatorSupport === "true" || csvData.ventilatorSupport === "1",
    vasopressorUse: csvData.vasopressorUse === "true" || csvData.vasopressorUse === "1",
    surgeryDuringStay: csvData.surgeryDuringStay === "true" || csvData.surgeryDuringStay === "1"
  };
};

// Analyze CSV data and provide insights
export const analyzeCSVData = (csvData: CSVPatientData[]): string[] => {
  if (!csvData || csvData.length === 0) {
    return ["No data available for analysis."];
  }

  const insights: string[] = [];
  
  // Patient demographics analysis
  const ageSum = csvData.reduce((sum, patient) => sum + (parseInt(patient.age) || 0), 0);
  const avgAge = ageSum / csvData.length;
  insights.push(`Average patient age: ${avgAge.toFixed(1)} years`);
  
  // Gender distribution
  const maleCount = csvData.filter(p => p.gender.toLowerCase() === 'male').length;
  const femaleCount = csvData.filter(p => p.gender.toLowerCase() === 'female').length;
  insights.push(`Gender distribution: ${maleCount} male patients (${(maleCount/csvData.length*100).toFixed(1)}%), ${femaleCount} female patients (${(femaleCount/csvData.length*100).toFixed(1)}%)`);
  
  // Conditions analysis
  const diabetesCount = csvData.filter(p => p.diabetes === "true" || p.diabetes === "1").length;
  const heartDiseaseCount = csvData.filter(p => p.heartDisease === "true" || p.heartDisease === "1").length;
  insights.push(`${diabetesCount} patients (${(diabetesCount/csvData.length*100).toFixed(1)}%) have diabetes`);
  insights.push(`${heartDiseaseCount} patients (${(heartDiseaseCount/csvData.length*100).toFixed(1)}%) have heart disease`);
  
  // Length of stay analysis
  const losSum = csvData.reduce((sum, patient) => sum + (parseInt(patient.lengthOfStay) || 0), 0);
  const avgLOS = losSum / csvData.length;
  insights.push(`Average length of stay: ${avgLOS.toFixed(1)} days`);
  
  // Ventilator and vasopressor usage
  const ventCount = csvData.filter(p => p.ventilatorSupport === "true" || p.ventilatorSupport === "1").length;
  const vasoCount = csvData.filter(p => p.vasopressorUse === "true" || p.vasopressorUse === "1").length;
  insights.push(`${ventCount} patients (${(ventCount/csvData.length*100).toFixed(1)}%) required ventilator support`);
  insights.push(`${vasoCount} patients (${(vasoCount/csvData.length*100).toFixed(1)}%) required vasopressors`);
  
  // Primary diagnosis distribution
  const diagnoses = csvData.reduce((acc, patient) => {
    const diagnosis = patient.primaryDiagnosis;
    acc[diagnosis] = (acc[diagnosis] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const diagnosisInsights = Object.entries(diagnoses)
    .sort((a, b) => b[1] - a[1])
    .map(([diagnosis, count]) => 
      `${diagnosis}: ${count} patients (${(count/csvData.length*100).toFixed(1)}%)`
    );
  
  insights.push("Primary diagnosis distribution:");
  insights.push(...diagnosisInsights);
  
  return insights;
};

// Sample CSV data for testing
export const getCSVSampleData = (): string => {
  return `age,gender,height,weight,heartRate,bloodPressureSystolic,bloodPressureDiastolic,respiratoryRate,temperature,oxygenSaturation,diabetes,hypertension,heartDisease,lungDisease,kidneyDisease,cancer,immunocompromised,primaryDiagnosis,lengthOfStay,ventilatorSupport,vasopressorUse,surgeryDuringStay
67,male,175,82,88,145,92,26,37.2,94,true,true,false,true,false,false,false,respiratory,9,true,false,false
72,female,162,68,92,158,94,24,37.5,92,true,true,true,false,true,false,false,cardiovascular,12,false,true,false
45,male,180,90,78,130,85,18,36.8,98,false,false,false,false,false,false,false,trauma,5,false,false,true
63,female,165,74,85,142,88,22,37.0,95,true,false,false,true,false,false,false,respiratory,7,true,false,false
55,male,178,88,76,128,82,20,36.9,97,false,true,false,false,false,false,false,sepsis,10,true,true,false`;
};

