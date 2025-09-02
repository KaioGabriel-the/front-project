import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./CreateAmbience.module.css";

interface CreateAmbienceProps {
  addAmbience: (name: string) => void;
}

const CreateAmbience: React.FC<CreateAmbienceProps> = ({ addAmbience }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAmbience(name);
    navigate("/ambientes"); // volta para a lista
  };

  return (
    <div className={styles.container}>
      <Header title="Criar Novo Ambiente" />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Nome do ambiente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.createButton}>
          Criar
        </button>
      </form>
    </div>
  );
};

export default CreateAmbience;
