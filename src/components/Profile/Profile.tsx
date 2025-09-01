import React from "react";
import styles from "./Profile.module.css";
import defaultProfilePic from "../../assets/home_work.png";

interface ProfileProps {
    name: string;
    email: string;
    imgUrl?: string;
}

const Profile: React.FC<ProfileProps> = ({ name, email, imgUrl = defaultProfilePic}) => {
    return (
        <div className={styles.profile}>
            <img src={imgUrl} alt="" />
            <h2>{name}</h2>
            <p>{email}</p>
        </div>
    );
}

export default Profile;