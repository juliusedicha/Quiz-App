// ResultPopup.js
import React from "react";
import "./ResultPopup.css";

const ResultPopup = ({ correctAnswers, totalQuestions, onClose, onPlayAgain }) => {
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="result-popup">
      <div className="result-content">
        <h1>Quiz Completed!</h1>
        <p>Your Score: {correctAnswers}/{totalQuestions}</p>
        <p>Percentage: {percentage}%</p>
        <div className="button-container">
          <button onClick={onClose}>Close</button>
          <button onClick={onPlayAgain}>Play Again</button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
