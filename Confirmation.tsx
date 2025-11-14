import React from 'react';
import type { MusicIdeas, SubmissionData } from '../types';
import { IdeaCard } from './IdeaCard';
import { useTranslations } from '../hooks/useTranslations';

interface ConfirmationProps {
  submissionData: SubmissionData | null;
  musicIdeas: MusicIdeas | null;
  onNewSubmission: () => void;
}

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowUturnLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);


export const Confirmation: React.FC<ConfirmationProps> = ({ submissionData, musicIdeas, onNewSubmission }) => {
  const { t } = useTranslations();

  if (!submissionData) return null;

  const producerEmail = "alexea2024@hotmail.com";
  const paypalEmail = "alexandrefx93@icloud.com";

  const paymentDetails = {
    single: {
        amount: 1.99,
        itemName: t('planSingleName'),
    },
    lifetime: {
        amount: 99.00,
        itemName: t('planLifetimeName'),
    }
  };

  const selectedPlan = paymentDetails[submissionData.paymentOption as 'single' | 'lifetime'];

  const generatePaypalLink = () => {
      if (!selectedPlan) return '#';
      const paypalBase = "https://www.paypal.com/cgi-bin/webscr";
      const params = new URLSearchParams({
          cmd: "_xclick",
          business: paypalEmail,
          item_name: selectedPlan.itemName,
          amount: selectedPlan.amount.toFixed(2),
          currency_code: "USD",
          no_shipping: '1',
      });
      return `${paypalBase}?${params.toString()}`;
  };
  
  const generateMailtoLink = () => {
    const subject = `PAID Lyric Submission: ${submissionData.name} - ${submissionData.genre}`;
    
    let body = `
New Lyric Submission from ${submissionData.name}
Contact Email: ${submissionData.email}
------------------------------------------

PLAN: ${selectedPlan?.itemName || 'Not Selected'}

DETAILS:
- Genre: ${submissionData.genre}
- Vocalist: ${submissionData.vocalist}
- Song Structure: ${submissionData.songStructure}
- Vocal Style: ${submissionData.vocalStyle}

LYRICS:
${submissionData.lyrics}
------------------------------------------
`;

    if (musicIdeas) {
      body += `
AI CREATIVE IDEAS:
- Mood: ${musicIdeas.mood}
- Tempo: ${musicIdeas.tempo} BPM
- Chord Progression: ${musicIdeas.chordProgression}
- Instrumentation: ${musicIdeas.instrumentation.join(', ')}
- Vocal Style Suggestion: ${musicIdeas.vocalStyleSuggestion}
`;
    } else {
      body += `
AI CREATIVE IDEAS:
- Not generated at this time.
`;
    }

    return `mailto:${producerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-gray-800/50 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl animate-fade-in">
        <div className="text-center mb-8">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">{t('confirmationTitle')}</h2>
            <p className="mt-2 text-gray-400">
                {t('confirmationSubtitle', { name: submissionData.name })}
            </p>
        </div>

        {musicIdeas && (
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-center text-gray-300 mb-4">{t('aiIdeasTitle')}</h3>
                <IdeaCard ideas={musicIdeas} />
            </div>
        )}

        <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
            <h3 className="text-xl font-bold text-white text-center mb-4">{t('completeOrderTitle')}</h3>
            <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Step 1: Payment */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white font-bold text-xl mb-3">1</div>
                    <h4 className="font-bold text-lg text-white">{t('step1Title')}</h4>
                    <p className="text-gray-400 text-sm mb-4">{t('step1Desc', { planName: selectedPlan?.itemName })}</p>
                     <a 
                        href={generatePaypalLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all"
                    >
                       {t('step1Button', { amount: `$${selectedPlan?.amount.toFixed(2)}`})}
                    </a>
                </div>
                {/* Step 2: Send Email */}
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-pink-600 text-white font-bold text-xl mb-3">2</div>
                    <h4 className="font-bold text-lg text-white">{t('step2Title')}</h4>
                    <p className="text-gray-400 text-sm mb-4">{t('step2Desc')}</p>
                     <a 
                        href={generateMailtoLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all"
                    >
                        <PaperAirplaneIcon className="mr-2 h-5 w-5" />
                        {t('step2Button')}
                    </a>
                </div>
            </div>
        </div>

        <div className="text-center mt-8">
            <button 
                onClick={onNewSubmission}
                className="inline-flex items-center justify-center px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all"
            >
                <ArrowUturnLeftIcon className="mr-2 h-5 w-5" />
                {t('newSongButton')}
            </button>
        </div>
    </div>
  );
};
