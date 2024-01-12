// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: 5,
    category: 9, // General Knowledge
    difficulty: 'easy',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const startQuiz = () => {
    navigate('/quiz', { state: { formData } });
  };

  return (
    <div>
      <h2>Quiz Options</h2>
      <form>
        <label>
          Number of Questions:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange}>
            {/* Add options for categories */}
          </select>
        </label>
        <label>
          Difficulty:
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <button type="button" onClick={startQuiz}>
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default Home;
