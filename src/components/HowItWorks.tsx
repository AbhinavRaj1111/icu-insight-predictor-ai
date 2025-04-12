
import { FileText, Cpu, BarChart2, CheckCircle } from "lucide-react";

const steps = [
  {
    name: "Input Patient Data",
    description:
      "Enter patient demographics, medical history, lab results, and vitals either manually or by uploading files.",
    icon: FileText,
  },
  {
    name: "AI Analysis",
    description:
      "Our advanced machine learning algorithm processes the data, identifying patterns and risk factors.",
    icon: Cpu,
  },
  {
    name: "Risk Assessment",
    description:
      "The system generates a comprehensive risk assessment with probability scores and confidence intervals.",
    icon: BarChart2,
  },
  {
    name: "Clinical Decision Support",
    description:
      "Use the insights to inform clinical decisions, resource allocation, and individualized care plans.",
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How Our AI Prediction Works
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Our system uses state-of-the-art machine learning to predict ICU readmission risk with high accuracy.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <dl className="mt-10 space-y-10">
              {steps.slice(0, 2).map((step) => (
                <div key={step.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-medical-500 text-white">
                      <step.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{step.name}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{step.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <img
              className="relative mx-auto rounded-lg shadow-lg"
              width={490}
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt="Medical data analysis"
            />
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <dl className="mt-10 space-y-10">
                {steps.slice(2, 4).map((step) => (
                  <div key={step.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-medical-500 text-white">
                        <step.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{step.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{step.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
              <img
                className="relative mx-auto rounded-lg shadow-lg"
                width={490}
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Healthcare analytics dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
