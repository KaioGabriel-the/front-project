import { useState } from "react";
import styles from './EditDeviceForm.module.css'

interface EditDeviceFormProps {
    currentName: string;
    onSave: (newName: string) => void;
    onCancel: () => void;
}

const EditDeviceForm = ({currentName, onSave, onCancel}: EditDeviceFormProps) => {
    const [newName, setNewName] = useState(currentName);

    const handleSave = () => {
        if (newName.trim()) {
            onSave(newName.trim());
        }
    };

    return (
        <div className={styles.editFormContainer}>   <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className={styles.editInput} />
            <button type="button" onClick={handleSave} className={`${styles.btn} ${styles.saveBtn}`}> Salvar </button>
            <button type="button" onClick={onCancel} className={`${styles.btn} ${styles.cancelBtn}`}> Cancelar </button>
        </div>
    );
};

export default EditDeviceForm;