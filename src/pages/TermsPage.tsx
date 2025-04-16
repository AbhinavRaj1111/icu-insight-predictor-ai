
import MainLayout from "@/layouts/MainLayout";

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="py-10">
        <div className="medical-container">
          <h1 className="page-title">Terms & Conditions</h1>
          
          <div className="mt-8 prose prose-medical max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ICU Insight, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to use ICU Insight for healthcare decision support purposes.
            </p>
            
            <h2>3. Disclaimer</h2>
            <p>
              ICU Insight provides predictive analytics as a decision support tool only. The predictions should not replace clinical judgment. Healthcare professionals should always exercise their professional judgment when making patient care decisions.
            </p>
            
            <h2>4. Limitation of Liability</h2>
            <p>
              We shall not be held liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of ICU Insight.
            </p>
            
            <h2>5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Please review these terms periodically for changes.
            </p>
            
            <h2>6. Contact Us</h2>
            <p>
              If you have questions about these Terms & Conditions, please contact us through our Contact page.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
