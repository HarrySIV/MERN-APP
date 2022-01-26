import React from 'react';
import styles from './UsersList.module.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';

const UsersList = (props) => {
  if (!props.items.length)
    return (
      <div className="center">
        <Card>
          <h2>No Users found.</h2>
        </Card>
      </div>
    );
  return (
    <ul className={styles.userslist}>
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};

export default UsersList;
