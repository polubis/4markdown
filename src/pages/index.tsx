import React from 'react';
import { useStaticQuery, type HeadFC, graphql } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import type { SiteMetadata } from 'models/queries';
import Meta from 'components/meta';
import {
  siteMetadatStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import {
  createInitialCode,
  useCreatorStore,
} from 'store/creator/creator.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface HomePageQuery {
  site: {
    siteMetadata: SiteMetadata;
  };
}

const useHomePageQuery = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery<HomePageQuery>(graphql`
    query HomePageQuery {
      site {
        siteMetadata {
          appName
          siteUrl
          description
          title
          company
          lang
          companyUrl
          discordUrl
          linkedInUrl
          sourceCodeUrl
          fbGroupUrl
          ytChannelUrl
          grammarlyUrl
          ytVideoTutorialUrl
        }
      }
    }
  `);

  return siteMetadata;
};

const HomePage: React.FC = () => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        // value={age}
        // label="Age"
        // onChange={handleChange}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default HomePage;

export const Head: HeadFC = () => {
  const meta = siteMetadatStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
