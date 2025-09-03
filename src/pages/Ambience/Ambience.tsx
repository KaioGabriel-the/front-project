// AmbiencesPage.tsx
import { useState } from 'react';
import styles from './Ambience.module.css';
import AddAmbienceModal from '../../components/AddAmbienteModal';
import ItemAmbience from "../../components/ItemAmbience/ItemAmbience";
import { Link } from 'react-router-dom';

const MAX_AMBIENCES = 12;

export interface Ambience {
  id: number;
  name: string;
}

const AmbiencesPage = () => {
  const initialState = Array.from({ length: MAX_AMBIENCES }).map(() => null);
  const [gridSlots, setGridSlots] = useState<(Ambience | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Adicionar novo ambiente
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewAmbience = (name: string) => {
    if (selectedSlotIndex === null) return;

    const newAmbience: Ambience = { id: Date.now(), name };
    setGridSlots(slots => {
      const newSlots = [...slots];
      newSlots[selectedSlotIndex] = newAmbience;
      return newSlots;
    });

    setSelectedSlotIndex(null);
    setIsAddModalOpen(false);
  };

  // Menu de opções
  const handleRename = (ambienceId: number) => {
    setEditingId(ambienceId);
    setMenuOpenId(null);
  };

  const handleDelete = (ambienceId: number) => {
    setGridSlots(slots => slots.map(slot => slot?.id === ambienceId ? null : slot));
    setMenuOpenId(null);
  };

  const handleSaveRename = (ambienceId: number, newName: string) => {
    setGridSlots(slots =>
      slots.map(slot => (slot?.id === ambienceId ? { ...slot, name: newName } : slot))
    );
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleMenuClick = (ambienceId: number) => {
    setMenuOpenId(prev => (prev === ambienceId ? null : ambienceId));
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
              ambience={ambience || undefined}
              isEditing={editingId === ambience?.id}
              isMenuOpen={menuOpenId === ambience?.id}
              onAddClick={handleOpenAddModal}
              onMenuClick={handleMenuClick}
              onRename={handleRename}
              onDelete={handleDelete}
              onSaveRename={handleSaveRename}
              onCancelRename={handleCancelRename}
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
