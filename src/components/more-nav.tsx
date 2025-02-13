import { Button } from 'design-system/button';
import React from 'react';
import { BiMenu } from 'react-icons/bi';
import MenuNavSidebar from './menu-nav-sidebar';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const MoreNav = () => {
  const menu = useSimpleFeature();

  return (
    <>
      <Button i={1} s={2} title="Navigation" onClick={menu.toggle}>
        <BiMenu />
      </Button>
      <MenuNavSidebar opened={menu.isOn} onClose={menu.off} />
    </>
  );
};

export default MoreNav;
