import styles from './OptionsMenu.module.css';

interface OptionsMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

const OptionsMenu = ({ onRename, onDelete }: OptionsMenuProps) => {
  return (
    <div className={styles.menuContainer}>
      <button type="button" className={styles.menuOption} onClick={onRename}>
        ✏️ Renomear
      </button>
      <button type="button" className={styles.menuOption} onClick={onDelete}>
        🗑️ Excluir
      </button>
    </div>
  );
};

export default OptionsMenu;