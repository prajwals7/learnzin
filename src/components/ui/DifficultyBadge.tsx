import React from 'react';

export type Difficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

interface DifficultyBadgeProps {
  level: Difficulty;
}

const DifficultyBadge = ({ level }: DifficultyBadgeProps) => {
  const colors = {
    BASIC: 'bg-difficulty-basic/10 text-difficulty-basic border-difficulty-basic/20',
    INTERMEDIATE: 'bg-difficulty-intermediate/10 text-difficulty-intermediate border-difficulty-intermediate/20',
    ADVANCED: 'bg-difficulty-advanced/10 text-difficulty-advanced border-difficulty-advanced/20',
  };

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${colors[level]}`}>
      {level}
    </span>
  );
};

export default DifficultyBadge;
