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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);

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
    setSelectedSlotIndex(null);
  };

  const handleToggleState = (deviceId: number) => {
    setGridSlots(currentSlots => {
      const newSlots = [...currentSlots];
      const deviceIndex = newSlots.findIndex(slot => slot?.id === deviceId);
      if (deviceIndex !== -1 && newSlots[deviceIndex]) {
        const updatedDevice = { ...newSlots[deviceIndex]! };
        updatedDevice.status = updatedDevice.status === 'ON' ? 'OFF' : 'ON';
        newSlots[deviceIndex] = updatedDevice;
      }
      return newSlots;
    });
  };
  
  const handleDeleteDevice = (deviceId: number) => {
    setGridSlots(currentSlots => {
      const newSlots = [...currentSlots];
      const deviceIndex = newSlots.findIndex(slot => slot?.id === deviceId);
      if (deviceIndex !== -1) {
        newSlots[deviceIndex] = null;
      }
      return newSlots;
    });
    setOpenMenuId(null);
  };

  const handleMenuClick = (deviceId: number) => {
    setEditingDeviceId(null);
    setOpenMenuId(prevId => (prevId === deviceId ? null : deviceId));
  };
  
  const handleRenameDevice = (deviceId: number) => {
    setEditingDeviceId(deviceId);
    setOpenMenuId(null);
  };

  const handleSaveRename = (deviceId: number, newName: string) => {
    setGridSlots(currentSlots => {
      const newSlots = [...currentSlots];
      const deviceIndex = newSlots.findIndex(slot => slot?.id === deviceId);
      if (deviceIndex !== -1 && newSlots[deviceIndex]) {
        const updatedDevice = { ...newSlots[deviceIndex]!, name: newName };
        newSlots[deviceIndex] = updatedDevice;
      }
      return newSlots;
    });
    setEditingDeviceId(null);
  };

  const handleCancelRename = () => {
    setEditingDeviceId(null);
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
              // MUDANÇA: Chave mais robusta
              key={device ? `device-${device.id}` : `slot-${index}`}
              index={index}
              device={device || undefined}
              isEditing={editingDeviceId === device?.id}
              isMenuOpen={openMenuId === device?.id && editingDeviceId !== device?.id}
              onAddClick={handleOpenAddModal}
              onToggleState={handleToggleState}
              onMenuClick={handleMenuClick}
              onRename={handleRenameDevice}
              onDelete={handleDeleteDevice}
              onSaveRename={handleSaveRename}
              onCancelRename={handleCancelRename}
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