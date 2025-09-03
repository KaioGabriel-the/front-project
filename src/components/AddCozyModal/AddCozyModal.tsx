import { useState, useEffect } from "react";
import styles from "./AddCozyModal.module.css";

interface AddCozyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddCozyModal: React.FC<AddCozyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Novo Cômodo</h2>

        <div className={styles.formGroup}>
          <label htmlFor="name">Nome do Cômodo</label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Ex: Sala de Estar, Quarto..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCozyModal;
