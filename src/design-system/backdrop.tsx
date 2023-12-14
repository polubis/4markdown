import React from 'react';

interface BackdropProps {
  onClick(): void;
}

const Backdrop = ({ onClick }: BackdropProps) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 dark:bg-white/20"
      onClick={onClick}
    />
  );
};

export default Backdrop;
