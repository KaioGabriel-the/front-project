// CozyPage.tsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import styles from "./Cozy.module.css";
import AddCozyModal from "../../components/AddCozyModal";
import AddSceneModal from "../../components/AddSceneModal";
import ItemCozy from "../../components/ItemCozy";

const MAX_COZYS = 12;

interface Cozy {
  id: number;
  name: string;
}

const CozyPage = () => {
  const { environmentId } = useParams<{ environmentId: string }>();
  const navigate = useNavigate();

  // Estados principais
  const [gridSlots, setGridSlots] = useState<(Cozy | null)[]>([]);
  const [isAddCozyModalOpen, setIsAddCozyModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isAddSceneModalOpen, setIsAddSceneModalOpen] = useState(false);

  // Estados para edição/menu
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Fetch de cômodos
  useEffect(() => {
    const fetchCozy = async () => {
      if (!environmentId) return;
      try {
        const res = await fetch(
          `https://home-automation-control-production.up.railway.app/api/rooms/environment/${environmentId}`
        );
        if (!res.ok) throw new Error("Erro ao buscar cômodos");

        const data: Cozy[] = await res.json();
        const filledSlots = Array.from({ length: MAX_COZYS }).map(
          (_, i) => data[i] || null
        );
        setGridSlots(filledSlots);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCozy();
  }, [environmentId]);

  // Handlers grid de cômodos
  const handleSelectCozy = (cozyId: number) => navigate(`/devices/${cozyId}`);

  const handleOpenAddCozyModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddCozyModalOpen(true);
  };

  const handleAddNewCozy = async (name: string) => {
    if (selectedSlotIndex === null || !environmentId) return;
    try {
      const response = await fetch(
        "https://home-automation-control-production.up.railway.app/api/rooms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, environmentId: Number(environmentId) }),
        }
      );
      if (!response.ok) throw new Error(`Erro ao criar cômodo: ${response.statusText}`);

      const newCozy: Cozy = await response.json();
      setGridSlots((slots) => {
        const newSlots = [...slots];
        newSlots[selectedSlotIndex] = newCozy;
        return newSlots;
      });

      setSelectedSlotIndex(null);
      setIsAddCozyModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Não foi possível criar o cômodo. Tente novamente.");
    }
  };

  // Handlers edição/menu
  const handleRename = (cozyId: number) => { setEditingId(cozyId); setMenuOpenId(null); };
  const handleDelete = async (cozyId: number) => {
    try {
      const response = await fetch(
        `https://home-automation-control-production.up.railway.app/api/rooms/${cozyId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(`Erro ao deletar: ${response.statusText}`);

      setGridSlots((slots) => slots.map((slot) => (slot?.id === cozyId ? null : slot)));
      setMenuOpenId(null);
    } catch (error) {
      console.error(error);
      alert("Não foi possível excluir o cômodo. Tente novamente.");
    }
  };
  const handleSaveRename = async (cozyId: number, newName: string) => {
    if (!environmentId) return;
    try {
      const response = await fetch(
        `https://home-automation-control-production.up.railway.app/api/rooms/${cozyId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, environmentId: Number(environmentId) }),
        }
      );
      if (!response.ok) throw new Error(`Erro ao renomear: ${response.statusText}`);

      const updatedCozy: Cozy = await response.json();
      setGridSlots((slots) =>
        slots.map((slot) => (slot?.id === cozyId ? updatedCozy : slot))
      );
      setEditingId(null);
      setMenuOpenId(null);
    } catch (error) {
      console.error(error);
      alert("Não foi possível atualizar o cômodo. Tente novamente.");
    }
  };
  const handleCancelRename = () => setEditingId(null);
  const handleMenuClick = (cozyId: number) => setMenuOpenId((prev) => (prev === cozyId ? null : cozyId));

  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link to="/ambience" className={styles.backButtonLink}>
          &larr; voltar
        </Link>
        <p className={styles.pageInfo}>
          Você está na <strong>página de Cômodos</strong> do ambiente {environmentId}
        </p>
      </header>

      {/* Main */}
      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Cômodos</h1>
          <span>*limite de até {MAX_COZYS} cômodos</span>
        </div>

        {/* Grid de cômodos */}
        <div className={styles.cozyGrid}>
          {gridSlots.map((cozy, index) => (
            <ItemCozy
              key={index}
              index={index}
              cozy={cozy || undefined}
              isEditing={editingId === cozy?.id}
              isMenuOpen={menuOpenId === cozy?.id}
              onAddClick={handleOpenAddCozyModal}
              onMenuClick={handleMenuClick}
              onRename={handleRename}
              onDelete={handleDelete}
              onSaveRename={handleSaveRename}
              onCancelRename={handleCancelRename}
              onSelect={() => cozy?.id && handleSelectCozy(cozy.id)}
            />
          ))}
        </div>

        {/* Botões */}
        <div className={styles.buttonsWrapper}>
          <button
            className={styles.openSceneButton}
            onClick={() => setIsAddSceneModalOpen(true)}
          >
            Criar Nova Cena
          </button>

          {/* Novo botão para gerenciar cenas */}
          <button
            className={styles.manageScenesButton}
            onClick={() => navigate(`/scenes/${environmentId}`)}
          >
            Gerenciar Cenas
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link to="/ambience">Ir para gerenciamento de ambientes</Link>
      </footer>

      {/* Modais */}
      <AddCozyModal
        isOpen={isAddCozyModalOpen}
        onClose={() => setIsAddCozyModalOpen(false)}
        onSave={handleAddNewCozy}
      />
      <AddSceneModal
        isOpen={isAddSceneModalOpen}
        onClose={() => setIsAddSceneModalOpen(false)}
        environmentId={Number(environmentId)}
      />
    </div>
  );
};

export default CozyPage;
