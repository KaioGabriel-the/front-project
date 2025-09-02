import { useState } from 'react';
import { type Device, mockDevices } from './mock';
import styles from './Devices.module.css';
import AddDeviceModal from '../../components/AddDeviceModal';
import DeviceItem from '../../components/DeviceItem';
import { Link } from 'react-router-dom';

const MAX_DEVICES = 24;

const DevicesPage = () => {
  const currentRoom = "Quarto Principal";

  // CORREÇÃO: "length" em vez de "lenght"
  const initialState = Array.from({ length: MAX_DEVICES }).map((_, index) => mockDevices[index] || null);
  
  // Este é nosso único estado para controlar o grid
  const [gridSlots, setGridSlots] = useState<(Device | null)[]>(initialState);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  // REMOVIDO: O estado [devices, setDevices] não é mais necessário.

  const handleAddNewDevice = (name: string, state: 'ON' | 'OFF') => {
    if (selectedSlotIndex === null) return;

    const newDevice: Device = {
      id: Date.now(),
      name: name,
      status: state,
      roomName: currentRoom
    };
    
    // ATUALIZAÇÃO: Agora atualizamos apenas o estado 'gridSlots'
    setGridSlots(currentSlots => {
      const newSlots = [...currentSlots];
      newSlots[selectedSlotIndex] = newDevice;
      return newSlots;
    });
  
    setSelectedSlotIndex(null); // Limpa o índice para o próximo clique
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* SUGESTÃO: Reutilizando a classe do botão que já existe */}
        <Link to="/home" className={styles.backButtonLink}> 
          &larr; voltar
        </Link>
        <p className={styles.roomInfo}>Você está no cômodo <strong>{currentRoom}</strong></p>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Dispositivos</h1>
          <span>*limite de até 24 dispositivos</span>
        </div>

        <div className={styles.deviceGrid}>
          {gridSlots.map((device, index) => (
            <DeviceItem 
              key={index}
              index={index}
              device={device || undefined}
              onAddClick={handleOpenAddModal} 
            />
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#">Ir para criação de cena</a>
      </footer>

      <AddDeviceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddNewDevice}
      />
    </div>
  );
};

export default DevicesPage;