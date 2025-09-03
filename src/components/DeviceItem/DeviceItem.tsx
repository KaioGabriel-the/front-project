import { type Device } from '../../pages/Devices/mock';
import styles from './DeviceItem.module.css';
import OptionsMenu from '../OptionsMenu';
import EditDeviceForm from '../EditDeviceForm';

interface DeviceItemProps {
  device?: Device;
  index: number;
  isEditing?: boolean;
  isMenuOpen?: boolean;
  roomName?: string; // deixa opcional
  onAddClick?: (index: number) => void;
  onToggleState?: (deviceId: number) => void;
  onMenuClick?: (deviceId: number) => void;
  onRename: (deviceId: number) => void;
  onDelete: (deviceId: number) => void;
  onSaveRename: (deviceId: number, newName: string) => void;
  onCancelRename: () => void;
  onSelect?: () => void;
}

const DeviceItem = ({
  device,
  index,
  isEditing = false,
  isMenuOpen = false,
  onAddClick,
  onToggleState,
  onMenuClick,
  onRename,
  onDelete,
  onSaveRename,
  onCancelRename,
  // onSelect,
}: DeviceItemProps) => {

  // Render do dispositivo existente
  const renderDevice = () => {
    if (!device) return null;

    if (isEditing) {
      return (
        <EditDeviceForm
          currentName={device.name}
          onSave={(newName) => onSaveRename(device.id, newName)}
          onCancel={onCancelRename}
        />
      );
    }

    return (
      <>
        <div
          className={`${styles.deviceName} ${device.status === 'OFF' ? styles.isOff : ''}`}
          title={device.name}
          onClick={() => {
            onToggleState?.(device.id);
            // onSelect?.(); // chama também o onSelect se existir
          }}
        >
          {device.name}
        </div>

        <button className={styles.menuButton} onClick={() => onMenuClick?.(device.id)}>
          &#x2261;
        </button>

        {isMenuOpen && (
          <OptionsMenu
            onRename={() => onRename(device.id)}
            onDelete={() => onDelete(device.id)}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.gridItem}>
      {device ? renderDevice() : (
        <button className={styles.addButton} onClick={() => onAddClick?.(index)}>
          +
        </button>
      )}
    </div>
  );
};

export default DeviceItem;
