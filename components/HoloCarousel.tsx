import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  onQuote: () => void;
}

export default function HoloCarousel({ onQuote }: Props) {
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Select Service', content: 'Service icons here' },
    { label: 'Customize Specs', content: 'Sliders and toggles here' },
    { label: 'Add-Ons & Discounts', content: 'Drag modules here' },
    { label: 'Review & Get Quote', content: 'Click to get quote' },
  ];

  const next = () => setStep((prev) => (prev + 1) % steps.length);
  const quote = () => onQuote();

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl">{steps[step].label}</h2>
          <div className="mt-4">{steps[step].content}</div>
        </motion.div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={next} className="px-4 py-2 bg-cyan-600 rounded-lg">Next</button>
        {step === steps.length - 1 && (
          <button onClick={quote} className="px-4 py-2 bg-green-500 rounded-lg">Get Quote</button>
        )}
      </div>
    </div>
}
