
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/50">
        <i className="fa-solid fa-microphone-lines text-3xl"></i>
      </div>
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
        Narrative Engine
      </h1>
      <p className="mt-2 text-slate-400 max-w-md mx-auto px-4 text-sm leading-relaxed">
        Transform long audio into a collection of 30-50 second narration clips ready for your social media content.
      </p>
    </header>
  );
};

export default Header;
