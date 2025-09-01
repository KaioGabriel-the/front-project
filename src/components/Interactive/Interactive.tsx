import React from "react";
import { Link } from "react-router-dom";
import styles from "./Interactive.module.css";

interface InteractiveProps {
    title: string;
    imageUrl: string;
    linkUrl: string;
}

const Interactive: React.FC<InteractiveProps> = ({ title, imageUrl, linkUrl }) => {
    return (
      <div className={styles.interactiveContainer}>
        <Link to={linkUrl}>
            <div>
            <img src={imageUrl} alt="" />
            <h2>{title}</h2>
            </div>
        </Link>
    </div>
    );
};

export default Interactive;