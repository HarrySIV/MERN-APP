import React from 'react';

import styles from './NewPlace.module.css';
import Input from '../../shared/components/FormElements/Input';

const NewPlace = () => {
  return (
    <form className={styles.placeform}>
      <Input element="input" type="text" label="Title" validators={[]} />
    </form>
  );
};

export default NewPlace;
