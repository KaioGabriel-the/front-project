// DevicesPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './Devices.module.css';
import AddDeviceModal from '../../components/AddDeviceModal';
import DeviceItem from '../../components/DeviceItem';
import ToastContainer, { type ToastData } from '../../components/ToastContainer';

const API_BASE_URL = 'https://home-automation-control-production.up.railway.app';

const MAX_DEVICES = 24;
const MAX_TOASTS = 5;

interface Device {
  id: number;
  name: string;
  status: 'ON' | 'OFF';
  roomId: number;
  roomName?: string;
}

const DevicesPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // -----------------------------
  // Estados
  // -----------------------------
  const [gridSlots, setGridSlots] = useState<(Device | null)[]>([]);
  const [roomName, setRoomName] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingDeviceId, setEditingDeviceId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [cooldownIds, setCooldownIds] = useState<Set<number>>(new Set());

  // -----------------------------
  // Toasts
  // -----------------------------
  const removeToast = useCallback((id: number) => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  const addToast = (message: string) => {
    const newToast: ToastData = { id: Date.now(), message };
    setToasts(current => [newToast, ...current].slice(0, MAX_TOASTS));
  };

  // -----------------------------
  // Buscar dispositivos
  // -----------------------------
  useEffect(() => {
    const fetchDevices = async () => {
      if (!roomId) return;

      try {
        const res = await fetch(`https://home-automation-control-production.up.railway.app/api/devices/room/${roomId}`);
        if (!res.ok) throw new Error('Erro ao buscar dispositivos');

        const data: { id: number; name: string; state: boolean; roomId: number }[] = await res.json();

        const filledSlots: (Device | null)[] = Array.from({ length: MAX_DEVICES }).map((_, i) => {
          if (!data[i]) return null;
          return {
            id: data[i].id,
            name: data[i].name,
            status: data[i].state ? 'ON' : 'OFF',
            roomId: data[i].roomId,
            roomName: `Cômodo ${data[i].roomId}`
          };
        });

        setGridSlots(filledSlots);
        if (data[0]) setRoomName(`Cômodo ${data[0].roomId}`);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDevices();
  }, [roomId]);

  // -----------------------------
  // Funções de manipulação de dispositivos
  // -----------------------------
  const handleOpenAddModal = (index: number) => {
    setSelectedSlotIndex(index);
    setIsAddModalOpen(true);
  };

  // -----------------------------
  // Adiciona um novo dispositivo no sistema
  // -----------------------------
  const handleAddNewDevice = async (name: string, status: 'ON' | 'OFF') => {
    if (selectedSlotIndex === null || !roomId) return;

    const isActive = status === 'ON';

    // Preparando o corpo da requisição, como a API espera
    const newDeviceData = {
      name: name,
      roomId: Number(roomId),
      active: isActive
    };

    try {
      // Chamada POST para a API
      const response = await fetch(`${API_BASE_URL}/api/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeviceData),
      });

      if (!response.ok) { // A API pode retornar 400 se o limite de 24 for excedido
        throw new Error('Falha ao criar o dispositivo. Limite excedido?');
      }

      // Dispositivo completo que a API criou e nos devolveu
      const createdDeviceFromApi: { id: number; name: string; state: boolean; roomId: number } = await response.json();

      // Atualizando o estado da tela com os dados da API
      setGridSlots(currentSlots => {
        const newSlots = [...currentSlots];
        // Coloca o novo dispositivo no slot que o usuário clicou
        newSlots[selectedSlotIndex] = {
          id: createdDeviceFromApi.id,
          name: createdDeviceFromApi.name,
          status: createdDeviceFromApi.state ? 'ON' : 'OFF', // Transforma o 'state' da API
          roomId: createdDeviceFromApi.roomId,
        };
        return newSlots;
      });
      
      addToast(`Dispositivo "${createdDeviceFromApi.name}" adicionado com sucesso!`);

    } catch (error) {
      console.error("Erro ao adicionar dispositivo:", error);
      addToast("Erro: Não foi possível adicionar o dispositivo.");
    } finally {
      // Limpa os estados do modal, independentemente do resultado
      setSelectedSlotIndex(null);
      setIsAddModalOpen(false);
    }
  };


  // -----------------------------
  // Atualiza ESTADO dos Dispositivos
  // -----------------------------
  const handleToggleState = async (deviceId: number) => {
    // Verifica e inicia o cooldown
    if (cooldownIds.has(deviceId)) return;
    setCooldownIds(prev => new Set(prev).add(deviceId));

    try {
      // Chamada PATCH para a API
      const response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        // Se a resposta não for de sucesso, lança um erro
        throw new Error('Falha ao alternar o estado do dispositivo');
      }

      // Pega o dispositivo atualizado que a API retornou
      const updatedDeviceFromApi: { id: number; name: string; state: boolean; roomId: number } = await response.json();

      // Atualiza o estado da tela com os dados vindos da API
      setGridSlots(currentSlots =>
        currentSlots.map(slot => {
          if (slot?.id === deviceId) {
            // Retorna o dispositivo com os dados atualizados, transformando 'state' para 'status'
            return {
              ...slot,
              name: updatedDeviceFromApi.name,
              status: updatedDeviceFromApi.state ? 'ON' : 'OFF',
            };
          }
          return slot;
        })
      );
      
      // Mostra o toast de sucesso
      const newStatus = updatedDeviceFromApi.state ? 'ligado' : 'desligado';
      addToast(`"${updatedDeviceFromApi.name}" agora está ${newStatus}`);

    } catch (error) {
      console.error("Erro ao alternar estado:", error);
      addToast("Erro: Não foi possível atualizar o dispositivo.");
    } finally {
      // Remove o dispositivo do cooldown após 2.5s, independentemente de sucesso ou falha
      setTimeout(() => {
        setCooldownIds(prev => {
          const next = new Set(prev);
          next.delete(deviceId);
          return next;
        });
      }, 2500);
    }
  };

  // -----------------------------
  // EXCLUI Dispositivos
  // -----------------------------
  const handleDeleteDevice = async (deviceId: number) => {
    // Buscando o nome do dispositivo para usar na notificação
    const deviceToDelete = gridSlots.find(slot => slot?.id === deviceId);
    const deviceName = deviceToDelete?.name;

    try {
      // Realizando a chamada DELETE para a API
      const response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir o dispositivo');
      }

      // Se a API confirmou a exclusão, a tela é atualizada
      setGridSlots(currentSlots => 
        currentSlots.map(slot => (slot?.id === deviceId ? null : slot))
      );

      if (deviceName) {
        addToast(`Dispositivo "${deviceName}" foi excluído.`);
      }

    } catch (error) {
      console.error("Erro ao excluir dispositivo:", error);
      addToast("Erro: Não foi possível excluir o dispositivo.");
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleMenuClick = (deviceId: number) => {
    setEditingDeviceId(null);
    setOpenMenuId(prev => (prev === deviceId ? null : deviceId));
  };

  const handleRenameDevice = (deviceId: number) => {
    setEditingDeviceId(deviceId);
    setOpenMenuId(null);
  };


  // -----------------------------
  // RENOMEIA Dispositivos
  // -----------------------------
  const handleSaveRename = async (deviceId: number, newName: string) => {
    // Encontra o dispositivo para pegar o roomId
    const deviceToUpdate = gridSlots.find(slot => slot?.id === deviceId);
    if (!deviceToUpdate) return; // Se não encontrar, não faz nada

    // Prepara o corpo da requisição
    const body = {
      name: newName,
      roomId: deviceToUpdate.roomId,
      active: deviceToUpdate.status === 'ON'
    };

    try {
      // Faz a chamada PUT para a API
      const response = await fetch(`${API_BASE_URL}/api/devices/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Falha ao renomear o dispositivo');
      }

      // Pega a resposta da API com os dados atualizados
      const updatedDeviceFromApi: { id: number; name: string; state: boolean; roomId: number } = await response.json();

      // Atualiz a tela com os dados confirmados pelo servidor
      setGridSlots(currentSlots =>
        currentSlots.map(slot => {
          if (slot?.id === deviceId) {
            return {
              ...slot,
              name: updatedDeviceFromApi.name,
              status: updatedDeviceFromApi.state ? 'ON' : 'OFF',
            };
          }
          return slot;
        })
      );
      
      addToast(`Dispositivo renomeado para "${newName}"`);

    } catch (error) {
      console.error("Erro ao renomear dispositivo:", error);
      addToast("Erro: Não foi possível renomear o dispositivo.");
    } finally {
      setEditingDeviceId(null);
    }
  };

  const handleCancelRename = () => {
    setEditingDeviceId(null);
  };

  const handleSelectDevice = (deviceId: number) => {
    navigate(`/device/${deviceId}`);
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={`/cozy/${roomId}`} className={styles.backButtonLink}>
          &larr; voltar
        </Link>
        <p className={styles.roomInfo}>
          Você está no cômodo <strong>{roomName || roomId}</strong>
        </p>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.legendContainer}>
          <span>Estado dos dispositivos:</span>
          <span className={`${styles.legendItem} ${styles.onItem}`}>Ligado</span>
          <span className={`${styles.legendItem} ${styles.offItem}`}>Desligado</span>
        </div>

        <div className={styles.titleWrapper}>
          <h1>Gerenciar Dispositivos</h1>
          <span>*limite de até {MAX_DEVICES} dispositivos</span>
        </div>

        <div className={styles.deviceGrid}>
          {gridSlots.map((device, index) => (
          <DeviceItem
          key={device ? `device-${device.id}` : `slot-${index}`}
          index={index}
          device={device ? { ...device, roomName: device.roomName ?? `Cômodo ${device.roomId}` } : undefined}
          isEditing={editingDeviceId === device?.id}
          isMenuOpen={openMenuId === device?.id && editingDeviceId !== device?.id}
          onAddClick={handleOpenAddModal}
          onToggleState={handleToggleState}
          onMenuClick={handleMenuClick}
          onRename={handleRenameDevice}
          onDelete={handleDeleteDevice}
          onSaveRename={handleSaveRename}
          onCancelRename={handleCancelRename}
          onSelect={() => device?.id && handleSelectDevice(device.id)}
        />

          ))}
        </div>
      </main>
      
      <footer className={styles.footer}>
        <Link to="/scene" className={styles.footerLink}>
          Ir para criação de cena
        </Link>
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
