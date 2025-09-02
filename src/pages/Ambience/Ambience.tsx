import { useState } from 'react';
import styles from './Ambience.module.css';
import AddAmbienceModal from '../../components/AddAmbienteModal';
import ItemAmbience from "../../components/ItemAmibience";
import { Link } from 'react-router-dom';

const MAX_AMBIENCES = 12; // limite de ambientes (ajuste conforme precisar)

export interface Ambience {
  id: number;
  name: string;
}

const AmbiencesPage = () => {
  const initialState = Array.from({ length: MAX_AMBIENCES }).map(() => null);

  const [gridSlots, setGridSlots] = useState<(Ambience | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewAmbience = (name: string) => {
    if (selectedSlotIndex === null) return;

    const newAmbience: Ambience = {
      id: Date.now(),
      name: name,
    };

    setGridSlots((currentSlots) => {
      const newSlots = [...currentSlots];
      newSlots[selectedSlotIndex] = newAmbience;
      return newSlots;
    });

    setSelectedSlotIndex(null); // Limpa o índice
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/home" className={styles.backButtonLink}>
          &larr; voltar
        </Link>
        <p className={styles.pageInfo}>
          Você está na <strong>página de Ambientes</strong>
        </p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Ambientes</h1>
          <span>*limite de até {MAX_AMBIENCES} ambientes</span>
        </div>

        <div className={styles.ambienceGrid}>
          {gridSlots.map((ambience, index) => (
            <ItemAmbience
              key={index}
              index={index}
              Ambience={ambience || undefined}
              onAddClick={handleOpenAddModal}
            />
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#">Ir para gerenciamento de dispositivos</a>
      </footer>

      <AddAmbienceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewAmbience}
      />
    </div>
  );
};

export default AmbiencesPage;
