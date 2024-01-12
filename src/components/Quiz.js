// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchQuizQuestions } from '../api';
import Countdown from 'react-countdown';

const Quiz = () => {
  const location = useLocation();
  const history = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { amount, category, difficulty } = location.state.formData;
        const data = await fetchQuizQuestions(amount, category, difficulty);
        setQuestions(data);
      } catch (error) {
        console.error(error);
        // Handle the error, e.g., show an error message to the user
      }
    };

    loadQuestions();
  }, [location.state.formData]);

  const handleAnswerClick = () => {
    // Implement logic for handling user answers
    // You may want to update the score, check correctness, etc.
    // For simplicity, let's just move to the next question.
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // End of quiz, navigate to the result page
      history.push('/result');
    }
  };

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Timer completed, move to the next question
      handleAnswerClick();
      return null;
    }
    return <span>{seconds}s</span>;
  };

  return (
    <div>
      {questions.length > 0 && currentQuestion < questions.length && (
        <div>
          <h2>Question {currentQuestion + 1}</h2>
          <Countdown
            date={Date.now() + questions[currentQuestion].question.length * 1000} // Adjust timer based on the length of the question
            renderer={renderer}
          />
          <p>{questions[currentQuestion].question}</p>
          <ul>
            {questions[currentQuestion].options.map((option, index) => (
              <li key={index}>
                <label>
                  <input type="radio" name="answer" value={option} />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleAnswerClick}>Next Question</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
