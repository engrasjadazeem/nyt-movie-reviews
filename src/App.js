import React from 'react';
import './App.css';
import Header from './components/header';
import MovieReview from './components/movieReview';

function App() {
  return (
    <div className="App container">
      <Header />
      <MovieReview/>

      {/* TODO (optional): Check react-native-background-fetch package serves the purpose or not */}
    </div>
  );
}

export default App;
