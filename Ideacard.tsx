import React from 'react';
import type { MusicIdeas } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface IdeaCardProps {
  ideas: MusicIdeas;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);


const IdeaItem: React.FC<{ title: string; value: string | string[] | number }> = ({ title, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">{title}</h4>
        {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2 mt-1">
                {value.map((item, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-600 text-gray-200 rounded-full">{item}</span>
                ))}
            </div>
        ) : (
            <p className="text-lg text-white">{typeof value === 'number' ? `${value} BPM` : value}</p>
        )}
    </div>
);

export const IdeaCard: React.FC<IdeaCardProps> = ({ ideas }) => {
  const { t } = useTranslations();
  
  return (
    <div className="bg-gray-900/70 border border-purple-500/30 rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-purple-400"/>
            <h3 className="text-lg font-bold text-white">{t('cardTitle')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IdeaItem title={t('mood')} value={ideas.mood} />
            <IdeaItem title={t('tempo')} value={ideas.tempo} />
            <IdeaItem title={t('vocalStyleSuggestion')} value={ideas.vocalStyleSuggestion} />
            <IdeaItem title={t('chordProgression')} value={ideas.chordProgression} />
            <div className="md:col-span-2">
              <IdeaItem title={t('instrumentation')} value={ideas.instrumentation} />
            </div>
        </div>
    </div>
  );
};
