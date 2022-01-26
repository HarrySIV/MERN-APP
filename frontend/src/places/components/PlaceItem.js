import React from 'react';

import styles from './PlaceItem.module.css';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button/Button';

const PlaceItem = (props) => {
  return (
    <li className={styles.placeitem}>
      <Card className={styles.placeitem__content}>
        <div className={styles.placeitem__image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={styles.placeitem__info}>
          <h2>{props.title}</h2>
          <h3>{props.address}</h3>
          <p>{props.description}</p>
        </div>
        <div className={styles.placeitem__actions}>
          <Button inverse>VIEW ON MAP</Button>
          <Button to={`/places/${props.id}`}>EDIT</Button>
          <Button danger>DELETE</Button>
        </div>
      </Card>
    </li>
  );
};

export default PlaceItem;
