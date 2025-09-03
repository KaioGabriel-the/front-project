import React from "react";
import styles from "./Home.module.css";
import Profile from "../../components/Profile";
import Interactive from "../../components/Interactive";
import imgAmbience from "../../assets/home_work.png";

const Home: React.FC = () => {
    return (
        <div className={styles.homeContainer}>
            <Profile name="Kaio Gabriel" email="kakhdhewi" />

            <div className={styles.cardsSection}>
                <Interactive
                    title="Ambientes"
                    linkUrl="/ambience"
                    imageUrl={imgAmbience}
                />
                <Interactive
                    title="Ambientes"
                    linkUrl="/scene"
                    imageUrl={imgAmbience}
                />
            </div>
        </div>
    );
};

export default Home;
