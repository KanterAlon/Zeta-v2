import { SignUp } from '@clerk/clerk-react';
import LoginSection from '../components/LoginSection';

export default function SignUpPage() {
  return (
    <section id="signup-section" className="login-container">
      <div className="login-content">
        <button className="back-button" onClick={() => window.location.href = '/'}>
          <img src="/img/icon_back.svg" alt="Back" />
        </button>
        <div className="illustration">
          <img src="/img/img_login.svg" alt="Ilustración" />
        </div>
        <div className="welcome-message">
          <SignUp path="/sign-up" routing="path" signInUrl="/login" afterSignUpUrl="/" />
        </div>
      </div>
    </section>
  );
}
