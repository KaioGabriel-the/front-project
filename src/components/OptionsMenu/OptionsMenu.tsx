import React from "react";
import styles from "./OptionsMenu.module.css";

interface OptionsMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onRename, onDelete }) => {
  return (
    <details className={styles.menu}>
      <summary className={styles.trigger}>⋮</summary>
      <div className={styles.dropdown}>
        <button onClick={onRename} className={styles.option}>
          ✏️ Renomear
        </button>
        <button onClick={onDelete} className={`${styles.option} ${styles.delete}`}>
          🗑️ Excluir
        </button>
      </div>
    </details>
  );
};

export default OptionsMenu;
