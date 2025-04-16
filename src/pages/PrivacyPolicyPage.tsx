
import MainLayout from "@/layouts/MainLayout";

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <div className="py-10">
        <div className="medical-container">
          <h1 className="page-title">Privacy Policy</h1>
          
          <div className="mt-8 prose prose-medical max-w-none">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy outlines how ICU Insight ("we", "our", or "us") collects, uses, and protects your information when you use our AI-driven ICU readmission prediction service.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We collect patient data entered into our system for the purpose of generating ICU readmission predictions. This data may include demographics, vital signs, medical history, and current ICU stay information.
            </p>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              The information collected is used solely for the purpose of:
            </p>
            <ul>
              <li>Generating accurate ICU readmission predictions</li>
              <li>Improving our predictive algorithms</li>
              <li>Providing clinical recommendations based on prediction results</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We implement robust security measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2>5. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through our Contact page.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
