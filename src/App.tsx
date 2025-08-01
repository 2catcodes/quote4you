import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const steps = [
  { key: 'pages', question: 'How many pages do you need for your website?' },
  { key: 'booking', question: 'Do you need booking/scheduling functionality? (yes/no)' },
  { key: 'content', question: 'Will you provide all content (text/images)? (yes/no)' },
  { key: 'launchDate', question: 'What is your desired launch date? (YYYY-MM-DD)' },
  { key: 'maintenance', question: 'Do you want ongoing maintenance? (yes/no)' }
];

function App() {
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function addMessage(sender: 'bot' | 'user', text: string) {
    setMessages((prev) => [...prev, { sender, text }]);
  }

  function startChat() {
    addMessage('bot', 'Welcome to Quote4You! I will help you get a custom website quote.');
    setTimeout(askQuestion, 500);
  }

  function askQuestion() {
    if (step < steps.length) {
      addMessage('bot', steps[step].question);
    } else {
      computeQuote();
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    addMessage('user', input);
    setAnswers((prev) => ({ ...prev, [steps[step].key]: input.trim() }));
    setInput('');
    setStep((prev) => prev + 1);
    setTimeout(askQuestion, 500);
  }

  function computeQuote() {
    const pages = parseInt(answers.pages) || 1;
    let cost = pages === 1 ? 200 : 200 + (pages - 1) * 75;
    if (answers.booking.toLowerCase() === 'yes') cost += 100;
    if (answers.content.toLowerCase() === 'yes') cost -= 75;
    const launch = new Date(answers.launchDate);
    const diffDays = Math.ceil((launch.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (!isNaN(diffDays) && diffDays < 14) cost += 100;

    let response = \`Great! Based on your requirements: a \${pages}-page site\`;
    if (answers.booking.toLowerCase() === 'yes') response += ', booking feature';
    if (answers.content.toLowerCase() === 'no') response += ', content creation by us';
    if (diffDays < 14) response += ', rush service';
    if (answers.maintenance.toLowerCase() === 'yes') response += ', and maintenance plan';
    response += \`. Your customized quote is $\${cost}. Thank you!\`;

    addMessage('bot', response);
    launchConfetti();
  }

  function launchConfetti() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 to-blue-900">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`max-w-[80%] my-2 p-3 rounded-lg \${msg.sender === 'bot'
              ? 'bg-blue-800 text-white self-start'
              : 'bg-white text-gray-900 self-end'}\`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex p-4 bg-blue-900">
        <input
          className="flex-1 p-3 rounded-l-lg outline-none text-white bg-transparent placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
        />
        <button
          className="px-4 font-bold text-blue-900 bg-cyan-400 rounded-r-lg hover:bg-cyan-300 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
