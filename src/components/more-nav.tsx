import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiMenu } from 'react-icons/bi';

const MenuNavSidebar = React.lazy(() => import(`./menu-nav-sidebar`));

const MoreNav = () => {
  const menu = useToggle();

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Navigation"
        onClick={menu.toggle}
      >
        <BiMenu className="text-2xl" />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <MenuNavSidebar onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default MoreNav;
