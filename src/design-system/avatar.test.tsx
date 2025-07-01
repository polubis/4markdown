import { expect } from "@jest/globals";
import { render } from "@testing-library/react";
import React from "react";
import { Avatar } from "./avatar";

describe(`Avatar can be used when`, () => {
	it(`renders character when image is not available but character is given`, () => {
		const { asFragment } = render(
			<Avatar alt="User avatar" char="1" size="lg" />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it(`renders image if given and skips character display`, () => {
		const { asFragment } = render(
			<Avatar alt="User avatar" src="https://" char="1" size="lg" />,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it(`renders icon if no src and character`, () => {
		const { asFragment } = render(<Avatar alt="User avatar" size="lg" />);

		expect(asFragment()).toMatchSnapshot();
	});

	it(`renders different sizes`, () => {
		const { asFragment, rerender } = render(
			<Avatar alt="User avatar" size="tn" />,
		);

		expect(asFragment()).toMatchSnapshot();

		rerender(<Avatar alt="User avatar" size="sm" />);

		expect(asFragment()).toMatchSnapshot();

		rerender(<Avatar alt="User avatar" size="md" />);

		expect(asFragment()).toMatchSnapshot();

		rerender(<Avatar alt="User avatar" size="lg" />);

		expect(asFragment()).toMatchSnapshot();
	});
});
