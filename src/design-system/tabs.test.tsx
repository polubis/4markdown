import React from 'react';
import { render } from '@testing-library/react';
import { Tabs } from './tabs';

describe(`Tabs works when:`, () => {
  it(`displays selection and items`, () => {
    const { asFragment } = render(
      <Tabs>
        <Tabs.Item active>First</Tabs.Item>
        <Tabs.Item>Second</Tabs.Item>
        <Tabs.Item>Last</Tabs.Item>
      </Tabs>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
