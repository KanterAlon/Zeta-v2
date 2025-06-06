import { useState } from 'react';
import LoginSection from '../components/LoginSection';
import Ca1Section from '../components/Ca1Section';
import Ca2Section from '../components/Ca2Section';
// import Ca3Section from '../components/Ca3Section';

export default function Login() {
  const [step, setStep] = useState('login');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    altura: '',
    peso: '',
  });

  const updateForm = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <>
      {step === 'login' && <LoginSection goTo={setStep} />}
      {step === 'ca1' && <Ca1Section goTo={setStep} updateForm={updateForm} />}
      {step === 'ca2' && <Ca2Section goTo={setStep} updateForm={updateForm} formData={formData} />}


      {/* {step === 'ca3' && <Ca3Section goTo={setStep} formData={formData} />} */}
    </>
  );
}
