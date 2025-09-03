import { useState, useCallback } from 'react';
import { type Device, mockDevices } from './mock';
import styles from './Devices.module.css';
import AddDeviceModal from '../../components/AddDeviceModal';
import DeviceItem from '../../components/DeviceItem';
import ToastContainer, { type ToastData } from '../../components/ToastContainer';
import { Link } from 'react-router-dom';

const MAX_DEVICES = 24;
const MAX_TOASTS = 5;

const DevicesPage = () => {
  const currentRoom = "Quarto Principal";
  const initialState = Array.from({ length: MAX_DEVICES }).map((_, index) => mockDevices[index] || null);

  const [gridSlots, setGridSlots] = useState<(Device | null)[]>(initialState);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [cooldownIds, setCooldownIds] = useState<Set<number>>(new Set());

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = (message: string) => {
    const newToast: ToastData = {
      id: Date.now(), // ID único
      message,
    };

    // Adiciona o novo toast e garante o limite de 5
    setToasts(currentToasts => {
      const newToasts = [newToast, ...currentToasts];
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(0, MAX_TOASTS); // Mantém apenas os 5 mais recentes
      }
      return newToasts;
    });
  };

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
    addToast(`Dispositivo "${name}" adicionado com sucesso!`)
  };

  const handleToggleState = (deviceId: number) => {
    if (cooldownIds.has(deviceId)){
      return;
    }

    // Encontra o dispositivo e descobre o novo estado
    const currentDevice = gridSlots.find(slot => slot?.id === deviceId);
    if (!currentDevice) return; // Se não achar o dispositivo, não faz nada

    const newStatus = currentDevice.status === 'ON' ? 'desligado' : 'ligado';
    const deviceName = currentDevice.name;

    // Adicionando o ID ao cooldown antes da atualização
    setCooldownIds(prev => new Set(prev).add(deviceId));

    setGridSlots(currentSlots => 
      currentSlots.map(slot => {
        if (slot?.id === deviceId) {
          // Retorna uma cópia do dispositivo com o status invertido
          return { ...slot, status: slot.status === 'ON' ? 'OFF' : 'ON' };
        }
        return slot;
      })
    );

    addToast(`"${deviceName}" agora está ${newStatus}`);

    // Agenda a remoção do Cooldown
    setTimeout(() => {
      setCooldownIds(prev => {
        const next = new Set(prev);
        next.delete(deviceId);
        return next;
      });
    }, 2500) // Mesmo tempo definido no Toast
  };
  
  const handleDeleteDevice = (deviceId: number) => {
    // Encontra o nome do dispositivo antes de qualquer coisa
    const deviceToDelete = gridSlots.find(slot => slot?.id === deviceId);
    const deviceName = deviceToDelete?.name;

    // Agenda a atualização do estado
    setGridSlots(currentSlots => 
      currentSlots.map(slot => (slot?.id === deviceId ? null : slot))
    );

    setOpenMenuId(null);
    
    // Chama o addToast
    if (deviceName) {
      addToast(`Dispositivo "${deviceName}" foi excluído.`);
    }
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

    addToast(`Dispositivo renomeado para "${newName}"`);
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

        <div className={styles.legendContainer}>
          <span>Estado dos dispositivos:</span>
          <span className={`${styles.legendItem} ${styles.onItem}`}>Ligado</span>
          <span className={`${styles.legendItem} ${styles.offItem}`}>Desligado</span>
        </div>

        <div className={styles.titleWrapper}>
          <h1>Gerenciar Dispositivos</h1>
          <span>*limite de até 24 dispositivos</span>
        </div>

        <div className={styles.deviceGrid}>
          {gridSlots.map((device, index) => (
            <DeviceItem 
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

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <AddDeviceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddNewDevice}
      />
    </div>
  );
};

export default DevicesPage;