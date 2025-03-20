import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <CategoryCard 
        title={`Projetos`}
        color="#d4f5e9"
        onClick={() => navigate('/projetos')}
      />
      
      <CategoryCard 
        title={`Contextos`}
        color="#d4e9f5"
        onClick={() => navigate('/contextos')}
      />
      
      <CategoryCard 
        title={`Áreas de Vida`}
        color="#f5f1d4"
        onClick={() => navigate('/areas')}
      />
    </div>
  );
};

export default Home; 