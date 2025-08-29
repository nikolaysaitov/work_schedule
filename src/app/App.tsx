import React from 'react';
import { SchedulePage } from '../pages/schedule';
import './styles/global.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <SchedulePage />
    </div>
  );
};