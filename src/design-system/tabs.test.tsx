import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tabs } from "./tabs";
import { expect } from "@jest/globals";

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

  it(`may be disabled`, () => {
    const spy = jest.fn();

    const { asFragment, rerender } = render(
      <Tabs>
        <Tabs.Item active disabled>
          First
        </Tabs.Item>
        <Tabs.Item onClick={spy} disabled>
          Second
        </Tabs.Item>
        <Tabs.Item disabled>Last</Tabs.Item>
      </Tabs>,
    );

    expect(asFragment()).toMatchSnapshot();

    fireEvent.click(screen.getByText(/Second/));

    expect(spy).toHaveBeenCalledTimes(0);

    rerender(
      <Tabs>
        <Tabs.Item active>First</Tabs.Item>
        <Tabs.Item onClick={spy}>Second</Tabs.Item>
        <Tabs.Item>Last</Tabs.Item>
      </Tabs>,
    );

    fireEvent.click(screen.getByText(/Second/));

    expect(spy).toHaveBeenCalledTimes(1);

    expect(asFragment()).toMatchSnapshot();
  });
});
