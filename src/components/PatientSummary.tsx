
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface VitalSign {
  name: string;
  value: string;
  unit: string;
  normal: boolean;
}

interface MedicalHistory {
  condition: string;
  present: boolean;
}

interface PatientSummaryProps {
  name: string;
  age: number;
  gender: string;
  vitalSigns: VitalSign[];
  medicalHistory: MedicalHistory[];
  primaryDiagnosis: string;
  lengthOfStay: number;
  ventilatorSupport: boolean;
  vasopressorUse: boolean;
  surgeryDuringStay: boolean;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({
  name,
  age,
  gender,
  vitalSigns,
  medicalHistory,
  primaryDiagnosis,
  lengthOfStay,
  ventilatorSupport,
  vasopressorUse,
  surgeryDuringStay,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Summary</CardTitle>
        <CardDescription>Overview of patient information used for prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Demographics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{gender}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vital Signs */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Vital Signs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {vitalSigns.map((vital, index) => (
                <div key={index}>
                  <p className="text-sm text-gray-500">{vital.name}</p>
                  <p className={`font-medium ${vital.normal ? "text-gray-900" : "text-red-600"}`}>
                    {vital.value} {vital.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Medical History */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Medical History</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {medicalHistory.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      condition.present ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  <p className="text-sm">{condition.condition}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Current ICU Stay */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current ICU Stay</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Primary Diagnosis</p>
                <p className="font-medium">{primaryDiagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Length of Stay</p>
                <p className="font-medium">{lengthOfStay} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventilator Support</p>
                <p className="font-medium">{ventilatorSupport ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vasopressor Use</p>
                <p className="font-medium">{vasopressorUse ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Surgery During Stay</p>
                <p className="font-medium">{surgeryDuringStay ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientSummary;
