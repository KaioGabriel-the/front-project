import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Scene.module.css";
import ItemScene from "../../components/ItemScene/ItemScene";
import AddSceneModal from "../../components/AddSceneModal/AddSceneModal";

const MAX_SCENES = 12;

export interface Scene {
  id: number;
  name: string;
}

const ScenesPage = () => {
  const initialState = Array.from({ length: MAX_SCENES }).map(() => null);
  const [gridSlots, setGridSlots] = useState<(Scene | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Abrir modal de adicionar
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  // Adicionar nova cena
  const handleAddNewScene = (name: string) => {
    if (selectedSlotIndex === null) return;

    const newScene: Scene = { id: Date.now(), name };
    setGridSlots(slots => {
      const newSlots = [...slots];
      newSlots[selectedSlotIndex] = newScene;
      return newSlots;
    });

    setSelectedSlotIndex(null);
    setIsAddModalOpen(false);
  };

  // Funções de edição, exclusão e menu
  const handleRename = (sceneId: number) => { setEditingId(sceneId); setMenuOpenId(null); };
  const handleDelete = (sceneId: number) => { setGridSlots(slots => slots.map(slot => slot?.id === sceneId ? null : slot)); setMenuOpenId(null); };
  const handleSaveRename = (sceneId: number, newName: string) => { setGridSlots(slots => slots.map(slot => slot?.id === sceneId ? { ...slot, name: newName } : slot)); setEditingId(null); };
  const handleCancelRename = () => { setEditingId(null); };
  const handleMenuClick = (sceneId: number) => { setMenuOpenId(prev => prev === sceneId ? null : sceneId); };

  // Ao clicar na cena, navegar para outra página (ex: detalhes da cena)
  const handleSceneClick = (sceneId: number) => {
    navigate(`/scene/${sceneId}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/cozy" className={styles.backButtonLink}>&larr; voltar</Link>
        <p className={styles.pageInfo}>Você está na <strong>página de Cenas</strong></p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Cenas</h1>
          <span>*limite de até {MAX_SCENES} cenas</span>
        </div>

        <div className={styles.sceneGrid}>
          {gridSlots.map((scene, index) => (
            <div
              key={index}
              onClick={() => scene && handleSceneClick(scene.id)}
            >
              <ItemScene
                index={index}
                scene={scene || undefined}
                isEditing={editingId === scene?.id}
                isMenuOpen={menuOpenId === scene?.id}
                onAddClick={handleOpenAddModal}
                onMenuClick={handleMenuClick}
                onRename={handleRename}
                onDelete={handleDelete}
                onSaveRename={handleSaveRename}
                onCancelRename={handleCancelRename}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <Link to="/devices">Ir para gerenciamento de dispositivos</Link>
      </footer>

      <AddSceneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewScene}
      />
    </div>
  );
};

export default ScenesPage;
