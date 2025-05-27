import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { GiftIcon, UserIcon, CalendarIcon, HeartIcon, DollarSignIcon, SparklesIcon } from 'lucide-react';
// ... existing code ...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);
  try {
    const apiPayload = {
      interests: formData.interests,
      age: parseInt(formData.personAge),
      budget_min: formData.minBudget,
      budget_max: formData.maxBudget
    };
    const response = await axios.post('https://gift-api-973409790816.europe-west1.run.app/recommend', apiPayload);
    navigate('/products', {
      state: {
        formData,
        recommendations: response.data
      }
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    alert('Sorry, there was an error getting recommendations. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
// ... rest of existing code ...