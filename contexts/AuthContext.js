import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: 'Guest',
    id: null,
    isAuthenticated: false,
    email: '',
    position: '',
    skillLevel: 'beginner',
    avatar: null
  });

  const [trainingHistory, setTrainingHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const addTrainingResult = (result) => {
    setTrainingHistory(prev => [...prev, {
      ...result,
      date: new Date(),
      id: prev.length + 1
    }]);
    setTotalScore(prev => prev + result.score);
  };

  const updateProfile = (newProfileData) => {
    setUserProfile(prev => ({
      ...prev,
      ...newProfileData
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      userProfile, 
      trainingHistory,
      totalScore,
      addTrainingResult,
      updateProfile,
      login: (userData) => setUserProfile({...userData, isAuthenticated: true}),
      logout: () => {
        setUserProfile({ name: 'Guest', id: null, isAuthenticated: false });
        setTrainingHistory([]);
        setTotalScore(0);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
