import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Login from './pages/Login';
import Register from './pages/Register';
import Ambience from './pages/Ambience';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/ambientes" element={<Ambience/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
