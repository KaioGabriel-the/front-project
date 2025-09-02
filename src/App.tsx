import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Login from './pages/Login';
import Register from './pages/Register';
import Ambience from './pages/Ambience';
import Home from './pages/Home';

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
