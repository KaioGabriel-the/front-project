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
}

const ItemAmbience = (props: ItemAmbienceProps) => {
  const { ambience, index, isEditing, isMenuOpen, ...actions } = props;

  return (
    <div className={styles.gridItem}>
      {ambience ? (
        isEditing ? (
          <input
            className={styles.editInput}
            type="text"
            defaultValue={ambience.name}
            autoFocus
            onBlur={(e) => actions.onSaveRename(ambience.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                actions.onSaveRename(ambience.id, (e.target as HTMLInputElement).value);
              }
              if (e.key === "Escape") {
                actions.onCancelRename();
              }
            }}
          />
        ) : (
          <>
            <div className={styles.ambienceName} title={ambience.name}>
              {ambience.name}
            </div>
            <button
              className={styles.menuButton}
              onClick={() => actions.onMenuClick?.(ambience.id)}
            >
              &#x2261;
            </button>
            {isMenuOpen && (
              <OptionsMenu
                onRename={() => actions.onRename(ambience.id)}
                onDelete={() => actions.onDelete(ambience.id)}
              />
            )}
          </>
        )
      ) : (
        <button
          className={styles.addButton}
          onClick={() => actions.onAddClick?.(index)}
        >
          +
        </button>
      )}
    </div>
  );
};

export default ItemAmbience;
