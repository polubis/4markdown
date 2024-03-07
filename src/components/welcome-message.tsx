import React from 'react';

function WelcomeMessage({ msg }) {
  return (
    <div className="mt-24 text-center">
      <h1 className="text-4xl bold">{msg}</h1>
    </div>
  );
}

export default WelcomeMessage;
