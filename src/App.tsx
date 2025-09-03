import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Páginas existentes
import Register from './pages/Register';
import Ambience from './pages/Ambience';
import Home from './pages/Home';
import DevicesPage from './pages/Devices/Devices';
import Cozy from './pages/Cozy/Cozy';


const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/ambience" element={<Ambience/>} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/cozy" element={<Cozy/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;