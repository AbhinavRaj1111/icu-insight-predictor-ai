
import { DatabaseZap, Share2, BarChart2, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Advanced ML Model",
    description:
      "Our AI algorithm is trained on extensive medical datasets to provide highly accurate readmission predictions.",
    icon: DatabaseZap,
  },
  {
    name: "Data Visualization",
    description:
      "Intuitive charts and graphs help you visualize prediction results and patient risk factors.",
    icon: BarChart2,
  },
  {
    name: "Secure & Compliant",
    description:
      "All data handling is HIPAA compliant with enterprise-grade security measures to protect patient information.",
    icon: ShieldCheck,
  },
  {
    name: "Seamless Integration",
    description:
      "Easily integrate with existing hospital systems through our API or CSV/Excel file uploads.",
    icon: Share2,
  },
];

const FeatureSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-medical-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to predict ICU readmissions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our AI-powered platform helps healthcare professionals make data-driven decisions to improve patient outcomes
            and optimize resource allocation.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-medical-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
