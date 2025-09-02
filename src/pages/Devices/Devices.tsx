// src/pages/Devices/Devices.tsx
import { mockDevices } from './mock';
import styles from './Devices.module.css';

const MAX_DEVICES = 24;

const DevicesPage = () => {
  const currentRoom = "Quarto Principal";

  const deviceGridItems = Array.from({ length: MAX_DEVICES }).map((_, index) => {
    return mockDevices[index];
  });

  return (
    <div className={styles.container}>
      {/* MUDANÇA: O texto do cômodo foi movido para o header */}
      <header className={styles.header}>
        <button className={styles.backButton}>&larr; voltar</button>
        <p className={styles.roomInfo}>Você está no cômodo "<strong>{currentRoom}</strong>"</p>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.titleWrapper}>
          <h1>Gerenciar Dispositivos</h1>
          <span>*limite de até 24 dispositivos</span>
        </div>

        <div className={styles.deviceGrid}>
          {deviceGridItems.map((device, index) => (
            <div key={index} className={styles.gridItem}>
              {device ? (
                <>
                  <div className={styles.deviceName}>{device.name}</div>
                  <button className={styles.menuButton}>&#x2261;</button>
                </>
              ) : (
                <button className={styles.addButton}>+</button>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#">Ir para criação de cena</a>
      </footer>
    </div>
  );
};

export default DevicesPage;