
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, FileText, Bell, Calendar } from "lucide-react";

interface RecommendationProps {
  riskLevel: "high" | "moderate" | "low";
}

const RecommendationSection: React.FC<RecommendationProps> = ({ riskLevel }) => {
  // Recommendations based on risk level
  const getRecommendations = () => {
    if (riskLevel === "high") {
      return [
        {
          title: "Extended Monitoring",
          description: "Extend monitoring period post-discharge by 72 hours",
          icon: Bell,
        },
        {
          title: "Follow-up Schedule",
          description: "Schedule follow-up within 48 hours of discharge",
          icon: Calendar,
        },
        {
          title: "Detailed Discharge Plan",
          description: "Create comprehensive discharge plan with specific care instructions",
          icon: FileText,
        },
        {
          title: "Care Coordination",
          description: "Coordinate with primary care and specialists for continuity of care",
          icon: CheckCircle,
        },
      ];
    } else if (riskLevel === "moderate") {
      return [
        {
          title: "Standard Monitoring",
          description: "Regular monitoring for 48 hours post-discharge",
          icon: Bell,
        },
        {
          title: "Follow-up Schedule",
          description: "Schedule follow-up within one week of discharge",
          icon: Calendar,
        },
        {
          title: "Discharge Instructions",
          description: "Provide clear discharge instructions with warning signs",
          icon: FileText,
        },
        {
          title: "Risk Factor Management",
          description: "Focus on managing identified risk factors",
          icon: AlertCircle,
        },
      ];
    } else {
      return [
        {
          title: "Standard Follow-up",
          description: "Regular follow-up as per standard protocol",
          icon: Calendar,
        },
        {
          title: "Discharge Instructions",
          description: "Standard discharge instructions for self-monitoring",
          icon: FileText,
        },
        {
          title: "Preventive Measures",
          description: "Reinforce preventive measures and healthy lifestyle",
          icon: CheckCircle,
        },
        {
          title: "Resource Access",
          description: "Ensure patient has access to necessary resources",
          icon: Bell,
        },
      ];
    }
  };

  const recommendations = getRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Recommendations</CardTitle>
        <CardDescription>
          AI-suggested interventions based on the patient's risk profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <rec.icon className="h-5 w-5 text-medical-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationSection;
