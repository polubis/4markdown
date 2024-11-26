import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatorView from '../creator.view';
import { expect } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import { storeFixture } from 'development-kit/store-fixture';
import { useDocumentsCreatorState } from 'store/documents-creator';

describe(`Creator view works when: `, () => {
  it(`during typing in creator tabs are replaced with 4 spaces`, async () => {
    const creatorStore = storeFixture(
      useDocumentsCreatorState,
      useDocumentsCreatorState.getInitialState(),
    );

    const { unmount } = render(<CreatorView />);

    const textarea = screen.getByLabelText(/creator/) as HTMLTextAreaElement;

    textarea.focus();
    await userEvent.tab();
    await userEvent.type(textarea, `Content`);

    expect(textarea.value).toBe(`    Content`);

    unmount();

    creatorStore.restore();
  });
});
