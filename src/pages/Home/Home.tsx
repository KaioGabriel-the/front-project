import React from "react";
import styles from "./Home.module.css";
import Profile from "../../components/Profile";
import Interactive from "../../components/Interactive";


const Home: React.FC = () => {
    return (
        <div className={styles.homeContainer}>
            <Profile name="Kaio Gabriel" email="kakhdhewi" />

            <div className={styles.cardsSection}>
                <Interactive
                    title="Ambientes"
                    linkUrl="/ambience"
                    imageUrl={"https://wallpapers.com/images/featured-full/fundo-da-area-de-trabalho-de-praia-x2m31cw9zoqs7tjv.jpg"}
                />
            </div>
        </div>
    );
};

export default Home;
