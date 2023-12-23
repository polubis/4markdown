
## The platform overview

We'll have two versions of platform - one for PL and other for EN. It requires from us two separate domains
or sub domains.

There will be at least 2 themes supported by Tailwind - dark/light. Every component should be displayed well on both.

### The article structure model design

We'll store articles with required metadata in Firebase. Then, during deploy, we'll perform
and request, and generate static pages based on data in Firebase.

The calls will be done via #Lambda, to avoid providing important logic connected with Firebase
on frontend.

```ts
interface Article {
  slug: string[]; // F.e [react-working-with-zustand] // minimum 1 element, system blocks from duplicating slugs.
  id: string; // ID generated on the fly from slugs.
  cdate: string; // Creation date.
  edate: string; // Edit date.
  tags: string[]; // F.e React, Angular, ...etc (max 10 tags)
  title: string; // Title of article. 50 and 70 // checks title for Google best practices https://support.google.com/webmasters/answer/35624?hl=en
  content: string; // The md based article content
  readTime: number; // Automatically detected by content size.
  lang: 'en' | 'pl'; // The language of article.
  thumbnail: string; // Src to thumbnail token.
  description: string; // Added to SEO tag and as intro to article - in list view. 110 - 160 characters.
  resources_path?: string; // If specified, user need only to add file names.
  authorId: string; // The reference to the author id of signed in user.
  // visibility: 'Public' | 'Private' | string[]; // All may see an article, or only you, or only people that have shared the article.
}

interface ArticleSerie {
  articles: Article[]  // The order is handled by the order of items in array.
};
```