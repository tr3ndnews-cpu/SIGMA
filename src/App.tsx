import { SettingsProvider } from './context/SettingsContext';
import { WizardProvider, useWizard } from './context/WizardContext';
import { Header } from './components/Header';
import { Step1Identity } from './components/Step1_Identity';
import { Step2Config } from './components/Step2_Config';
import { Step3Capaian } from './components/Step3_Capaian';
import { Step4TPATP } from './components/Step4_TPATP';
import { Step5KKTP } from './components/Step5_KKTP';
import { Step6RPP } from './components/Step6_RPP';

function WizardFlow() {
  const { step } = useWizard();
  
  return (
    <div className="container mx-auto p-4 md:p-6 pb-20">
      {step === 1 && <Step1Identity />}
      {step === 2 && <Step2Config />}
      {step === 3 && <Step3Capaian />}
      {step === 4 && <Step4TPATP />}
      {step === 5 && <Step5KKTP />}
      {step === 6 && <Step6RPP />}
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {[1, 2, 3, 4, 5, 6].map(i => {
          const colors = ['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-green-500'];
          const fadedColors = ['bg-blue-200', 'bg-orange-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200', 'bg-green-200'];
          return (
            <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === step ? colors[i-1] : (i < step ? fadedColors[i-1] : 'bg-gray-300')}`} />
          )
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <WizardProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans text-gray-900">
          <Header />
          <WizardFlow />
        </div>
      </WizardProvider>
    </SettingsProvider>
  );
}
