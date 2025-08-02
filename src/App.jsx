import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

const steps = [
  { key: 'pages', question: 'How many pages do you need?' },
  { key: 'booking', question: 'Need booking/scheduling? (yes/no)' },
  { key: 'content', question: 'Provide your own content? (yes/no)' },
  { key: 'launch', question: 'Desired launch date? (YYYY-MM-DD)' },
  { key: 'maintenance', question: 'Include maintenance? (yes/no)' }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState('');
  const chatEnd = useRef(null);

  // On mount: show welcome + first question
  useEffect(() => {
    addMessage('bot', 'Welcome to Quote4You! I will help you get a quote.');
    addMessage('bot', steps[0].question);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addMessage(sender, text) {
    setMessages(msgs => [...msgs, { sender, text }]);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    // Echo user
    addMessage('user', text);

    // Store answer
    const key = steps[step].key;
    setAnswers(prev => ({ ...prev, [key]: text }));
    setInput('');

    const nextStep = step + 1;
    if (nextStep < steps.length) {
      // Ask next
      setStep(nextStep);
      addMessage('bot', steps[nextStep].question);
    } else {
      // Calculate on final
      setStep(nextStep);
      calculateQuote();
    }
  }

  function calculateQuote() {
    const pages = parseInt(answers.pages) || 1;
    let total = pages === 1 ? 200 : 200 + (pages - 1) * 75;
    if (String(answers.booking).toLowerCase() === 'yes') total += 100;
    if (String(answers.content).toLowerCase() === 'yes') total -= 75;

    const diff = Math.ceil(
      (new Date(answers.launch) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (!isNaN(diff) && diff < 14) total += 100;

    const parts = [];
    parts.push(`${pages} pages`);
    if (String(answers.booking).toLowerCase() === 'yes') parts.push('booking');
    if (String(answers.content).toLowerCase() === 'no') parts.push('content creation');
    if (!isNaN(diff) && diff < 14) parts.push('rush');
    if (String(answers.maintenance).toLowerCase() === 'yes') parts.push('maintenance');

    const response = `Your quote: $${total}. (${parts.join(', ')})`;
    addMessage('bot', response);

    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black bg-opacity-50 rounded-xl shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              m.sender === 'bot'
                ? 'bg-white bg-opacity-10 self-start'
                : 'bg-white bg-opacity-20 self-end'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={chatEnd} />
      </div>
      <div className="flex border-t border-white border-opacity-20">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Type your answer..."
        />
        <button
          onClick={handleSend}
          className="px-4 bg-cyan-400 text-gray-900 font-bold hover:bg-cyan-300 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
