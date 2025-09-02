import { useState } from 'react';
import styles from './AddAmbienteModal.module.css';

interface AddAmbienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddAmbienceModal = ({ isOpen, onClose, onSave }: AddAmbienceModalProps) => {
  const [ambienceName, setAmbienceName] = useState('');

  const handleSave = () => {
    if (ambienceName.trim() === '') return; // Ambiente sem nome não passa
    onSave(ambienceName);
    handleClose();
  };

  const handleClose = () => {
    setAmbienceName('');
    onClose();
  };

  if (!isOpen) {
    return null; // Se não estiver aberto, não renderiza nada
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Adicionar Novo Ambiente</h2>

        <div className={styles.formGroup}>
          <label htmlFor="ambienceName">Nome do Ambiente</label>
          <input
            type="text"
            id="ambienceName"
            value={ambienceName}
            onChange={(e) => setAmbienceName(e.target.value)}
            placeholder="Ex: Sala, Escritório, Quarto..."
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={handleClose}>
            Cancelar
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!ambienceName.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAmbienceModal;
