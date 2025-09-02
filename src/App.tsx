import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Páginas existentes
import Register from './pages/Register';
import Ambience from './pages/Ambience';
import Home from './pages/Home';
import DevicesPage from './pages/Devices/Devices';

interface AmbienceData {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [ambiences, setAmbiences] = useState<AmbienceData[]>([
    { id: 1, name: "Sala de Estar" },
    { id: 2, name: "Cozinha" },
  ]);
  const [nextId, setNextId] = useState(3);
  const addAmbience = (name: string) => {
    setAmbiences([...ambiences, { id: nextId, name }]);
    setNextId(nextId + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/ambientes" element={<Ambience/>} />
        <Route path="/devices" element={<DevicesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;