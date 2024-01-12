// src/api.js
import axios from 'axios';

const BASE_URL = 'https://opentdb.com/api.php?amount=10';

export const fetchQuizQuestions = async (amount, category, difficulty) => {
  const response = await axios.get(BASE_URL, {
    params: {
      amount,
      category,
      difficulty,
      type: 'multiple', // Multiple-choice questions
    },
  });
  return response.data.results;
};


