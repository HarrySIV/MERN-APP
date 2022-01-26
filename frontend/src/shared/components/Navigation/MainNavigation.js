import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import styles from './MainNavigation.module.css';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className={styles.mainnavigation__drawernav}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className={styles.mainnavigation__menubtn} onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className={styles.mainnavigation__title}>
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className={styles.mainnavigation__headernav}>
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
