
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface PredictionResultProps {
  risk: number; // 0-100
  confidence: number; // 0-100
  predictedOutcome: "High Risk" | "Moderate Risk" | "Low Risk";
  keyFactors: string[];
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  risk,
  confidence,
  predictedOutcome,
  keyFactors,
}) => {
  // Data for the pie chart
  const data = [
    { name: "Risk", value: risk },
    { name: "No Risk", value: 100 - risk },
  ];

  // Colors based on risk level
  const getRiskColor = () => {
    if (risk >= 70) return "text-red-600";
    if (risk >= 30) return "text-amber-500";
    return "text-green-600";
  };

  const getPieColors = () => {
    if (risk >= 70) return ["#ef4444", "#f1f5f9"];
    if (risk >= 30) return ["#f59e0b", "#f1f5f9"];
    return ["#10b981", "#f1f5f9"];
  };

  const getRiskBadge = () => {
    if (risk >= 70)
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-3 py-1 text-sm">High Risk</Badge>
      );
    if (risk >= 30)
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 px-3 py-1 text-sm">
          Moderate Risk
        </Badge>
      );
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">Low Risk</Badge>
    );
  };

  const getAlertIcon = () => {
    if (risk >= 70) return AlertCircle;
    if (risk >= 30) return AlertTriangle;
    return CheckCircle;
  };

  const getAlertVariant = () => {
    if (risk >= 70) return "destructive";
    if (risk >= 30) return "default";
    return "default";
  };

  const AlertIcon = getAlertIcon();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Readmission Prediction</CardTitle>
              <CardDescription>AI-generated prediction based on patient data</CardDescription>
            </div>
            {getRiskBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Risk Assessment</h3>
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPieColors()[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className={`text-2xl font-bold ${getRiskColor()}`}>{risk}%</p>
              <p className="text-sm text-gray-500">Risk of readmission</p>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Prediction Confidence</span>
                  <span className="text-sm font-medium text-gray-700">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" />
              </div>

              <Alert variant={getAlertVariant()}>
                <AlertIcon className="h-4 w-4" />
                <AlertTitle>{predictedOutcome}</AlertTitle>
                <AlertDescription>
                  {risk >= 70
                    ? "Patient has a high likelihood of ICU readmission. Consider extended monitoring."
                    : risk >= 30
                    ? "Patient has a moderate risk of readmission. Regular follow-up recommended."
                    : "Patient has a low risk of ICU readmission."}
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Key Risk Factors</h3>
              <ul className="space-y-2">
                {keyFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white bg-medical-500 rounded-full">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
