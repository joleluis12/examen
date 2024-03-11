import React from 'react';
import FirebaseImageUpload from './FirebaseImageUpload'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Subir Imágenes a Firebase Storage</h1>
      </header>
      <main>
        <FirebaseImageUpload /> 
      </main>
    </div>
  );
}

export default App;
