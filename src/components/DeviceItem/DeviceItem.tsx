import { type Device } from '../../pages/Devices/mock';
import styles from './DeviceItem.module.css';

interface DeviceItemProps {
  device?: Device; 
  onAddClick?: (index: number) => void;
  index: number;
}

const DeviceItem = ({ device, onAddClick, index }: DeviceItemProps) => {
  return (
    <div className={styles.gridItem}>
      {device ? (
        // Se a prop 'device' EXISTE, renderiza o item preenchido
        <>
          <div className={styles.deviceName} title={device.name}> {device.name} </div>
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