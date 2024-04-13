import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiMenu } from 'react-icons/bi';
import MenuNavSidebar from './menu-nav-sidebar';

const MoreNav = () => {
  const menu = useToggle();

  return (
    <>
      <Button i={1} s={2} title="Navigation" onClick={menu.toggle}>
        <BiMenu />
      </Button>
      <MenuNavSidebar opened={menu.opened} onClose={menu.close} />
    </>
  );
};

export default MoreNav;
