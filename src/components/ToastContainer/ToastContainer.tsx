import Toast from '../Toast';
import styles from './ToastContainer.module.css';

// A forma que os dados de cada toast deve ter
export interface ToastData {
  id: number;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastData[]; // Recebe a lista de toasts
  onClose: (id: number) => void; // Recebe a função para fechar um toast
}

const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;