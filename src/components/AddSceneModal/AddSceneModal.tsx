import { useEffect, useState } from "react";
import styles from "./AddSceneModal.module.css";

interface Device {
  deviceId: number;
  name: string;
}

interface Room {
  roomName: string;
  devices: Device[];
}

interface AddSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  environmentId: number;
  onSave?: (scene: { name: string; deviceIds: number[] }) => void; // novo
}

const AddSceneModal = ({ isOpen, onClose, environmentId, onSave }: AddSceneModalProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Set<number>>(new Set());
  const [sceneName, setSceneName] = useState("");
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar cômodos + dispositivos
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://home-automation-control-production.up.railway.app/api/environments/${environmentId}/devices-by-room`
        );
        if (!res.ok) throw new Error("Erro ao buscar dispositivos");
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os dispositivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, environmentId]);

  // 🔹 Resetar estado ao fechar modal
  useEffect(() => {
    if (!isOpen) {
      setSceneName("");
      setSelectedDevices(new Set());
      setExpandedRooms(new Set());
    }
  }, [isOpen]);

  // 🔹 Selecionar / desselecionar dispositivo
  const toggleDevice = (deviceId: number) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  // 🔹 Expandir / colapsar cômodos
  const toggleRoom = (roomName: string) => {
    setExpandedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomName)) {
        newSet.delete(roomName);
      } else {
        newSet.add(roomName);
      }
      return newSet;
    });
  };

  const handleSaveScene = async () => {
  if (!sceneName.trim()) {
    alert("Dê um nome para a cena!");
    return;
  }

  if (selectedDevices.size === 0) {
    alert("Selecione pelo menos 1 dispositivo.");
    return;
  }

  const sceneData = {
    name: sceneName,
    deviceIds: Array.from(selectedDevices),
  };

  try {
    if (onSave) {
      // Se a prop onSave foi passada, chama ela
      onSave(sceneData);
    } else {
      // Senão, faz o POST internamente
      const body = {
        name: sceneName,
        environmentId,
        actions: Array.from(selectedDevices).map((deviceId, index) => ({
          deviceId,
          actionType: "TURN_ON",
          orderIndex: index,
          intervalSeconds: 0,
        })),
      };

      const response = await fetch(
        "https://home-automation-control-production.up.railway.app/api/scenes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      alert("Cena criada com sucesso!");
    }

    // Fecha o modal
    onClose();
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar cena.");
  }
};

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Criar Nova Cena</h2>

        <input
          type="text"
          placeholder="Nome da cena"
          value={sceneName}
          onChange={(e) => setSceneName(e.target.value)}
          className={styles.input}
        />

        {loading ? (
          <p>Carregando dispositivos...</p>
        ) : (
          <div className={styles.roomsList}>
            {rooms.map((room) => (
              <div key={room.roomName} className={styles.roomBlock}>
                <div
                  className={styles.roomHeader}
                  onClick={() => toggleRoom(room.roomName)}
                >
                  <span>{room.roomName}</span>
                  <button className={styles.expandButton}>
                    {expandedRooms.has(room.roomName) ? "▼" : "▶"}
                  </button>
                </div>

                {expandedRooms.has(room.roomName) && (
                  <ul className={styles.devicesList}>
                    {room.devices.map((device) => (
                      <li key={device.deviceId}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedDevices.has(device.deviceId)}
                            onChange={() => toggleDevice(device.deviceId)}
                          />
                          {device.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Cancelar
          </button>
          <button onClick={handleSaveScene} className={styles.save}>
            Salvar Cena
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSceneModal;
