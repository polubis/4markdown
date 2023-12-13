import { Button } from 'design-system/button';
import React, { useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
{
  /* <a
href="https://greenonsoftware.com/articles/"
target="_blanl"
title="GreenOn Software learning platform"
rel="noopener"
>
<Button i={2} rfull>
  <BiBook className="text-2xl" />
</Button>
</a> */
}
const More = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Navigation"
        onClick={() => setOpened(!opened)}
      >
        <BiMenu className="text-2xl" />
      </Button>
      {opened && (
        <aside className="bg-zinc-200 dark:bg-gray-950 border-l-2 border-zinc-300 dark:border-zinc-800 fixed top-0 right-0 h-full w-[260px] overflow-y-auto">
          <div className="p-4 flex items-center">
            <img
              src="/favicon-32x32.png"
              alt="4Markdown"
              title="4Markdown - Online Markdown Editor"
            />
            <p className="text-xl ml-3 font-medium">4Markdown</p>
            <Button
              className="ml-auto"
              i={2}
              rfull
              title="Close navigation"
              onClick={() => setOpened(false)}
            >
              <BiX className="text-2xl" />
            </Button>
          </div>
        </aside>
      )}
    </>
  );
};

export default More;
