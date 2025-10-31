
import React from 'react';
import { UserInput } from '../types';
import { countries } from '../constants';

interface InputFormProps {
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userInput.name}
          onChange={handleChange}
          placeholder="e.g., Arif Khan"
          required
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="dob" className="text-sm font-medium text-gray-300">
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={userInput.dob}
          onChange={handleChange}
          required
          max={today}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium text-gray-300">
          Country
        </label>
        <select
          id="country"
          name="country"
          value={userInput.country}
          onChange={handleChange}
          required
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
        >
          {countries.map((country) => (
            <option key={country} value={country} className="bg-slate-800 text-white">{country}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="md:col-span-3 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Generate My Life Report'
        )}
      </button>
    </form>
  );
};
