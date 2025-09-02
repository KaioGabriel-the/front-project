import styles from './ItemAmbience.module.css';

interface ItemAmbienceProps {
    Ambience?: { name: string };
    onAddClick?: (index: number) => void;
    index: number;
};

const ItemAmbience = ({ Ambience, onAddClick, index }: ItemAmbienceProps) => {
    return (
        <div className={styles.gridItem}>
            {Ambience ? (
                // Se a prop 'Ambience' EXISTE, renderiza o item preenchido
                <>
                    <div className={styles.AmbienceName} title={Ambience.name}> {Ambience.name} </div>
                    <button className={styles.menuButton}> &#x2261; </button>
                </>
            ) : (
                // Se a prop 'Ambience' NÃO EXISTE, renderiza o espaço para adicionar
                <button className={styles.addButton} onClick={() => onAddClick?.(index)}> + </button>
            )}
        </div>
    );
}

export default ItemAmbience;