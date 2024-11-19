import React, { useState } from 'react';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
interface TabProps {
  label?: string;
  children: React.ReactNode;
  setRemovedTabs: React.Dispatch<React.SetStateAction<string[]>>;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface TabsProps {
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tab-headers flex space-x-2">
        {React.Children.map(children, (child, index) => {
          const labelFromChild = (child as React.ReactElement<TabProps>).props
            .label;

          return (
            <Button
              i={2}
              s={2}
              auto
              type="button"
              className={c(
                activeTab === index ? `!text-white` : `!text-gray-400`,
                `group relative  pr-8`,
              )}
              onClick={() => setActiveTab(index)}
            >
              {labelFromChild}
              <BiX
                onClick={() => {
                  if (labelFromChild) {
                    (
                      child as React.ReactElement<TabProps>
                    ).props.setRemovedTabs((prev) => [...prev, labelFromChild]);
                  }
                }}
                className=" group-hover:block hidden transition-all duration-200 ease hover:text-white text-gray-400 absolute top-1/2 right-1 -translate-y-1/2 "
              />
            </Button>
          );
        })}
      </div>
      <div className="tab-content mt-4">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export { Tabs, Tab };
