import { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    id: number;
  message: string; // A mensagem a ser exibida
  onClose: (id:number) => void; // A função a ser chamada para remover o toast
  duration?: number; // Tempo de vida opcional em milissegundos
}

const Toast = ({ id, message, onClose, duration = 2500 }: ToastProps) => {

  useEffect(() => {
    // Timer que vai chamar a função 'onClose' depois de 'duration' milissegundos.
    const timerId = setTimeout(() => onClose(id), duration);

    // Função de '"limpeza'. Que evita bugs
    return () => {
      clearTimeout(timerId);
    };
  }, [id, onClose, duration]);

  return (
    <div className={styles.toast}>
      <p className={styles.message}>{message}</p>
      <div 
        className={styles.timerBar} 
        style={{ animationDuration: `${duration}ms` }}
      ></div>
    </div>
  );
};

export default Toast;