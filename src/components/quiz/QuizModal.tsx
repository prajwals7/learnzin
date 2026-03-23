'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Loader2, Sparkles, Award } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: any;
  onComplete?: () => void;
}

const QuizModal = ({ isOpen, onClose, quiz, onComplete }: QuizModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen || !quiz) return null;

  const currentQuestion = quiz.questions[currentStep];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete?.();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6 px-8">
          <div className="flex items-center gap-3">
             <div className="gradient-bg p-2 rounded-lg text-white">
                <Sparkles size={18} />
             </div>
             <div>
               <h3 className="font-outfit text-xl font-bold text-text-dark">{quiz.title}</h3>
               <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">AI-Generated Assessment</p>
             </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {!isFinished ? (
            <div>
              <div className="mb-8 flex items-center justify-between">
                 <span className="text-sm font-bold text-primary-purple">Question {currentStep + 1} of {quiz.questions.length}</span>
                 <div className="flex gap-1">
                    {quiz.questions.map((_: any, i: number) => (
                      <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= currentStep ? 'bg-primary-purple' : 'bg-gray-100'}`} />
                    ))}
                 </div>
              </div>

              <h2 className="mb-8 font-outfit text-2xl font-bold text-text-dark leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => {
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isSelected = index === selectedOption;
                  
                  let stateStyle = 'border-gray-100 hover:border-primary-purple/30 bg-white';
                  if (isAnswered) {
                    if (isCorrect) stateStyle = 'border-green-500 bg-green-50 ring-2 ring-green-500/20';
                    else if (isSelected) stateStyle = 'border-red-500 bg-red-50 ring-2 ring-red-500/20';
                    else stateStyle = 'border-gray-100 opacity-50';
                  } else if (isSelected) {
                    stateStyle = 'border-primary-purple bg-primary-purple/5 ring-2 ring-primary-purple/20';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left font-bold transition-all ${stateStyle}`}
                    >
                      <span className={isAnswered && (isCorrect || isSelected) ? (isCorrect ? 'text-green-700' : 'text-red-700') : 'text-text-dark'}>
                        {option}
                      </span>
                      {isAnswered && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                      {isAnswered && isSelected && !isCorrect && <AlertCircle className="text-red-500" size={20} />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 rounded-2xl p-6 ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
                >
                  <p className={`text-sm font-bold ${selectedOption === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                    {selectedOption === currentQuestion.correctAnswer ? 'Great job! That is correct.' : 'Not quite. The correct answer was option ' + (currentQuestion.correctAnswer + 1) + '.'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              <div className="mt-10 flex justify-end">
                <button
                  onClick={isAnswered ? handleNext : handleSubmit}
                  disabled={selectedOption === null}
                  className="flex items-center gap-2 rounded-xl gradient-bg px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {isAnswered ? (currentStep === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question') : 'Submit Answer'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-purple/10 text-primary-purple">
                 <Award size={48} />
              </div>
              <h2 className="font-outfit text-4xl font-black text-text-dark">Quiz Complete!</h2>
              <p className="mt-4 text-xl text-text-secondary">
                You scored <span className="font-bold text-primary-purple">{score} out of {quiz.questions.length}</span>
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                  onClick={onClose}
                  className="rounded-2xl border-2 border-primary-purple px-10 py-4 font-bold text-primary-purple hover:bg-primary-purple/5 transition-all"
                 >
                   Back to Course
                 </button>
                 <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setSelectedOption(null);
                    setIsAnswered(false);
                    setScore(0);
                    setIsFinished(false);
                  }}
                  className="rounded-2xl gradient-bg px-10 py-4 font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                 >
                   <RefreshCw size={18} /> Retake Quiz
                 </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizModal;
