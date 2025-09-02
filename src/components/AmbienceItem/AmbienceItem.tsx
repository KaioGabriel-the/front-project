import React, { useState } from "react";
import OptionsMenu from "../OptionsMenu";
import styles from "./AmbienceItem.module.css";

interface AmbienceProps {
  ambience: { id: number; name: string };
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const AmbienceItem: React.FC<AmbienceProps> = ({
  ambience,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(ambience.name);

  const handleSave = () => {
    if (newName.trim()) {
      onRename(ambience.id, newName.trim());
      setIsEditing(false);
    }
  };

  return (
    <li className={styles.item}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <button className={styles.saveBtn} onClick={handleSave}>
            Salvar
          </button>
          <button
            className={styles.cancelBtn}
            onClick={() => {
              setNewName(ambience.name);
              setIsEditing(false);
            }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <span>{ambience.name}</span>
          <OptionsMenu
            onRename={() => setIsEditing(true)}
            onDelete={() => onDelete(ambience.id)}
          />
        </>
      )}
    </li>
  );
};

export default AmbienceItem;
