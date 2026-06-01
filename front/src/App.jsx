import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil/Accueil';
import Apropos from './pages/Apropos/Apropos';
import Services from './pages/Services/Services';
import Projets from './pages/Projets/Projets';
import Admin from './pages/Admin/Admin';
import VisitTracker from './app/VisitTracker';

function App() {
  return (
    <Router>
      <VisitTracker />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
