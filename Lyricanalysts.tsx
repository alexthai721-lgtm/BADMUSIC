import React from 'react';
import { LyricAnalysis } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface LyricAnalysisCardProps {
    analysis: LyricAnalysis;
    onDismiss: () => void;
}

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 19.64 2.25 15.223 2.25 10.5 2.25 5.806 5.806 2.25 10.5 2.25c4.694 0 8.25 3.556 8.25 8.25 0 4.723-2.258 9.14-5.25 11.478z" />
    </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export const LyricAnalysisCard: React.FC<LyricAnalysisCardProps> = ({ analysis, onDismiss }) => {
    const { t } = useTranslations();
    
    return (
        <div className="bg-gray-700/50 border border-purple-400/30 rounded-lg p-4 mt-4 relative animate-fade-in">
            <button onClick={onDismiss} className="absolute top-2 right-2 text-gray-400 hover:text-white transition">
                <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="flex items-start space-x-3">
                <LightBulbIcon className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-white">{t('analysisTitle')}</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-purple-300 font-semibold">{t('analysisSentiment')}</p>
                            <p className="text-gray-200">{analysis.sentiment}</p>
                        </div>
                        <div>
                            <p className="text-purple-300 font-semibold">{t('analysisRhymeScheme')}</p>
                            <p className="text-gray-200">{analysis.rhymeScheme}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
