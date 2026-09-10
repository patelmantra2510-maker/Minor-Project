import React from 'react';
import { HomeBackground } from './HomeBackground';
import { FindBackground } from './FindBackground';
import { ExploreBackground } from './ExploreBackground';
import { SavedBackground } from './SavedBackground';
import { AboutBackground } from './AboutBackground';
import { ScholarshipBackground } from './ScholarshipBackground';
import { ResultsBackground } from './ResultsBackground';
import { AiBackground } from './AiBackground';

export type BackgroundVariant =
  | 'home'
  | 'find'
  | 'explore'
  | 'saved'
  | 'about'
  | 'detail'
  | 'results'
  | 'ai';

interface EdvoraBackgroundProps {
  variant: BackgroundVariant;
  hasSavedItems?: boolean;
  className?: string;
}

export const EdvoraBackground: React.FC<EdvoraBackgroundProps> = ({
  variant,
  hasSavedItems = false,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none ${className}`}
    >
      {variant === 'home' && <HomeBackground />}
      {variant === 'find' && <FindBackground />}
      {variant === 'explore' && <ExploreBackground />}
      {variant === 'saved' && <SavedBackground hasSavedItems={hasSavedItems} />}
      {variant === 'about' && <AboutBackground />}
      {variant === 'detail' && <ScholarshipBackground />}
      {variant === 'results' && <ResultsBackground />}
      {variant === 'ai' && <AiBackground />}
    </div>
  );
};
