import styles from "./ItemScene.module.css";
import OptionsMenu from "../OptionsMenu/OptionsMenu";
import { useNavigate } from "react-router-dom";

export interface Scene {
  id: number;
  name: string;
}

interface ItemSceneProps {
  scene?: Scene;
  index: number;
  isEditing?: boolean;
  isMenuOpen?: boolean;
  onAddClick?: (index: number) => void;
  onMenuClick?: (sceneId: number) => void;
  onRename: (sceneId: number) => void;
  onDelete: (sceneId: number) => void;
  onSaveRename: (sceneId: number, newName: string) => void;
  onCancelRename: () => void;
}

const ItemScene = (props: ItemSceneProps) => {
  const { scene, index, isEditing, isMenuOpen, ...actions } = props;
  const navigate = useNavigate();

  const handleSceneClick = () => {
    if (scene && !isEditing && !isMenuOpen) {
      navigate(`/scene/${scene.id}`);
    }
  };

  return (
    <div className={styles.gridItem}>
      {scene ? (
        isEditing ? (
          <input
            className={styles.editInput}
            type="text"
            defaultValue={scene.name}
            autoFocus
            onBlur={(e) => actions.onSaveRename(scene.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.onSaveRename(scene.id, (e.target as HTMLInputElement).value);
              if (e.key === "Escape") actions.onCancelRename();
            }}
          />
        ) : (
          <>
            <div
              className={styles.sceneName}
              title={scene.name}
              onClick={handleSceneClick} // clique na cena
              style={{ cursor: "pointer" }}
            >
              {scene.name}
            </div>
            <button className={styles.menuButton} onClick={() => actions.onMenuClick?.(scene.id)}>&#x2261;</button>
            {isMenuOpen && (
              <OptionsMenu
                onRename={() => actions.onRename(scene.id)}
                onDelete={() => actions.onDelete(scene.id)}
              />
            )}
          </>
        )
      ) : (
        <button className={styles.addButton} onClick={() => actions.onAddClick?.(index)}>+</button>
      )}
    </div>
  );
};

export default ItemScene;
