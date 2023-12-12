import React from 'react';

interface MetaProps {
  title: string;
  appName: string;
  description: string;
  url: string;
  lang: string;
}

const Meta = ({ title, appName, description, url, lang }: MetaProps) => {
  return (
    <>
      {/* General */}
      <title lang={lang}>{title}</title>
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1"
      />
      <meta name="theme-color" content="#000000" />
      <meta name="twitter:app:name:iphone" content={appName} />
      <meta property="al:ios:app_name" content={appName} />
      <meta property="al:android:app_name" content={appName} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={title} />
      {/* Ogs */}
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={appName} />
      <meta property="og:title" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {/* Other */}
      <meta name="parsely-link" content={url} />
      <meta name="parsely-title" content={title} />
      <link rel="canonical" href={url} />
    </>
  );
};

export default Meta;
