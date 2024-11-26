import React, { useState } from 'react';
import { Twitter, Github, Mail, Phone, Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PricingSlider = ({ onPriceChange }) => {
  const [messages, setMessages] = useState(1000);
  const [price, setPrice] = useState(29);

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setMessages(value);
    // Calculate price based on messages
    const newPrice = Math.floor(value * 0.029);
    setPrice(newPrice);
    onPriceChange(newPrice, value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Plan</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Monthly Messages: {messages.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={messages}
          onChange={handleSliderChange}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-blue-600">${price}/month</p>
        <p className="text-sm text-gray-500 mt-2">
          ${(price / messages).toFixed(3)} per message
        </p>
      </div>
    </div>
  );
};

const AuthenticationFlow = () => {
  const [authMethod, setAuthMethod] = useState(null);
  const [credentials, setCredentials] = useState({ value: '', isValid: false });
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    // Simulate API call
    setShowApiKey(true);
    setApiKey('sk-' + Math.random().toString(36).substring(2, 15));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Get Started Now
      </h2>
      
      {!authMethod ? (
        <div className="space-y-4">
          <button
            onClick={() => setAuthMethod('twitter')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Twitter className="w-5 h-5 text-blue-400" />
            <span>Continue with Twitter</span>
          </button>
          
          <button
            onClick={() => setAuthMethod('github')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>
          
          <button
            onClick={() => setAuthMethod('email')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Mail className="w-5 h-5 text-red-400" />
            <span>Continue with Email</span>
          </button>
          
          <button
            onClick={() => setAuthMethod('phone')}
            className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
          >
            <Phone className="w-5 h-5 text-green-400" />
            <span>Continue with Phone</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={authMethod === 'email' ? 'email' : 'tel'}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={authMethod === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
              onChange={(e) => setCredentials({ value: e.target.value, isValid: e.target.value.length > 0 })}
            />
          </div>
          
          <button
            type="submit"
            disabled={!credentials.isValid}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
          >
            Continue
          </button>
        </form>
      )}

      {showApiKey && (
        <div className="mt-6 space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              Your API Key has been generated. Keep it secure!
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 font-mono text-sm">{apiKey}</code>
            <button
              onClick={() => navigator.clipboard.writeText(apiKey)}
              className="p-2 hover:bg-gray-200 rounded"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1/3 h-2 rounded ${
                i <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <h1 className="text-3xl font-bold text-center">
          {step === 1 ? 'Choose Your Plan' :
           step === 2 ? 'Create Your Account' :
           'Get Your API Key'}
        </h1>
      </div>

      {step === 1 && (
        <>
          <PricingSlider onPriceChange={(price, messages) => setSelectedPlan({ price, messages })} />
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPlan}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <AuthenticationFlow />
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(3)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
          <p className="text-gray-600 mb-6">
            Your chatbot is ready to use. Start integrating it into your application
            using the API key above.
          </p>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Need help getting started? Check out our documentation and tutorials.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
