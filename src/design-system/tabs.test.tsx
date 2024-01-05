import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from './tabs';

describe(`Tabs works when:`, () => {
  it(`displays selection and items`, () => {
    const spy = jest.fn();

    const { asFragment } = render(
      <Tabs>
        <Tabs.Item active>First</Tabs.Item>
        <Tabs.Item onClick={spy}>Second</Tabs.Item>
        <Tabs.Item>Last</Tabs.Item>
      </Tabs>,
    );

    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(screen.getByText(/Second/));

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
