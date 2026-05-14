import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Send, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import axios from 'axios';
import ClassificationCard from './components/ClassificationCard';

interface AnalysisResult {
  category: string;
  confidence: string;
  reason: string;
  suspicious_elements: string[];
  action: string;
}

function App() {
  const [smsText, setSmsText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSms = async () => {
    if (!smsText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000');
      const response = await axios.post(`${apiUrl}/classify`, {
        text: smsText
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze SMS. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSmsText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-primary/20 rounded-lg">
            <ShieldAlert className="w-8 h-8 text-accent-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            SMS <span className="gradient-text">Guard</span>
          </h1>
        </div>
        <div className="hidden md:block text-text-secondary font-medium">
          AI-Powered Fraud Detection
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-tight">
                Protect Yourself from <br />
                <span className="gradient-text">Digital Threats</span>
              </h2>
              <p className="text-text-secondary text-lg">
                Enter any SMS message below to analyze it for potential spam, fraud, or scams.
              </p>
            </div>

            <div className="relative">
              <textarea
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="Paste SMS text here..."
                rows={6}
                className="w-full text-lg"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                {smsText && (
                  <button 
                    onClick={reset}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-secondary"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={analyzeSms}
              disabled={isAnalyzing || !smsText.trim()}
              className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Message...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Run Analysis
                </>
              )}
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Visual Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex flex-col items-center justify-center h-full pt-12"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-20 blur-3xl rounded-full animate-pulse" />
              <Smartphone className="w-64 h-64 text-white/10 relative" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ShieldAlert className="w-24 h-24 text-accent-primary animate-bounce" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <div className="mt-12">
              <ClassificationCard data={result} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 text-center text-text-secondary text-sm border-t border-white/5 pt-8">
        © 2026 SMS Guard AI. Powered by Gemini 3 Flash. Built for security.
      </footer>
    </div>
  );
}

export default App;
