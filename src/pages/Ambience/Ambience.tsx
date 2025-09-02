import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import AmbienceItem from "../../components/AmbienceItem";
import styles from "./Ambience.module.css";

interface AmbienceData {
  id: number;
  name: string;
}

const Ambience: React.FC = () => {
  const navigate = useNavigate();
  
  const [ambiences, setAmbiences] = useState<AmbienceData[]>([
    { id: 1, name: "Sala de Estar" },
    { id: 2, name: "Cozinha" },
  ]);

  const [nextId, setNextId] = useState(3);

  const handleCreate = () => {
    navigate("/ambientes/novo"); // leva para a página de criação
  };

  const handleRename = (id: number, newName: string) => {
    setAmbiences(
      ambiences.map((a) => (a.id === id ? { ...a, name: newName } : a))
    );
  };

  const handleDelete = (id: number) => {
    setAmbiences(ambiences.filter((a) => a.id !== id));
  };

  return (
    <div className={styles.container}>
      <Header title="Ambientes" />

      <button onClick={handleCreate} className={styles.createButton}>
        ➕ Criar Ambiente
      </button>

      <ul className={styles.list}>
        {ambiences.map((ambience) => (
          <AmbienceItem
            key={ambience.id}
            ambience={ambience}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default Ambience;
