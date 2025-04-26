import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { usePatientData, PatientData } from "@/contexts/PatientDataContext";
import { parseCSV, convertToTypedPatientData, analyzeCSVData } from "@/utils/csvParser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileCheck } from "lucide-react";

const formSchema = z.object({
  age: z.string().min(1, { message: "Age is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  heartRate: z.string().min(1, { message: "Heart rate is required" }),
  bloodPressureSystolic: z.string().min(1, { message: "Systolic BP is required" }),
  bloodPressureDiastolic: z.string().min(1, { message: "Diastolic BP is required" }),
  respiratoryRate: z.string().min(1, { message: "Respiratory rate is required" }),
  temperature: z.string().min(1, { message: "Temperature is required" }),
  oxygenSaturation: z.string().min(1, { message: "Oxygen saturation is required" }),
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  heartDisease: z.boolean().default(false),
  lungDisease: z.boolean().default(false),
  kidneyDisease: z.boolean().default(false),
  cancer: z.boolean().default(false),
  immunocompromised: z.boolean().default(false),
  primaryDiagnosis: z.string().min(1, { message: "Primary diagnosis is required" }),
  lengthOfStay: z.string().min(1, { message: "Length of stay is required" }),
  ventilatorSupport: z.boolean().default(false),
  vasopressorUse: z.boolean().default(false),
  surgeryDuringStay: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [csvAnalysis, setCsvAnalysis] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPatientData, generatePrediction } = usePatientData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      heartRate: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      respiratoryRate: "",
      temperature: "",
      oxygenSaturation: "",
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      lungDisease: false,
      kidneyDisease: false,
      cancer: false,
      immunocompromised: false,
      primaryDiagnosis: "",
      lengthOfStay: "",
      ventilatorSupport: false,
      vasopressorUse: false,
      surgeryDuringStay: false,
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if it's a CSV file
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a CSV file.",
        });
        return;
      }

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded. Processing data...`,
      });
      
      setIsLoading(true);
      
      // Read the file content
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (event.target?.result) {
            // Parse CSV data
            const csvContent = event.target.result as string;
            const parsedData = parseCSV(csvContent);
            
            if (parsedData.length === 0) {
              throw new Error("No data found in the CSV file.");
            }
            
            // Convert to typed data and generate analysis
            const typedData = convertToTypedPatientData(parsedData);
            const analysis = analyzeCSVData(typedData);
            setCsvAnalysis(analysis);
            
            // Use the first row of data to create a PatientData object
            const firstPatient = typedData[0];
            
            const patientData: PatientData = {
              id: firstPatient.patient_id || `patient-${Date.now()}`,
              age: firstPatient.age,
              gender: firstPatient.gender,
              lengthOfStay: firstPatient.length_of_stay,
              primaryDiagnosis: firstPatient.primary_diagnosis,
              diabetes: firstPatient.diabetes,
              hypertension: firstPatient.hypertension,
              heartDisease: firstPatient.heart_disease,
              lungDisease: firstPatient.lung_disease,
              renalDisease: firstPatient.renal_disease,
              ventilatorSupport: firstPatient.ventilator_support,
              vasopressors: firstPatient.vasopressors,
              dialysis: firstPatient.dialysis,
              previousICUAdmission: firstPatient.previous_icu_admission
            };
            
            // Set form values
            form.setValue("age", patientData.age.toString());
            form.setValue("gender", patientData.gender.toLowerCase());
            form.setValue("primaryDiagnosis", patientData.primaryDiagnosis);
            form.setValue("lengthOfStay", patientData.lengthOfStay.toString());
            form.setValue("diabetes", patientData.diabetes);
            form.setValue("hypertension", patientData.hypertension);
            form.setValue("heartDisease", patientData.heartDisease);
            form.setValue("lungDisease", patientData.lungDisease);
            form.setValue("ventilatorSupport", patientData.ventilatorSupport);
            form.setValue("vasopressorUse", patientData.vasopressors);
            
            // Set patient data and generate prediction
            setPatientData(patientData);
            if (generatePrediction) {
              generatePrediction(patientData);
            }
            
            setFileUploaded(true);
            
            toast({
              title: "Success",
              description: "Patient data processed successfully. You can now view the analysis or proceed to results.",
            });
          }
        } catch (error) {
          console.error("CSV parsing error:", error);
          toast({
            variant: "destructive",
            title: "Error processing CSV",
            description: "The CSV file format is invalid or missing required fields.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read the file.",
        });
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    }
  };

  const handleViewResults = () => {
    navigate("/predictions");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Create a PatientData object from form values
      const patientData: PatientData = {
        id: `patient-${Date.now()}`,
        age: parseInt(values.age),
        gender: values.gender,
        height: parseInt(values.height),
        weight: parseInt(values.weight),
        heartRate: parseInt(values.heartRate),
        bloodPressureSystolic: parseInt(values.bloodPressureSystolic),
        bloodPressureDiastolic: parseInt(values.bloodPressureDiastolic),
        respiratoryRate: parseInt(values.respiratoryRate),
        temperature: parseFloat(values.temperature),
        oxygenSaturation: parseInt(values.oxygenSaturation),
        diabetes: values.diabetes,
        hypertension: values.hypertension,
        heartDisease: values.heartDisease,
        lungDisease: values.lungDisease,
        kidneyDisease: values.kidneyDisease,
        cancer: values.cancer,
        immunocompromised: values.immunocompromised,
        primaryDiagnosis: values.primaryDiagnosis,
        lengthOfStay: parseInt(values.lengthOfStay),
        ventilatorSupport: values.ventilatorSupport,
        vasopressorUse: values.vasopressorUse,
        surgeryDuringStay: values.surgeryDuringStay,
        renalDisease: values.kidneyDisease,  // Map kidney disease to renal disease
        vasopressors: values.vasopressorUse, // Map vasopressor use to vasopressors
        previousICUAdmission: false, // Default value since not in the form
        dialysis: false // Add missing dialysis property with default value
      };
      
      // Set the form data to context
      setPatientData(patientData);
      
      // Generate prediction based on input data
      if (generatePrediction) {
        generatePrediction(patientData);
      }
      
      toast({
        title: "Success",
        description: "Patient data submitted successfully. Redirecting to results...",
      });
      
      // Redirect to the prediction results page
      navigate("/predictions");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Upload Patient Data File</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">Upload a CSV file with patient data</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Select File"}
          </Button>
        </div>
        
        {fileUploaded && csvAnalysis.length > 0 && (
          <div className="mt-4">
            <Alert className="bg-green-50 border-green-200">
              <FileCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">CSV File Processed Successfully</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <p className="font-semibold mb-2">CSV Analysis Results:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {csvAnalysis.slice(0, 5).map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                    {csvAnalysis.length > 5 && (
                      <li className="text-medical-600 font-medium">
                        ...and {csvAnalysis.length - 5} more insights available
                      </li>
                    )}
                  </ul>
                  <div className="mt-3">
                    <Button onClick={handleViewResults} className="w-full">
                      View Prediction Results
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Enter Patient Data Manually</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Demographics</h4>
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Age in years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Height in cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Weight in kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Vital Signs</h4>
                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Heart rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Systolic BP (mmHg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Systolic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodPressureDiastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diastolic BP (mmHg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Diastolic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="respiratoryRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respiratory Rate (bpm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Respiratory rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="Temperature" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oxygenSaturation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oxygen Saturation (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="SpO2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Medical History</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="diabetes"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Diabetes</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hypertension"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Hypertension</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heartDisease"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Heart Disease</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lungDisease"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lung Disease</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kidneyDisease"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kidney Disease</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cancer"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cancer</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="immunocompromised"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Immunocompromised</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Current ICU Stay</h4>
              <FormField
                control={form.control}
                name="primaryDiagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Diagnosis</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary diagnosis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="respiratory">Respiratory Failure</SelectItem>
                        <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="sepsis">Sepsis</SelectItem>
                        <SelectItem value="neurological">Neurological</SelectItem>
                        <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                        <SelectItem value="trauma">Trauma</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lengthOfStay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length of Stay (days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Days in ICU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ventilatorSupport"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ventilator Support</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vasopressorUse"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Vasopressor Use</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surgeryDuringStay"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Surgery During Stay</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Generate Prediction"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PatientForm;
