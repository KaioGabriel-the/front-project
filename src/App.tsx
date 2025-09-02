import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Páginas existentes
import Register from './pages/Register';
import Ambience from './pages/Ambience';
import Home from './pages/Home';
import DevicesPage from './pages/Devices/Devices';


const App: React.FC = () => {

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