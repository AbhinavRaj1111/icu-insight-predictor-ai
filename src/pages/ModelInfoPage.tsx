
import MainLayout from "@/layouts/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Database, 
  Cpu, 
  BarChart2, 
  LineChart 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ModelInfoPage = () => {
  return (
    <MainLayout>
      <div className="py-10">
        <header className="medical-container">
          <h1 className="page-title">Model Information</h1>
          <p className="page-subtitle">
            Technical details about our AI/ML model for ICU readmission prediction
          </p>
        </header>

        <main className="medical-container mt-8 space-y-10">
          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-medical-600" />
                Model Overview
              </CardTitle>
              <CardDescription>Key information about the AI prediction model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Model Architecture</h3>
                  <p className="text-gray-600 mb-4">
                    Our ICU readmission prediction model uses a gradient-boosted decision tree algorithm
                    (XGBoost) combined with deep learning components for feature extraction from
                    time-series data.
                  </p>
                  <h3 className="text-lg font-medium mb-2">Performance Metrics</h3>
                  <p className="text-gray-600">
                    The model achieves 94% accuracy, 92% sensitivity, and 95% specificity on our test dataset,
                    with an AUROC of 0.96 and F1 score of 0.93.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Real-time risk assessment based on 75+ clinical variables</li>
                    <li>Personalized recommendations based on individual risk factors</li>
                    <li>Regular model updates with new clinical data</li>
                    <li>Interpretable results with key factor identification</li>
                    <li>HIPAA-compliant data processing and storage</li>
                  </ul>
                  <div className="flex space-x-2 mt-4">
                    <Button className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download Whitepaper
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Technical Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Data Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-medical-600" />
                Training Data
              </CardTitle>
              <CardDescription>Information about the data used to train the model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our model was trained on a comprehensive dataset of over 250,000 ICU stays from 35 hospitals
                across North America and Europe, collected between 2015 and 2023.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Dataset Characteristics</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Characteristic</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total ICU Stays</TableCell>
                        <TableCell>251,428</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Readmission Rate</TableCell>
                        <TableCell>12.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Age Range</TableCell>
                        <TableCell>18-95 years</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gender Distribution</TableCell>
                        <TableCell>54.2% Male, 45.8% Female</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Time Period</TableCell>
                        <TableCell>2015-2023</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Sources</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>MIMIC-IV critical care database</li>
                    <li>eICU Collaborative Research Database</li>
                    <li>AmsterdamUMCdb</li>
                    <li>HiRID (High Time Resolution ICU Dataset)</li>
                    <li>Proprietary data from partner institutions</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Data Privacy</h3>
                  <p className="text-gray-600">
                    All training data was de-identified and anonymized in compliance with HIPAA and GDPR
                    regulations. The model does not store individual patient data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-medical-600" />
                Algorithm Details
              </CardTitle>
              <CardDescription>Technical specifications of the prediction algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Model Architecture</h3>
                  <p className="text-gray-600">
                    The core prediction model uses an ensemble approach combining:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
                    <li>XGBoost for structured clinical data</li>
                    <li>Recurrent Neural Networks (GRU) for temporal sequences</li>
                    <li>Transformer architecture for laboratory time series</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Feature Engineering</h3>
                    <p className="text-gray-600 mb-2">
                      The model incorporates 75+ clinical features across several categories:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Demographics (age, gender, BMI)</li>
                      <li>Vital signs and their trends over time</li>
                      <li>Laboratory values and their trajectories</li>
                      <li>Medications and interventions</li>
                      <li>Comorbidities and medical history</li>
                      <li>ICU treatment details (ventilation, vasopressors)</li>
                      <li>Length of stay and discharge status</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Model Validation</h3>
                    <p className="text-gray-600 mb-2">
                      Our validation strategy includes:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>10-fold cross-validation</li>
                      <li>External validation on independent hospital data</li>
                      <li>Temporal validation (testing on future data)</li>
                      <li>Regular recalibration and performance monitoring</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium mt-4 mb-2">Explainability</h3>
                    <p className="text-gray-600">
                      We use SHAP (SHapley Additive exPlanations) values to interpret model predictions and
                      identify the most influential features for each patient's risk assessment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-medical-600" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Detailed evaluation metrics for the prediction model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Overall Performance</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>95% CI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>94.2%</TableCell>
                        <TableCell>93.1-95.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sensitivity</TableCell>
                        <TableCell>92.1%</TableCell>
                        <TableCell>90.4-93.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Specificity</TableCell>
                        <TableCell>95.3%</TableCell>
                        <TableCell>94.2-96.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PPV</TableCell>
                        <TableCell>87.5%</TableCell>
                        <TableCell>85.8-89.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NPV</TableCell>
                        <TableCell>97.2%</TableCell>
                        <TableCell>96.5-97.9%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>AUROC</TableCell>
                        <TableCell>0.96</TableCell>
                        <TableCell>0.95-0.97</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>F1 Score</TableCell>
                        <TableCell>0.93</TableCell>
                        <TableCell>0.91-0.95</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Performance by Subgroup</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Subgroup</TableHead>
                        <TableHead>AUROC</TableHead>
                        <TableHead>Sensitivity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Age 18-40</TableCell>
                        <TableCell>0.94</TableCell>
                        <TableCell>91.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Age 41-65</TableCell>
                        <TableCell>0.95</TableCell>
                        <TableCell>92.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Age 65+</TableCell>
                        <TableCell>0.96</TableCell>
                        <TableCell>93.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cardiovascular</TableCell>
                        <TableCell>0.97</TableCell>
                        <TableCell>94.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Respiratory</TableCell>
                        <TableCell>0.96</TableCell>
                        <TableCell>92.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sepsis</TableCell>
                        <TableCell>0.95</TableCell>
                        <TableCell>91.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Trauma</TableCell>
                        <TableCell>0.94</TableCell>
                        <TableCell>90.3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4 pt-2">
                    <p className="text-sm text-gray-500">
                      Performance metrics were last updated on April 1, 2024, based on validation across 5 independent hospital systems.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </MainLayout>
  );
};

export default ModelInfoPage;
