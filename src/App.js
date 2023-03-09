import React from 'react'
import './App.css';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/dist/dropdown";

function App() {
  return (
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
