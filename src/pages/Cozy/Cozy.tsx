import { useState } from 'react';
import styles from './Cozy.module.css';
import AddCozyModal from '../../components/AddCozyModal';
import ItemCozy from '../../components/ItemCozy';
import { Link } from 'react-router-dom';

const MAX_COZYS = 12;

interface Cozy {
  id: number;
  name: string;
}

const CozyPage = () => {
  const initialState = Array.from({ length: MAX_COZYS }).map(() => null);
  const [gridSlots, setGridSlots] = useState<(Cozy | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewCozy = (name: string) => {
  if (selectedSlotIndex === null) return;

  const newCozy: Cozy = { id: Date.now(), name };
  setGridSlots(slots => {
    const newSlots = [...slots];
    newSlots[selectedSlotIndex] = newCozy;
    return newSlots;
  });

  setSelectedSlotIndex(null);
  setIsAddModalOpen(false);
};


  const handleRename = (cozyId: number) => { setEditingId(cozyId); setMenuOpenId(null); };
  const handleDelete = (cozyId: number) => { setGridSlots(slots => slots.map(slot => slot?.id === cozyId ? null : slot)); setMenuOpenId(null); };
  const handleSaveRename = (cozyId: number, newName: string) => { setGridSlots(slots => slots.map(slot => slot?.id === cozyId ? { ...slot, name: newName } : slot)); setEditingId(null); };
  const handleCancelRename = () => { setEditingId(null); };
  const handleMenuClick = (cozyId: number) => { setMenuOpenId(prev => prev === cozyId ? null : cozyId); };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/Ambience" className={styles.backButtonLink}>&larr; voltar</Link>
        <p className={styles.pageInfo}>Você está na <strong>página de Cômodos</strong></p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Cômodos</h1>
          <span>*limite de até {MAX_COZYS} cozys</span>
        </div>

        <div className={styles.cozyGrid}>
          {gridSlots.map((cozy, index) => (
            <ItemCozy
              key={index}
              index={index}
              cozy={cozy || undefined}
              isEditing={editingId === cozy?.id}
              isMenuOpen={menuOpenId === cozy?.id}
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
        <Link to="/devices"><a>Ir para gerenciamento de dispositivos</a></Link>
      </footer>

      <AddCozyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewCozy}
      />
    </div>
  );
};

export default CozyPage;
