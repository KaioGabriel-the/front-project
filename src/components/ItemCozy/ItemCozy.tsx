import styles from "./ItemCozy.module.css";
import OptionsMenu from "../OptionsMenu/OptionsMenu";

export interface Cozy {
  id: number;
  name: string;
}

interface ItemCozyProps {
  cozy?: Cozy;
  index: number;
  isEditing?: boolean;
  isMenuOpen?: boolean;
  onAddClick?: (index: number) => void;
  onMenuClick?: (cozyId: number) => void;
  onRename: (cozyId: number) => void;
  onDelete: (cozyId: number) => void;
  onSaveRename: (cozyId: number, newName: string) => void;
  onCancelRename: () => void;
}

const ItemCozy = (props: ItemCozyProps) => {
  const { cozy, index, isEditing, isMenuOpen, ...actions } = props;

  return (
    <div className={styles.gridItem}>
      {cozy ? (
        isEditing ? (
          <input
            className={styles.editInput}
            type="text"
            defaultValue={cozy.name}
            autoFocus
            onBlur={(e) => actions.onSaveRename(cozy.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") actions.onSaveRename(cozy.id, (e.target as HTMLInputElement).value);
              if (e.key === "Escape") actions.onCancelRename();
            }}
          />
        ) : (
          <>
            <div className={styles.cozyName} title={cozy.name}>{cozy.name}</div>
            <button className={styles.menuButton} onClick={() => actions.onMenuClick?.(cozy.id)}>&#x2261;</button>
            {isMenuOpen && (
              <OptionsMenu
                onRename={() => actions.onRename(cozy.id)}
                onDelete={() => actions.onDelete(cozy.id)}
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

export default ItemCozy;
