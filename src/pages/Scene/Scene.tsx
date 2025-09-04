// ScenesPage.tsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./Scene.module.css";
import ItemScene from "../../components/ItemScene/ItemScene";
import AddSceneModal from "../../components/AddSceneModal/AddSceneModal";

export interface Scene {
  id: number;
  name: string;
  active: boolean;
  environmentId: number;
  actions: {
    id: number;
    deviceId: number;
    actionType: string;
    orderIndex: number;
    intervalSeconds: number;
  }[];
}

const MAX_SCENES = 12;

const ScenesPage = () => {
  const { environmentId } = useParams<{ environmentId: string }>();
  const navigate = useNavigate();

  const initialState = Array.from({ length: MAX_SCENES }).map(() => null);
  const [gridSlots, setGridSlots] = useState<(Scene | null)[]>(initialState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // 🔹 Fetch de cenas
  useEffect(() => {
    const fetchScenes = async () => {
      if (!environmentId) return;
      try {
        const res = await fetch(
          `https://home-automation-control-production.up.railway.app/api/scenes/environment/${environmentId}`
        );
        if (!res.ok) throw new Error("Erro ao buscar cenas");

        const data: Scene[] = await res.json();
        const filledSlots = Array.from({ length: MAX_SCENES }).map(
          (_, i) => data[i] || null
        );
        setGridSlots(filledSlots);
      } catch (error) {
        console.error(error);
      }
    };
    fetchScenes();
  }, [environmentId]);

  // Abrir modal de adicionar
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  // Adicionar nova cena
  const handleAddNewScene = (scene: { name: string; deviceIds: number[] }) => {
  if (selectedSlotIndex === null) return;

  const newScene: Scene = {
    id: Date.now(),
    name: scene.name,
    active: true,
    environmentId: Number(environmentId),
    actions: scene.deviceIds.map((deviceId, index) => ({
      id: Date.now() + index, // pode gerar id único
      deviceId,
      actionType: "TURN_ON",
      orderIndex: index,
      intervalSeconds: 0,
    })),
  };

  setGridSlots(slots => {
    const newSlots = [...slots];
    newSlots[selectedSlotIndex] = newScene;
    return newSlots;
  });

  setSelectedSlotIndex(null);
  setIsAddModalOpen(false);
};

  // Funções de edição/exclusão/menu
  const handleRename = (sceneId: number) => { setEditingId(sceneId); setMenuOpenId(null); };
  const handleDelete = (sceneId: number) => { setGridSlots(slots => slots.map(slot => slot?.id === sceneId ? null : slot)); setMenuOpenId(null); };
  const handleSaveRename = (sceneId: number, newName: string) => { setGridSlots(slots => slots.map(slot => slot?.id === sceneId ? { ...slot, name: newName } : slot)); setEditingId(null); };
  const handleCancelRename = () => { setEditingId(null); };
  const handleMenuClick = (sceneId: number) => { setMenuOpenId(prev => prev === sceneId ? null : sceneId); };

  const handleSceneClick = (sceneId: number) => { navigate(`/scene/${sceneId}`); };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={`/cozy/${environmentId}`} className={styles.backButtonLink}>
          &larr; voltar
        </Link>
        <p className={styles.pageInfo}>
          Você está na <strong>página de Cenas</strong>
        </p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Cenas</h1>
          <span>*limite de até {MAX_SCENES} cenas</span>
        </div>

        <div className={styles.sceneGrid}>
          {gridSlots.map((scene, index) => (
            <div key={index} onClick={() => scene && handleSceneClick(scene.id)}>
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
        <Link to={`/cozy/${environmentId}`}>Ir para gerenciamento de cômodos</Link>
      </footer>

      <AddSceneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewScene}
        environmentId={Number(environmentId)}
      />
    </div>
  );
};

export default ScenesPage;
