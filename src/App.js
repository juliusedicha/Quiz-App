import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://opentdb.com/api.php?amount=10";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizSettings, setQuizSettings] = useState({
    category: "9",
    difficulty: "medium",
    numQuestions: 5,
    duration: 5,
    quizTime: 30,
  });
  const [quizTime, setQuizTime] = useState(quizSettings.quizTime);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isLastQuestionAnswered, setIsLastQuestionAnswered] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(Array(4).fill(null));
  const [displayInfo, setDisplayInfo] = useState(null);
  const [infoTimer, setInfoTimer] = useState(null);

  const displayInformation = (info) => {
    setDisplayInfo(info);
    setInfoTimer(10);
  };

  useEffect(() => {
    let timer;
    if (infoTimer > 0) {
      timer = setInterval(() => {
        setInfoTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setDisplayInfo(null);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [infoTimer]);

useEffect(() => {
  let countdownTimer;
  if (quizStarted && quizTime > 0 && !showResultPopup && !showConfirmationDialog && infoTimer === 0) {
    countdownTimer = setInterval(() => {
      setQuizTime((prevTime) => prevTime - 1);
    }, 1000);
  } else if (quizStarted && quizTime === 0 && !isAnswerSubmitted) {
    if (!isLastQuestionAnswered) {
      submitAnswers();
    }
    clearInterval(countdownTimer);
  }

  return () => clearInterval(countdownTimer);
}, [quizStarted, quizTime, isAnswerSubmitted, isLastQuestionAnswered, showResultPopup, showConfirmationDialog, infoTimer]);




  const shuffleOptions = (correctOption, incorrectOptions) => {
    const allOptions = [...incorrectOptions, correctOption];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    return allOptions;
  };

  const startQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: {
          amount: quizSettings.numQuestions,
          category: quizSettings.category,
          difficulty: quizSettings.difficulty,
        },
      });

      const shuffledQuestions = response.data.results.map((question) => ({
        ...question,
        options: shuffleOptions(
          question.correct_answer,
          question.incorrect_answers
        ),
      }));

      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setQuizStarted(true);
      setAnsweredQuestions([]);
      setIsLastQuestionAnswered(false);
      setSelectedOptions(Array(4).fill(null));
      setQuizTime(quizSettings.quizTime);
      displayInformation(`
        INSTRUCTIONS: 
        
        (1) Participants should be familiar with the initial setup of the quiz. 

        (2) Participants need to comprehend the question-and-answer process. They should know how to select an answer for each question and understand that once an answer is submitted, it cannot be changed. Additionally, participants should be aware that the correct answer is displayed among the options.

        (3) Participants should understand how to navigate through the quiz. They should be aware of the buttons to move to the next or previous question and that these actions may be restricted in certain situations, especially when the last question is answered, and the confirmation popup is displayed. Even though you didn't submit, the PREVIOUS button will be disabled.
      `);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect, index) => {
    if (!isAnswerSubmitted && !answeredQuestions.includes(currentQuestionIndex)) {
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
      setIsAnswerSubmitted(true);
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
      setSelectedOptions((prevOptions) =>
        prevOptions.map((selected, i) => (i === index ? true : selected))
      );
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizSettings.numQuestions - 1 && !showResultPopup && !showConfirmationDialog) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsLastQuestionAnswered(false);
      setIsAnswerSubmitted(false);
      setSelectedOptions(Array(4).fill(null)); 
    } else {
      setIsLastQuestionAnswered(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0 && !showResultPopup && !showConfirmationDialog) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsLastQuestionAnswered(false);
      setIsAnswerSubmitted(false);
      setSelectedOptions(Array(4).fill(null)); 
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setShowResultPopup(false);
    setShowConfirmationDialog(false);
    setIsAnswerSubmitted(false);
    setAnsweredQuestions([]);
    setIsLastQuestionAnswered(false);
    setSelectedOptions(Array(4).fill(null));
    setQuizTime(0);
  };

  const showResultConfirmation = () => {
    setShowConfirmationDialog(true);
    setQuizTime(0); 
  };

  const submitAnswers = () => {
    setLoading(true);
    setTimeout(() => {
      setShowResultPopup(true);
      setLoading(false);
    }, 1000);
  };

  const handleConfirmation = (shouldSubmit) => {
    setShowConfirmationDialog(false);
    if (shouldSubmit) {
      setIsLastQuestionAnswered(true);
      submitAnswers();
    }
  };

  const closeResultPopup = () => {
    resetQuiz();
  };

  const onPlayAgain = () => {
    resetQuiz();
    startQuiz();
  };

  return (
    <div className="app">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-p">Loading...</p>
        </div>
      ) : (
        <>
          {displayInfo && (
            <div className="info-popup">
              <p>{displayInfo}</p>
              <p className="infoo">Time remaining: {infoTimer} seconds</p>
            </div>
          )}
          {quizStarted && questions.length > 0 ? (
            <div className="quiz-container">
              <h1>
                Question {currentQuestionIndex + 1} / {quizSettings.numQuestions}
                <span className="quiz-timer">{quizTime}s</span>
              </h1>
              <p>Correct Answers: {correctAnswers}/{quizSettings.numQuestions}</p>
              {questions[currentQuestionIndex] && (
                <h2>{questions[currentQuestionIndex].question}</h2>
              )}
              <div className="options" disabled={showResultPopup || showConfirmationDialog}>
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option === questions[currentQuestionIndex]?.correct_answer, index)}
                    className={selectedOptions[index] ? "selected" : ""}
                    disabled={showResultPopup || showConfirmationDialog}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="button-container">
                <button
                  onClick={previousQuestion}
                  disabled={isLastQuestionAnswered || currentQuestionIndex === 0 || showResultPopup || showConfirmationDialog}
                >
                  Previous Question
                </button>
                {isLastQuestionAnswered ? (
                  <button
                    onClick={showResultPopup ? closeResultPopup : showResultConfirmation}
                    disabled={showResultPopup || showConfirmationDialog}
                  >
                    Submit Answers
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    disabled={showResultPopup || showConfirmationDialog}
                  >
                    Next Question
                  </button>
                )}
              </div>
              {showResultPopup && (
                <div className="result-popup">
                  <div className="result-content">
                    <h1>✅ Quiz Result ✅</h1>
                    <p>Your Score: {correctAnswers}/{quizSettings.numQuestions}</p>
                    <p>Percentage: {((correctAnswers / quizSettings.numQuestions) * 100).toFixed(2)}%</p>
                    <div className="button-container">
                      <button onClick={closeResultPopup}>Quit</button>
                      <button onClick={onPlayAgain}>Retake</button>
                    </div>
                  </div>
                </div>
              )}
              {showConfirmationDialog && (
                <div className="result-popup">
                  <div className="result-content">
                    <p>Do you want to submit your answers?</p>
                    <div className="button-container">
                      <button onClick={() => handleConfirmation(true)}>Yes</button>
                      <button onClick={() => handleConfirmation(false)}>No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="setup-container">
              <h1>Setup Quiz</h1>
              <label>
                Category:
                <select
                  onChange={(e) =>
                    setQuizSettings({ ...quizSettings, category: e.target.value })
                  }
                >
                  <option value="9">General Knowledge</option>
                  <option value="21">Sports</option>
                  <option value="24">Politics</option>
                  <option value="23">History</option>
                </select>
              </label>
              <label>
                Difficulty:
                <select
                  onChange={(e) =>
                    setQuizSettings({ ...quizSettings, difficulty: e.target.value })
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label>
                Number of Questions:
                <input
                  type="number"
                  min="1"
                  value={quizSettings.numQuestions}
                  onChange={(e) =>
                    setQuizSettings({
                      ...quizSettings,
                      numQuestions: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Quiz Time (seconds):
                <input
                  type="number"
                  min="1"
                  value={quizSettings.quizTime}
                  onChange={(e) =>
                    setQuizSettings({
                      ...quizSettings,
                      quizTime: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <button onClick={startQuiz}>Start Quiz</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
