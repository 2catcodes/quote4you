import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    addMessage('bot', 'Welcome to Quote4You! I will help you get a quote.');
    setTimeout(ask, 500);
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addMessage(sender, text) {
    setMessages(msgs => [...msgs, { sender, text }]);
  }

  function ask() {
    if (step < steps.length) {
      addMessage('bot', steps[step].question);
    } else {
      calculate();
    }
  }

  function calculate() {
    const pages = parseInt(answers.pages) || 1;
    let total = pages === 1 ? 200 : 200 + (pages - 1) * 75;
    if (answers.booking?.toLowerCase() === 'yes') total += 100;
    if (answers.content?.toLowerCase() === 'yes') total -= 75;
    const diff = Math.ceil((new Date(answers.launch) - new Date()) / (1000 * 60 * 60 * 24));
    if (!isNaN(diff) && diff < 14) total += 100;
    const resp = `Your quote: $${total}. (${pages} pages${answers.booking==='yes'?', booking':''}${answers.content==='no'?', content creation':''}${diff<14?', rush':''}${answers.maintenance==='yes'?', maintenance':''})`;
    addMessage('bot', resp);
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
  }

  function handleSend() {
    if (!input.trim()) return;
    addMessage('user', input);
    setAnswers(a => ({ ...a, [steps[step].key]: input.trim() }));
    setInput('');
    setStep(s => s + 1);
    setTimeout(ask, 500);
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black bg-opacity-50 rounded-xl shadow-lg overflow-hidden max-w-md">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.sender==='bot'?'bg-white bg-opacity-10 self-start':'bg-white bg-opacity-20 self-end'}`}>
            {m.text}
          </div>
        ))}
        <div ref={chatEnd} />
      </div>
      <div className="flex border-t border-white border-opacity-20">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          placeholder="Type..."
        />
        <button onClick={handleSend} className="px-4 bg-cyan-400 text-gray-900 font-bold hover:bg-cyan-300 transition">
          Send
        </button>
      </div>
    </div>
  );
}
