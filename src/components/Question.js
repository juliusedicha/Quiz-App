// src/components/Question.js
import React from 'react';

const Question = ({ question, handleAnswerClick }) => {
  return (
    <div>
      <h2>{question.question}</h2>
      {/* Render answer options */}
      <button onClick={handleAnswerClick}>Next Question</button>
    </div>
  );
};

export default Question;
