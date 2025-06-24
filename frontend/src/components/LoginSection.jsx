import { SignIn } from '@clerk/clerk-react';

export default function LoginSection() {
  return (
    <section id="login-section" className="login-container">
      <div className="login-content">
        <div className="illustration">
          <img src="/img/img_login.svg" alt="Ilustración" />
        </div>
        <div className="welcome-message">
          <SignIn path="/login" routing="path" signUpUrl="/sign-up" afterSignInUrl="/" />
        </div>
      </div>
    </section>
  );
}
