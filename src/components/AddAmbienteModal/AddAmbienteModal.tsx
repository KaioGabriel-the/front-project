import { useState, useEffect } from "react";
import styles from "./AddAmbienteModal.module.css";

interface AddAmbienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, address: string) => void;
}

const AddAmbienceModal: React.FC<AddAmbienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // limpa os inputs quando o modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setName("");
      setAddress("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !address.trim()) return;
    onSave(name, address);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Novo Ambiente</h2>

        <div className={styles.formGroup}>
          <label htmlFor="name">Nome do Ambiente</label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Ex: Casa, Loja..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Endereço</label>
          <input
            id="address"
            type="text"
            value={address}
            placeholder="Ex: Rua das Flores, 123"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!name.trim() || !address.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAmbienceModal;
