import { type Device } from '../../pages/Devices/mock';
import styles from './DeviceItem.module.css';

interface DeviceItemProps {
  device?: Device; 
  onAddClick?: (index: number) => void;
  index: number;
  onToggleState?: (deviceId: number) => void;
}

const DeviceItem = ({ device, onAddClick, index, onToggleState }: DeviceItemProps) => {
  return (
    <div className={styles.gridItem}>
      {device ? (
        // Se a prop 'device' EXISTE, renderiza o item preenchido
        <>
          <div className={`${styles.deviceName} ${device.status === 'OFF' ? styles.isOff : ''}`} title={device.name} onClick={() => onToggleState?.(device.id)}> {device.name} </div>
          <button className={styles.menuButton}> &#x2261; </button>
        </>
      ) : (
        // Se a prop 'device' NÃO EXISTE, renderiza o espaço para adicionar
        <button className={styles.addButton} onClick={() => onAddClick?.(index)}> + </button>
      )}
    </div>
  );
};

export default DeviceItem;