import { useState } from 'react';
import HoloCarousel from '../components/HoloCarousel';
import { calculateQuote } from '../src/quoteEngine/quantumCalculator';

export default function Home() {
  const [quote, setQuote] = useState<number | null>(null);

  const handleQuote = () => {
    // Example inputs
    const inputs = { pages: 5, booking: true, contentProvided: false, launchDate: new Date().toISOString(), maintenance: false };
    const result = calculateQuote(inputs);
    setQuote(result.total);
  };

  return (
    <main className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">CyberQuote</h1>
        <HoloCarousel onQuote={handleQuote} />
        {quote !== null && (
          <div className="mt-6 p-4 bg-black bg-opacity-50 rounded-lg">
            <p className="text-2xl">Estimated Quote: <span className="text-cyan-400">${quote}</span></p>
          </div>
        )}
      </div>
    </main>
  );
}
