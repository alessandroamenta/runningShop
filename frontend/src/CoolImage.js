import React from 'react';
import styles from './CoolImage.module.css';

const CoolImage = () => {
  return (
    <div className={styles.coolImageContainer}>
      <img
        src="https://media.alltricks.com/landing-pages//20180719_nike_UNIVERS_PAGE_MARQUE.jpg"
        alt="Cool Running Shoes"
        className={styles.coolImage}
      />
    </div>
  );
};

export default CoolImage;
