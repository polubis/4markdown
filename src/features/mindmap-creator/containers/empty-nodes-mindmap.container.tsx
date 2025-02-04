import React from 'react';
import { Button } from 'design-system/button';
import { BiAddToQueue } from 'react-icons/bi';

const EmptyNodesMindmapContainer = () => {
  return (
    <section className="h-full flex items-center justify-center">
      <Button i={2} s={2} auto title="Add your first node">
        Add Your First Node <BiAddToQueue className="ml-1" />
      </Button>
    </section>
  );
};

export { EmptyNodesMindmapContainer };
