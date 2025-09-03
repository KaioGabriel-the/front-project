import { useState, useEffect } from 'react';
import styles from './Cozy.module.css';
import AddCozyModal from '../../components/AddCozyModal';
import ItemCozy from '../../components/ItemCozy';
import { Link, useParams } from 'react-router-dom';

const MAX_COZYS = 12;

interface Cozy {
  id: number;
  name: string;
}

const CozyPage = () => {
  const { environmentId } = useParams<{ environmentId: string }>();
  const [gridSlots, setGridSlots] = useState<(Cozy | null)[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // 🔹 Buscar os cômodos da API ao carregar a página
  useEffect(() => {
    const fetchCozy = async () => {
      try {
        const res = await fetch(
          `https://home-automation-control-production.up.railway.app/api/rooms/environment/${environmentId}`
        );
        if (!res.ok) throw new Error('Erro ao buscar cômodos');
        const data: Cozy[] = await res.json();

        // preencher slots com os cômodos vindos da API
        const filledSlots = Array.from({ length: MAX_COZYS }).map((_, i) => data[i] || null);
        setGridSlots(filledSlots);
      } catch (error) {
        console.error(error);
      }
    };

    if (environmentId) fetchCozy();
  }, [environmentId]);

  // 🔹 Funções locais (ainda funcionam, mas futuramente você pode integrar com API POST/PUT/DELETE)
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewCozy = (name: string) => {
    if (selectedSlotIndex === null) return;

    const newCozy: Cozy = { id: Date.now(), name }; // aqui seria um POST na API
    setGridSlots(slots => {
      const newSlots = [...slots];
      newSlots[selectedSlotIndex] = newCozy;
      return newSlots;
    });

    setSelectedSlotIndex(null);
    setIsAddModalOpen(false);
  };

  const handleRename = (cozyId: number) => {
    setEditingId(cozyId);
    setMenuOpenId(null);
  };

  const handleDelete = (cozyId: number) => {
    setGridSlots(slots => slots.map(slot => (slot?.id === cozyId ? null : slot)));
    setMenuOpenId(null);
  };

  const handleSaveRename = (cozyId: number, newName: string) => {
    setGridSlots(slots =>
      slots.map(slot => (slot?.id === cozyId ? { ...slot, name: newName } : slot))
    );
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleMenuClick = (cozyId: number) => {
    setMenuOpenId(prev => (prev === cozyId ? null : cozyId));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/Ambience" className={styles.backButtonLink}>
          &larr; voltar
        </Link>
        <p className={styles.pageInfo}>
          Você está na <strong>página de Cômodos</strong> do ambiente {environmentId}
        </p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Cômodos</h1>
          <span>*limite de até {MAX_COZYS} cômodos</span>
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
        <Link to="/devices">Ir para gerenciamento de dispositivos</Link>
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
