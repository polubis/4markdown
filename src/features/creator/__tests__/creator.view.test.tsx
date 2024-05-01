import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatorView from '../creator.view';
import { expect } from '@jest/globals';
import { storeFixture } from '../../../__tests__/store-fixture';
import { useSiteMetadataStore } from 'store/site-metadata/site-metadata.store';
import { siteMetadata } from '../../../../site-metadata';
import { useCreatorStore } from 'store/creator/creator.store';
import userEvent from '@testing-library/user-event';

describe(`Creator view works when: `, () => {
  it(`during typing in creator tabs are replaced with 4 spaces`, async () => {
    const siteMetadataStore = storeFixture(useSiteMetadataStore, {
      is: `ready`,
      ...siteMetadata,
    });
    const creatorStore = storeFixture(useCreatorStore, {
      is: `ready`,
      initialCode: ``,
      code: ``,
      changed: false,
    });

    const { unmount } = render(<CreatorView />);

    const textarea = screen.getByLabelText(/creator/) as HTMLTextAreaElement;

    textarea.focus();
    await userEvent.tab();
    await userEvent.type(textarea, `Content`);

    expect(textarea.value).toBe(`    Content`);

    unmount();

    siteMetadataStore.restore();
    creatorStore.restore();
  });
});
