import { useState } from 'react';
import { type Device, mockDevices } from './mock';
import styles from './Devices.module.css';
import AddDeviceModal from '../../components/AddDeviceModal';
import DeviceItem from '../../components/DeviceItem';
import { Link } from 'react-router-dom';

const MAX_DEVICES = 24;

const DevicesPage = () => {
  const currentRoom = "Quarto Principal";


  const initialState = Array.from({ length: MAX_DEVICES }).map((_, index) => mockDevices[index] || null);

  const [gridSlots, setGridSlots] = useState<(Device | null)[]>(initialState);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  const handleAddNewDevice = (name: string, state: 'ON' | 'OFF') => {
    if (selectedSlotIndex === null) return;

    const newDevice: Device = {
      id: Date.now(),
      name: name,
      status: state,
      roomName: currentRoom
    };
    
    setGridSlots(currentSlots => {
      const newSlots = [...currentSlots];
      newSlots[selectedSlotIndex] = newDevice;
      return newSlots;
    });
  
    setSelectedSlotIndex(null); // Limpa o índice para o próximo clique
  };

  /*Função que altera o estado do dispositivo*/
  const handleToggleState = (deviceId: number) => {
    setGridSlots(currentSlots => {
      // Cria uma nova cópia do array para não modificar o estado diretamente
      const newSlots = [...currentSlots];
      
      // Encontra o índice do dispositivo que foi clicado
      const deviceIndex = newSlots.findIndex(slot => slot?.id === deviceId);

      // Se o dispositivo foi encontrado
      if (deviceIndex !== -1 && newSlots[deviceIndex]) {
        // Cria uma cópia do dispositivo para modificar
        const updatedDevice = { ...newSlots[deviceIndex]! };
        // Inverte o estado atual
        updatedDevice.status = updatedDevice.status === 'ON' ? 'OFF' : 'ON';
        // Coloca o dispositivo atualizado de volta no array
        newSlots[deviceIndex] = updatedDevice;
      }
      
      return newSlots;
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
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
              onToggleState={handleToggleState} 
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