import React, { useContext } from 'react';
import styles from './NavLinks.module.css';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import Auth from '../../../user/pages/Auth';

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className={styles.navlinks}>
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={ /${auth.userId}/places}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}{' '}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && <button onClick={auth.logout}>LOGOUT</button>}
    </ul>
  );
};

export default NavLinks;
