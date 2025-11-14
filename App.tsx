import React, { useState } from 'react';
import { LyricForm } from './components/LyricForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Confirmation } from './components/Confirmation';
import type { MusicIdeas, SubmissionData } from './types';

const App: React.FC = () => {
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null);
  const [musicIdeas, setMusicIdeas] = useState<MusicIdeas | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleNewSubmission = () => {
    setSubmissionData(null);
    setMusicIdeas(null);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {!isSubmitted ? (
            <LyricForm 
              setIsSubmitted={setIsSubmitted} 
              setSubmissionData={setSubmissionData}
              setMusicIdeas={setMusicIdeas}
            />
          ) : (
            <Confirmation 
              submissionData={submissionData} 
              musicIdeas={musicIdeas}
              onNewSubmission={handleNewSubmission}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
