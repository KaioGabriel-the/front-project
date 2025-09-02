import { useState } from 'react';
import styles from './AddDeviceModal.module.css';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, state: 'ON' | 'OFF') => void;
}

const AddDeviceModal = ({ isOpen, onClose, onSave }: AddDeviceModalProps) => {
    const [deviceName, setDeviceName] = useState('');
    const [initialState, setInitialState] = useState<'ON' | 'OFF'> ('ON');
  
    const handleSave = () => {
      if (deviceName.trim() === '') return; // Dispositivo sem nome não passa
      onSave(deviceName, initialState);
      handleClose();
    }

    const handleClose = () => {
        setDeviceName('');
        setInitialState('ON');
        onClose();
    }
    
  if (!isOpen) {
    return null; // Se não estiver aberto, não renderiza nada
  }
  
  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Adicionar Novo Dispositivo</h2>
        
        {/* Formulário */}
        <div className={styles.formGroup}>
          <label htmlFor="deviceName">Nome do Dispositivo</label>
          <input
            type="text"
            id="deviceName"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Ex: Alexa"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Estado Inicial</label>
          <div className={styles.radioGroup}>
            <button type="button"
              className={`${styles.radioBtn} ${initialState === 'ON' ? styles.active : ''}`}
              onClick={() => setInitialState('ON')}>
              Ligado
            </button>
            <button type="button"
              className={`${styles.radioBtn} ${initialState === 'OFF' ? styles.active : ''}`}
              onClick={() => setInitialState('OFF')}>
              Desligado
            </button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={handleClose}>Cancelar</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={!deviceName.trim()}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;