import React from 'react';

interface MetaProps {
  title: string;
  appName: string;
  description: string;
  url: string;
  lang: string;
  image: string;
  keywords?: string;
  robots?: string;
  prevUrl?: string;
  nextUrl?: string;
}

const Meta = ({
  title,
  appName,
  description,
  url,
  lang,
  image,
  keywords,
  prevUrl,
  nextUrl,
  robots = `index,follow,max-image-preview:large`,
}: MetaProps) => {
  return (
    <>
      {/* General */}
      <html lang={lang} />
      <title lang={lang}>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <meta property="al:ios:app_name" content={appName} />
      <meta property="al:android:app_name" content={appName} />
      <meta name="robots" content={robots} />
      {/* Twitter */}
      <meta name="twitter:app:name:iphone" content={appName} />
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
      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}
      <link rel="canonical" href={url} />
      {/* Images */}
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta name="msapplication-TileImage" content={image} />
      <meta name="twitter:image" content={image} />
    </>
  );
};

export default Meta;
