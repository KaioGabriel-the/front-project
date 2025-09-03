import { useNavigate } from "react-router-dom";
import styles from "./ItemAmbience.module.css";
import OptionsMenu from "../OptionsMenu/OptionsMenu";

interface Ambience {
  id: number;
  name: string;
}

interface ItemAmbienceProps {
  ambience?: Ambience;
  index: number;
  isEditing?: boolean;
  isMenuOpen?: boolean;
  onAddClick?: (index: number) => void;
  onMenuClick?: (ambienceId: number) => void;
  onRename: (ambienceId: number) => void;
  onDelete: (ambienceId: number) => void;
  onSaveRename: (ambienceId: number, newName: string) => void;
  onCancelRename: () => void;
  onSelect?: (ambienceId: number) => void;
}

const ItemAmbience = ({
  ambience,
  index,
  isEditing,
  isMenuOpen,
  onAddClick,
  onMenuClick,
  onRename,
  onDelete,
  onSaveRename,
  onCancelRename,
  onSelect,
}: ItemAmbienceProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (ambience) {
      if (onSelect) {
        onSelect(ambience.id); // permite controle pelo pai
      } else {
        navigate(`/ambience/${ambience.id}`); // fallback
      }
    }
  };

  if (!ambience) {
    return (
      <div className={styles.gridItem}>
        <button className={styles.addButton} onClick={() => onAddClick?.(index)}>
          +
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gridItem}>
      {isEditing ? (
        <input
          className={styles.editInput}
          type="text"
          defaultValue={ambience.name}
          autoFocus
          onBlur={(e) => onSaveRename(ambience.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSaveRename(ambience.id, (e.target as HTMLInputElement).value);
            }
            if (e.key === "Escape") {
              onCancelRename();
            }
          }}
        />
      ) : (
        <>
          <div
            className={styles.ambienceName}
            title={ambience.name}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            {ambience.name}
          </div>

          <button
            className={styles.menuButton}
            onClick={() => onMenuClick?.(ambience.id)}
          >
            &#x2261;
          </button>

          {isMenuOpen && (
            <OptionsMenu
              onRename={() => onRename(ambience.id)}
              onDelete={() => onDelete(ambience.id)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ItemAmbience;
