// AmbiencesPage.tsx
import { useState, useEffect } from 'react';
import styles from './Ambience.module.css';
import AddAmbienceModal from '../../components/AddAmbienteModal';
import ItemAmbience from "../../components/ItemAmbience/ItemAmbience";
import { Link, useNavigate } from 'react-router-dom';

const MAX_AMBIENCES = 12;

export interface Ambience {
  id: number;
  name: string;
  address?: string; // opcional, porque a API retorna também
}

const AmbiencesPage = () => {
  const initialState = Array.from({ length: MAX_AMBIENCES }).map(() => null);
  const [gridSlots, setGridSlots] = useState<(Ambience | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  // -----------------------------
  // Consumir API quando o componente carregar
  // -----------------------------
  useEffect(() => {
    const fetchAmbiences = async () => {
      try {
        const response = await fetch(
          'https://home-automation-control-production.up.railway.app/api/environments'
        );
        const data: Ambience[] = await response.json();

        // Preencher os slots com os dados da API
        setGridSlots(prev => {
          const newSlots = [...prev];
          data.forEach((ambience, index) => {
            if (index < MAX_AMBIENCES) {
              newSlots[index] = ambience;
            }
          });
          return newSlots;
        });
      } catch (error) {
        console.error('Erro ao carregar ambientes:', error);
      }
    };

    fetchAmbiences();
  }, []);

  // -----------------------------
  // Funções de adicionar/editar/excluir
  // -----------------------------
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewAmbience = async (name: string, address: string = '') => {
    if (selectedSlotIndex === null) return;

      try {
        const response = await fetch(
          'https://home-automation-control-production.up.railway.app/api/environments',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, address }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao criar ambiente: ${response.statusText}`);
        }

        const newAmbience: Ambience = await response.json();

        // Atualiza a grid local
        setGridSlots(slots => {
          const newSlots = [...slots];
          newSlots[selectedSlotIndex] = newAmbience;
          return newSlots;
        });

        setSelectedSlotIndex(null);
        setIsAddModalOpen(false);

      } catch (error) {
        console.error(error);
        alert('Não foi possível criar o ambiente. Tente novamente.');
      }
    };


    const handleRename = (ambienceId: number) => {
      setEditingId(ambienceId);
      setMenuOpenId(null);
    };

   const handleSaveRename = async (ambienceId: number, newName: string, newAddress: string = '') => {
    try {
      const response = await fetch(
        `https://home-automation-control-production.up.railway.app/api/environments/${ambienceId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, address: newAddress }),
        }
      );

      if (!response.ok) throw new Error(`Erro ao atualizar: ${response.statusText}`);

      const updatedAmbience: Ambience = await response.json();

      // Atualiza a grid local
      setGridSlots(slots =>
        slots.map(slot => (slot?.id === ambienceId ? updatedAmbience : slot))
      );

      setEditingId(null);
      setMenuOpenId(null);

    } catch (error) {
      console.error(error);
      alert('Não foi possível atualizar o ambiente. Tente novamente.');
    }
  };


    const handleDelete = async (ambienceId: number) => {
    try {
      const response = await fetch(
        `https://home-automation-control-production.up.railway.app/api/environments/${ambienceId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao deletar: ${response.statusText}`);
      }

      // Atualiza o estado local apenas se a API deletou com sucesso
      setGridSlots(slots => slots.map(slot => slot?.id === ambienceId ? null : slot));
      setMenuOpenId(null);
    } catch (error) {
      console.error('Erro ao deletar ambiente:', error);
      alert('Não foi possível excluir o ambiente. Tente novamente.');
    }
  };


  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleMenuClick = (ambienceId: number) => {
    setMenuOpenId(prev => (prev === ambienceId ? null : ambienceId));
  };

  const handleSelectAmbience = (ambienceId: number) => {
    navigate(`/cozy/${ambienceId}`);
  };

  // -----------------------------
  // Render
  // -----------------------------
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
            onSelect={() => ambience?.id && handleSelectAmbience(ambience.id)}
          />
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <Link to="/home">Ir para o home</Link>
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
