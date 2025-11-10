// src/utils/taskIcons.tsx
import React from "react";

/** Simple inline SVG icons (small, lightweight) */

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="w-5 h-5 inline-block" aria-hidden>
    {children}
  </span>
);

export const WaterIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 3.5c0 0-5 6-5 9.5a5 5 0 0 0 10 0C17 9.5 12 3.5 12 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const LeafIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M21 11.5c-4.5-2-8.5 0-13 0S2 9 2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 6c2 2 3 5 3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const BeakerIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M10 2v4l-4 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2l-4-8V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const SparklesIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 3l1.5 3 3 1.5-3 1.5L12 12l-1.5-3L7 7.5 10 6 12 3z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 19l1 2 2 1-2-1-1-2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const FireIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2s-2 3-2 5a4 4 0 0 0 4 4c0 2 1 4 1 4s1-4 3-6c0 0-1 3-1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </IconWrapper>
);

export const ScissorsIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M14 14l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 10L7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="17.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  </IconWrapper>
);

/** Export mapping of category -> JSX element (icon + optional color classes) */
export const categoryIcons: Record<string, JSX.Element> = {
  water: <WaterIcon />,
  fertilize: <LeafIcon />,
  em: <BeakerIcon />,
  compost: <LeafIcon />,
  bokashi: <SparklesIcon />,
  woodash: <FireIcon />,
  prune: <ScissorsIcon />,
};

// Fallback icon (optional)
export const DefaultIcon = () => (
  <IconWrapper>
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </IconWrapper>
);
