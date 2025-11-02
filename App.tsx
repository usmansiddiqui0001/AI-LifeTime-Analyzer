import React, { useState, useCallback } from 'react';
import { generateLifeReport } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ReportDisplay } from './components/ReportDisplay';
import { Loader } from './components/Loader';
import { UserInput } from './types';

// Perform a single, upfront check for the API key.
const IS_API_KEY_CONFIGURED = process.env.API_KEY && process.env.API_KEY.length > 0;

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    name: '',
    day: '',
    month: '',
    year: '',
    country: 'India',
  });
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    if (!userInput.name || !userInput.day || !userInput.month || !userInput.year || !userInput.country) {
      setError('Please fill in all the fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const generatedReport = await generateLifeReport(userInput);
      setReport(generatedReport);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while generating the report. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);
  
  // If the API key is not configured, show a dedicated configuration screen.
  // This prevents the user from attempting to use a non-functional application.
  if (!IS_API_KEY_CONFIGURED) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-sm border border-yellow-700 text-yellow-300 p-8 rounded-2xl text-center space-y-6 shadow-2xl shadow-yellow-500/10">
          <div className="flex justify-center items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-3xl font-bold text-yellow-200">Configuration Required</h1>
          </div>
          <p className="text-lg text-yellow-300">
            The AI LifeTime Analyzer requires an API Key to function, but it has not been configured.
          </p>
          <div className="text-left bg-gray-900 p-4 rounded-lg text-gray-400 text-sm">
            <p className="font-semibold text-yellow-400">What does this mean?</p>
            <p className="mt-2">For security, the API Key must be set as an environment variable (often called a 'secret') in the deployment settings of this application. It cannot be entered directly into the app.</p>
            <p className="mt-4 font-semibold text-yellow-400">How to fix it:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Go to your application's hosting platform (e.g., Vercel, Netlify, or your local environment).</li>
              <li>Find the section for "Environment Variables" or "Secrets".</li>
              <li>Create a new secret with the name <code className="bg-yellow-900/50 text-yellow-200 px-1 py-0.5 rounded">API_KEY</code>.</li>
              <li>Set its value to your valid Google Gemini API Key.</li>
              <li>Save and redeploy/restart the application.</li>
            </ol>
          </div>
          <p className="text-sm text-yellow-400">
            Once the API Key is correctly configured, this message will disappear and the app will be ready to use.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            AI LifeTime Analyzer
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Turn your date of birth into your life’s magical timeline! 🌟
          </p>
        </header>

        <main>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10">
            <InputForm
              userInput={userInput}
              setUserInput={setUserInput}
              onSubmit={handleGenerateReport}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-8">
            {isLoading && <Loader />}
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center space-y-4">
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={handleGenerateReport}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {report && <ReportDisplay content={report} />}

            {!isLoading && !report && !error && (
                <div className="text-center text-gray-400 py-10">
                    <p>Enter your details above to reveal your life's story.</p>
                </div>
            )}
          </div>
        </main>

        <footer className="text-center py-8 text-gray-500 text-sm">
            <p>Generated by AI. For entertainment purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
