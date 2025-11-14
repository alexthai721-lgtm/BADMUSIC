import React, { useState } from 'react';
import { generateMusicIdeas, analyzeLyrics } from '../services/geminiService';
import type { MusicIdeas, SubmissionData, LyricAnalysis } from '../types';
import { Loader } from './Loader';
import { useTranslations } from '../hooks/useTranslations';
import { LyricAnalysisCard } from './LyricAnalysisCard';

interface LyricFormProps {
  setIsSubmitted: (isSubmitted: boolean) => void;
  setSubmissionData: (data: SubmissionData) => void;
  setMusicIdeas: (ideas: MusicIdeas | null) => void;
}

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
  </svg>
);


export const LyricForm: React.FC<LyricFormProps> = ({ setIsSubmitted, setSubmissionData, setMusicIdeas }) => {
  const { t } = useTranslations();
  const songStructures = t('songStructures');
  const vocalStyles = t('vocalStyles');

  const plans = [
    {
        name: t('planSingleName'),
        price: t('planSinglePrice'),
        description: t('planSingleDesc'),
        features: [
            t('planSingleFeature1'),
            t('planSingleFeature2'),
            t('planSingleFeature3'),
        ],
        type: 'single',
    },
    {
        name: t('planLifetimeName'),
        price: t('planLifetimePrice'),
        description: t('planLifetimeDesc'),
        features: [
            t('planLifetimeFeature1'),
            t('planLifetimeFeature2'),
            t('planLifetimeFeature3'),
        ],
        type: 'lifetime',
    }
];

  const [formData, setFormData] = useState<SubmissionData>({
    name: '',
    email: '',
    lyrics: '',
    genre: '',
    vocalist: '',
    songStructure: songStructures[0],
    vocalStyle: vocalStyles[0].name,
    paymentOption: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<LyricAnalysis | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = t('errorNameRequired');
    if (!formData.email.trim()) newErrors.email = t('errorEmailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('errorEmailInvalid');
    if (!formData.lyrics.trim()) newErrors.lyrics = t('errorLyricsRequired');
    else if (formData.lyrics.trim().split(/\s+/).length < 10) newErrors.lyrics = t('errorLyricsLength');
    if (!formData.genre.trim()) newErrors.genre = t('errorGenreRequired');
    if (!formData.vocalist) newErrors.vocalist = t('errorVocalistRequired');
    if (!formData.paymentOption) newErrors.paymentOption = t('errorPaymentRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlanSelect = (planType: 'single' | 'lifetime') => {
    setFormData({ ...formData, paymentOption: planType });
     if(errors.paymentOption) {
        setErrors({...errors, paymentOption: ''});
    }
  };

  const handleAnalyze = async () => {
    if (formData.lyrics.trim().split(/\s+/).length < 10) {
        setErrors({...errors, lyrics: t('errorLyricsLength')});
        return;
    }
    setIsAnalyzing(true);
    const result = await analyzeLyrics(formData.lyrics);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const ideas = await generateMusicIdeas(formData);
      setSubmissionData(formData);
      setMusicIdeas(ideas);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      // Optionally, set an error message to display to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('formTitle')}</h2>
        <p className="mt-2 text-gray-400">{t('formSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t('nameLabel')}</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder={t('namePlaceholder')} required />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">{t('emailLabel')}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder={t('emailPlaceholder')} required />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>
        
        <div className="mb-6">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-1">{t('genreLabel')}</label>
            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder={t('genrePlaceholder')} required />
            {errors.genre && <p className="text-red-400 text-xs mt-1">{errors.genre}</p>}
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('vocalistLabel')}</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white p-3 rounded-md bg-gray-900/50 border border-gray-600 flex-1 cursor-pointer has-[:checked]:border-purple-500 has-[:checked]:bg-purple-900/20 transition">
                    <input type="radio" name="vocalist" value="Female" checked={formData.vocalist === 'Female'} onChange={handleChange} className="accent-purple-500" /> {t('female')}
                </label>
                <label className="flex items-center gap-2 text-white p-3 rounded-md bg-gray-900/50 border border-gray-600 flex-1 cursor-pointer has-[:checked]:border-purple-500 has-[:checked]:bg-purple-900/20 transition">
                    <input type="radio" name="vocalist" value="Male" checked={formData.vocalist === 'Male'} onChange={handleChange} className="accent-purple-500" /> {t('male')}
                </label>
            </div>
            {errors.vocalist && <p className="text-red-400 text-xs mt-1">{errors.vocalist}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label htmlFor="songStructure" className="block text-sm font-medium text-gray-300 mb-1">{t('songStructureLabel')}</label>
                <select id="songStructure" name="songStructure" value={formData.songStructure} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition">
                    {songStructures.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="vocalStyle" className="block text-sm font-medium text-gray-300 mb-1">{t('vocalStyleLabel')}</label>
                <select id="vocalStyle" name="vocalStyle" value={formData.vocalStyle} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition">
                   {vocalStyles.map(s => <option key={s.name} value={s.name}>{`${s.name} (${s.description})`}</option>)}
                </select>
            </div>
        </div>

        <div className="mb-4">
          <label htmlFor="lyrics" className="block text-sm font-medium text-gray-300 mb-1">{t('lyricsLabel')}</label>
          <textarea id="lyrics" name="lyrics" rows={10} value={formData.lyrics} onChange={handleChange} className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition resize-y" placeholder={t('lyricsPlaceholder')} required></textarea>
          {errors.lyrics && <p className="text-red-400 text-xs mt-1">{errors.lyrics}</p>}
        </div>

         <div className="mb-8 text-right">
             <button type="button" onClick={handleAnalyze} disabled={isAnalyzing || formData.lyrics.trim().split(/\s+/).length < 10} className="inline-flex items-center justify-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isAnalyzing ? <Loader/> : t('analyzeButton')}
            </button>
        </div>

        {analysisResult && <LyricAnalysisCard analysis={analysisResult} onDismiss={() => setAnalysisResult(null)} />}


        {/* Payment Section */}
        <div className="my-8 p-6 md:p-8 rounded-lg bg-black/30 border border-gray-700 relative overflow-hidden">
             <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-20"
                src="https://videos.pexels.com/video-files/3129959/3129959-hd_1920_1080_25fps.mp4"
            ></video>
            <div className="relative z-10">
                <h3 className="text-center text-2xl font-bold text-white mb-1">{t('choosePlanTitle')}</h3>
                <p className="text-center text-gray-400 mb-6">{t('choosePlanSubtitle')}</p>
                {errors.paymentOption && <p className="text-red-400 text-xs mt-1 text-center mb-4">{errors.paymentOption}</p>}
                
                <div className="relative">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {plans.map((plan) => (
                            <div key={plan.type} className="w-full flex-shrink-0 px-2">
                                <div className={`bg-gray-900/70 backdrop-blur-sm border rounded-lg p-6 flex flex-col text-center h-full transition-all ${formData.paymentOption === plan.type ? 'border-purple-500' : 'border-gray-600'}`}>
                                    <h3 className="text-xl font-bold text-purple-300">{plan.name}</h3>
                                    <p className="text-4xl font-bold my-2 text-white">{plan.price}</p>
                                    <p className="text-gray-400 text-sm mb-4 flex-grow">{plan.description}</p>
                                    <ul className="space-y-2 text-sm text-gray-300 text-left mb-6">
                                        {plan.features.map(feat => (
                                           <li key={feat} className="flex items-start"><CheckIcon className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" /><span>{feat}</span></li>
                                        ))}
                                    </ul>
                                    <button type="button" onClick={() => handlePlanSelect(plan.type as 'single' | 'lifetime')} className={`w-full py-2 font-bold rounded-md transition ${formData.paymentOption === plan.type ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                                      {formData.paymentOption === plan.type ? t('planSelectedButton') : t('planSelectButton')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={() => setCurrentSlide(s => (s === 0 ? plans.length - 1 : s - 1))} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 text-white bg-gray-800/50 p-1 rounded-full hover:bg-gray-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button type="button" onClick={() => setCurrentSlide(s => (s === plans.length - 1 ? 0 : s + 1))} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 text-white bg-gray-800/50 p-1 rounded-full hover:bg-gray-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="text-center">
          <button type="submit" disabled={isLoading} className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <Loader /> : (
              <>
                {t('submitButton')} <ArrowRightIcon className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
