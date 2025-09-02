import { type Device } from '../../pages/Devices/mock';
import styles from './DeviceItem.module.css';
import OptionsMenu from '../OptionsMenu';
import EditDeviceForm from '../EditDeviceForm';

interface DeviceItemProps {
  device?: Device; 
  index: number;
  isEditing?: boolean
  isMenuOpen?: boolean;
  onAddClick?: (index: number) => void;
  onToggleState?: (deviceId: number) => void;
  onMenuClick?: (deviceId: number) => void;
  onRename: (deviceId: number) => void;
  onDelete: (deviceId: number) => void;
  onSaveRename: (deviceId: number, newName: string) => void;
  onCancelRename: () => void;
}

const DeviceItem = (props: DeviceItemProps) => {
  const { device, index, isEditing, isMenuOpen, ...actions } = props;

  return (
    <div className={styles.gridItem}>
      {device ? (
        // Se o dispositivo existe, verifica se está em modo de edição
        isEditing ? (
          <EditDeviceForm
            currentName={device.name}
            onSave={(newName) => actions.onSaveRename(device.id, newName)}
            onCancel={actions.onCancelRename}
          />
        ) : (
          <>
            <div
              className={`${styles.deviceName} ${device.status === 'OFF' ? styles.isOff : ''}`}
              title={device.name}
              onClick={() => actions.onToggleState?.(device.id)}
            >
              {device.name}
            </div>
            <button className={styles.menuButton} onClick={() => actions.onMenuClick?.(device.id)}>
              &#x2261;
            </button>
            {isMenuOpen && (
              <OptionsMenu
                onRename={() => actions.onRename(device.id)}
                onDelete={() => actions.onDelete(device.id)}
              />
            )}
          </>
        )
      ) : (
        // Se não existe, é um botão de adicionar
        <button className={styles.addButton} onClick={() => actions.onAddClick?.(index)}>+</button>
      )}
    </div>
  );
};

export default DeviceItem;