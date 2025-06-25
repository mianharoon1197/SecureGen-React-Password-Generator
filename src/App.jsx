import { useState, useCallback, useEffect, useRef } from 'react';
import { Check, Copy, ShieldCheck, Zap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [numAllowed, setNumAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);

  const passRef = useRef(null);

  const generatePassword = useCallback(() => {
    let base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+';
    let chars = base;

    if (numAllowed) chars += numbers;
    if (charAllowed) chars += symbols;

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(pass);
  }, [length, numAllowed, charAllowed]);

  const copyToClipboard = useCallback(() => {
    passRef.current?.select();
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [length, numAllowed, charAllowed, generatePassword]);

  const getStrengthLabel = () => {
  let score = 0;
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (numAllowed) score++;
  if (charAllowed) score++;

  if (score <= 1) return 'Weak';
  if (score === 2 || score === 3) return 'Moderate';
  return 'Strong';
};

const getStrengthColor = () => {
  const label = getStrengthLabel();
  if (label === 'Weak') return 'bg-red-500';
  if (label === 'Moderate') return 'bg-yellow-500';
  return 'bg-green-500';
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141e30] to-[#243b55] p-6 text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-lg bg-gray-900 rounded-3xl shadow-[0_0_40px_#00000066] p-8 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 blur-2xl opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>

        <h1 className="text-4xl font-black text-center mb-6 tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-green-400" /> SecureGen
        </h1>

        <div className="flex items-center mb-5 rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
          <input
            type="text"
            value={password}
            readOnly
            ref={passRef}
            className="flex-1 px-4 py-3 bg-transparent outline-none text-lg font-mono tracking-wide"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <Copy size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Password Length: <span className="font-bold text-indigo-400">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="numbers"
              checked={numAllowed}
              onChange={() => setNumAllowed((prev) => !prev)}
              className="accent-indigo-500 w-5 h-5"
            />
            <label htmlFor="numbers" className="text-sm">Include Numbers</label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="symbols"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
              className="accent-indigo-500 w-5 h-5"
            />
            <label htmlFor="symbols" className="text-sm">Include Symbols</label>
          </div>

          <button
            onClick={generatePassword}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white py-3 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.03] transition-transform"
          >
            <Zap className="w-5 h-5" /> Generate New Password
          </button>

          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">Strength:</label>
            <div className="w-full h-3 rounded-lg bg-gray-700 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${getStrengthColor()}`} style={{ width: `${(length / 32) * 100}%` }}></div>
            </div>
            <div className="text-xs mt-1 text-right text-gray-400 italic">{getStrengthLabel()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
