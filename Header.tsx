import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
);

const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


export const Header: React.FC = () => {
  const { t, language, setLanguage, availableLanguages } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MusicNoteIcon className="h-8 w-8 text-purple-400"/>
            <h1 className="text-2xl font-bold tracking-tight text-white">BADMUSIC</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden md:block text-sm text-purple-300">{t('headerSubtitle')}</p>
            <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} onBlur={() => setTimeout(() => setIsOpen(false), 200)} className="flex items-center gap-1 text-sm text-gray-300 hover:text-white p-2 rounded-md transition bg-gray-800/50 hover:bg-gray-700/80">
                    <GlobeAltIcon className="h-5 w-5" />
                    <span>{availableLanguages[language]}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in">
                        {Object.keys(availableLanguages).map((langKey) => (
                            <a
                                key={langKey}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setLanguage(langKey);
                                    setIsOpen(false);
                                }}
                                className={`block px-4 py-2 text-sm ${language === langKey ? 'text-purple-400 font-bold' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                {availableLanguages[langKey]}
                            </a>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
