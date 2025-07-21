import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AOS from 'aos';
import 'aos/dist/aos.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Initialize AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
});

root.render(
  
    <Router>
      <App />
    </Router>
  
);

reportWebVitals();




