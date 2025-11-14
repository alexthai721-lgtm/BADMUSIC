import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

export const Footer: React.FC = () => {
  const { t } = useTranslations();
  return (
    <footer className="bg-gray-900 border-t border-gray-700/50">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-500">
          {t('footerText')}
        </p>
      </div>
    </footer>
  );
};
