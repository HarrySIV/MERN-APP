import React from 'react';

import styles from './Input.module.css';

const Input = (props) => {
  const element =
    props.element === 'input' ? (
      <input id={props.id} type={props.type} placeholder={props.placeholder} />
    ) : (
      <textarea id={props.id} row={props.rows || 3} />
    );

  return (
    <div className={`${styles.formcontrol}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
