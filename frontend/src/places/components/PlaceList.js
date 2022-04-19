import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import styles from './PlaceList.module.css';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';

const PlaceList = (props) => {
  if (!props.items.length) {
    return (
      <div className={`${styles.placelist} center`}>
        <Card>
          <h2>No places found. Try creating one!</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles.placelist}>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
