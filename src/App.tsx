import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GameField } from './components/GameField';

function App() {
  return (
    <div className="App">
      <GameField xSize={100} ySize={100}></GameField>
    </div>
  );
}

export default App;
