v4.1

Ctrl K
Docs
Blog
Showcase
Plus
Documentation
Components
Templates
UI Kit
Playground
Course
New
Getting started
Installation
Editor setup
Compatibility
Upgrade guide
Core concepts
Styling with utility classes
Hover, focus, and other states
Responsive design
Dark mode
Theme variables
Colors
Adding custom styles
Detecting classes in source files
Functions and directives
Base styles
Preflight
Layout
aspect-ratio
columns
break-after
break-before
break-inside
box-decoration-break
box-sizing
display
float
clear
isolation
object-fit
object-position
overflow
overscroll-behavior
position
top / right / bottom / left
visibility
z-index
Flexbox & Grid
flex-basis
flex-direction
flex-wrap
flex
flex-grow
flex-shrink
order
grid-template-columns
grid-column
grid-template-rows
grid-row
grid-auto-flow
grid-auto-columns
grid-auto-rows
gap
justify-content
justify-items
justify-self
align-content
align-items
align-self
place-content
place-items
place-self
Spacing
padding
margin
Sizing
width
min-width
max-width
height
min-height
max-height
Typography
font-family
font-size
font-smoothing
font-style
font-weight
font-stretch
font-variant-numeric
letter-spacing
line-clamp
line-height
list-style-image
list-style-position
list-style-type
text-align
color
text-decoration-line
text-decoration-color
text-decoration-style
text-decoration-thickness
text-underline-offset
text-transform
text-overflow
text-wrap
text-indent
vertical-align
white-space
word-break
overflow-wrap
hyphens
content
Backgrounds
background-attachment
background-clip
background-color
background-image
background-origin
background-position
background-repeat
background-size
Borders
border-radius
border-width
border-color
border-style
outline-width
outline-color
outline-style
outline-offset
Effects
box-shadow
text-shadow
opacity
mix-blend-mode
background-blend-mode
mask-clip
mask-composite
mask-image
mask-mode
mask-origin
mask-position
mask-repeat
mask-size
mask-type
Filters
filter
blur
brightness
contrast
drop-shadow
grayscale
hue-rotate
invert
saturate
sepia
backdrop-filter
blur
brightness
contrast
grayscale
hue-rotate
invert
opacity
saturate
sepia
Tables
border-collapse
border-spacing
table-layout
caption-side
Transitions & Animation
transition-property
transition-behavior
transition-duration
transition-timing-function
transition-delay
animation
Transforms
backface-visibility
perspective
perspective-origin
rotate
scale
skew
transform
transform-origin
transform-style
translate
Interactivity
accent-color
appearance
caret-color
color-scheme
cursor
field-sizing
pointer-events
resize
scroll-behavior
scroll-margin
scroll-padding
scroll-snap-align
scroll-snap-stop
scroll-snap-type
touch-action
user-select
will-change
SVG
fill
stroke
stroke-width
Accessibility
forced-color-adjust
Getting started

Upgrade guide
Upgrading your Tailwind CSS projects from v3 to v4.

Tailwind CSS v4.0 is a new major version of the framework, so while we've worked really hard to minimize breaking changes, some updates are necessary. This guide outlines all the steps required to upgrade your projects from v3 to v4.

Tailwind CSS v4.0 is designed for Safari 16.4+, Chrome 111+, and Firefox 128+. If you need to support older browsers, stick with v3.4 until your browser support requirements change.

Using the upgrade tool
If you'd like to upgrade a project from v3 to v4, you can use our upgrade tool to do the vast majority of the heavy lifting for you:

Terminal
$ npx @tailwindcss/upgrade
For most projects, the upgrade tool will automate the entire migration process including updating your dependencies, migrating your configuration file to CSS, and handling any changes to your template files.

The upgrade tool requires Node.js 20 or higher, so ensure your environment is updated before running it.

We recommend running the upgrade tool in a new branch, then carefully reviewing the diff and testing your project in the browser to make sure all of the changes look correct. You may need to tweak a few things by hand in complex projects, but the tool will save you a ton of time either way.

It's also a good idea to go over all of the breaking changes in v4 and get a good understanding of what's changed, in case there are other things you need to update in your project that the upgrade tool doesn't catch.

Upgrading manually
Using PostCSS
In v3, the tailwindcss package was a PostCSS plugin, but in v4 the PostCSS plugin lives in a dedicated @tailwindcss/postcss package.

Additionally, in v4 imports and vendor prefixing is now handled for you automatically, so you can remove postcss-import and autoprefixer if they are in your project:

postcss.config.mjs
export default {
plugins: {
"postcss-import": {},
tailwindcss: {},
autoprefixer: {},
"@tailwindcss/postcss": {},
},
};
Using Vite
If you're using Vite, we recommend migrating from the PostCSS plugin to our new dedicated Vite plugin for improved performance and the best developer experience:

vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
plugins: [
tailwindcss(),
],
});
Using Tailwind CLI
In v4, Tailwind CLI lives in a dedicated @tailwindcss/cli package. Update any of your build commands to use the new package instead:

Terminal
npx tailwindcss -i input.css -o output.css
npx @tailwindcss/cli -i input.css -o output.css
Changes from v3
Here's a comprehensive list of all the breaking changes in Tailwind CSS v4.0.

Our upgrade tool will handle most of these changes for you automatically, so we highly recommend using it if you can.

Browser requirements
Tailwind CSS v4.0 is designed for modern browsers and targets Safari 16.4, Chrome 111, and Firefox 128. We depend on modern CSS features like @property and color-mix() for core framework features, and Tailwind CSS v4.0 will not work in older browsers.

If you need to support older browsers, we recommend sticking with v3.4 for now. We're actively exploring a compatibility mode to help people upgrade sooner that we hope to share more news on in the future.

Removed @tailwind directives
In v4 you import Tailwind using a regular CSS @import statement, not using the @tailwind directives you used in v3:

CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "tailwindcss";
Removed deprecated utilities
We've removed any utilities that were deprecated in v3 and have been undocumented for several years. Here's a list of what's been removed along with the modern alternative:

Deprecated Replacement
bg-opacity-_ Use opacity modifiers like bg-black/50
text-opacity-_ Use opacity modifiers like text-black/50
border-opacity-_ Use opacity modifiers like border-black/50
divide-opacity-_ Use opacity modifiers like divide-black/50
ring-opacity-_ Use opacity modifiers like ring-black/50
placeholder-opacity-_ Use opacity modifiers like placeholder-black/50
flex-shrink-_ shrink-_
flex-grow-_ grow-_
overflow-ellipsis text-ellipsis
decoration-slice box-decoration-slice
decoration-clone box-decoration-clone
Renamed utilities
We've renamed the following utilities in v4 to make them more consistent and predictable:

v3 v4
shadow-sm shadow-xs
shadow shadow-sm
drop-shadow-sm drop-shadow-xs
drop-shadow drop-shadow-sm
blur-sm blur-xs
blur blur-sm
backdrop-blur-sm backdrop-blur-xs
backdrop-blur backdrop-blur-sm
rounded-sm rounded-xs
rounded rounded-sm
outline-none outline-hidden
ring ring-3
Updated shadow, radius, and blur scales
We've renamed the default shadow, radius and blur scales to make sure every utility has a named value. The "bare" versions still work for backward compatibility, but the <utility>-sm utilities will look different unless updated to their respective <utility>-xs versions.

To update your project for these changes, replace all the v3 utilities with their v4 versions:

HTML
<input class="shadow-sm" />
<input class="shadow-xs" />
<input class="shadow" />
<input class="shadow-sm" />
Renamed outline utility
The outline utility now sets outline-width: 1px by default to be more consistent with border and ring utilities. Furthermore all outline-<number> utilities default outline-style to solid, omitting the need to combine them with outline:

HTML
<input class="outline outline-2" />
<input class="outline-2" />
The outline-none utility previously didn't actually set outline-style: none, and instead set an invisible outline that would still show up in forced colors mode for accessibility reasons.

To make this more clear we've renamed this utility to outline-hidden and added a new outline-none utility that actually sets outline-style: none.

To update your project for this change, replace any usage of outline-none with outline-hidden:

HTML
<input class="focus:outline-none" />
<input class="focus:outline-hidden" />
Default ring width change
In v3, the ring utility added a 3px ring. We've changed this in v4 to be 1px to make it consistent with borders and outlines.

To update your project for this change, replace any usage of ring with ring-3:

HTML
<input class="ring ring-blue-500" />
<input class="ring-3 ring-blue-500" />
Space-between selector
We've changed the selector used by the space-x-_ and space-y-_ utilities to address serious performance issues on large pages:

CSS
/_ Before _/
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
margin-top: 1rem;
}
/_ Now _/
.space-y-4 > :not(:last-child) {
margin-bottom: 1rem;
}
You might see changes in your project if you were ever using these utilities with inline elements, or if you were adding other margins to child elements to tweak their spacing.

If this change causes any issues in your project, we recommend migrating to a flex or grid layout and using gap instead:

HTML

<div class="space-y-4 p-4">
<div class="flex flex-col gap-4 p-4">
  <label for="name">Name</label>
  <input type="text" name="name" />
</div>
Using variants with gradients
In v3, overriding part of a gradient with a variant would "reset" the entire gradient, so in this example the to-* color would be transparent in dark mode instead of yellow:

HTML

<div class="bg-gradient-to-r from-red-500 to-yellow-400 dark:from-blue-500">
  <!-- ... -->
</div>
In v4, these values are preserved which is more consistent with how other utilities in Tailwind work.

This means you may need to explicitly use via-none if you want to "unset" a three-stop gradient back to a two-stop gradient in a specific state:

HTML

<div class="bg-linear-to-r from-red-500 via-orange-400 to-yellow-400 dark:via-none dark:from-blue-500 dark:to-teal-400">
  <!-- ... -->
</div>
Container configuration
In v3, the container utility had several configuration options like center and padding that no longer exist in v4.

To customize the container utility in v4, extend it using the @utility directive:

CSS
@utility container {
margin-inline: auto;
padding-inline: 2rem;
}
Default border color
In v3, the border-_ and divide-_ utilities used your configured gray-200 color by default. We've changed this to currentColor in v4 to make Tailwind less opinionated and match browser defaults.

To update your project for this change, make sure you specify a color anywhere you're using a border-_ or divide-_ utility:

<div class="border border-gray-200 px-2 py-3 ...">
  <!-- ... -->
</div>
Alternatively, add these base styles to your project to preserve the v3 behavior:

CSS
@layer base {
_,
::after,
::before,
::backdrop,
::file-selector-button {
border-color: var(--color-gray-200, currentColor);
}
}
Default ring width and color
We've changed the width of the ring utility from 3px to 1px and changed the default color from blue-500 to currentColor to make things more consistent the border-_, divide-_, and outline-_ utilities.

To update your project for these changes, replace any use of ring with ring-3:

<button class="focus:ring ...">
<button class="focus:ring-3 ...">
  <!-- ... -->
</button>
Then make sure to add ring-blue-500 anywhere you were depending on the default ring color:

<button class="focus:ring-3 focus:ring-blue-500 ...">
  <!-- ... -->
</button>
Alternatively, add these theme variables to your CSS to preserve the v3 behavior:

CSS
@theme {
--default-ring-width: 3px;
--default-ring-color: var(--color-blue-500);
}
Note though that these variables are only supported for compatibility reasons, and are not considered idiomatic usage of Tailwind CSS v4.0.

Preflight changes
We've made a couple small changes to the base styles in Preflight in v4:

New default placeholder color
In v3, placeholder text used your configured gray-400 color by default. We've simplified this in v4 to just use the current text color at 50% opacity.

You probably won't even notice this change (it might even make your project look better), but if you want to preserve the v3 behavior, add this CSS to your project:

CSS
@layer base {
input::placeholder,
textarea::placeholder {
color: var(--color-gray-400);
}
}
Buttons use the default cursor
Buttons now use cursor: default instead of cursor: pointer to match the default browser behavior.

If you'd like to continue using cursor: pointer by default, add these base styles to your CSS:

CSS
@layer base {
button:not(:disabled),
[role="button"]:not(:disabled) {
cursor: pointer;
}
}
Dialog margins removed
Preflight now resets margins on <dialog> elements to be consistent with how other elements are reset.

If you still want dialogs to be centered by default, add this CSS to your project:

CSS
@layer base {
dialog {
margin: auto;
}
}
Using a prefix
Prefixes now look like variants and are always at the beginning of the class name:

<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600">
  <!-- ... -->
</div>
When using a prefix, you should still configure your theme variables as if you aren't using a prefix:

@import "tailwindcss" prefix(tw);
@theme {
--font-display: "Satoshi", "sans-serif";
--breakpoint-3xl: 120rem;
--color-avocado-100: oklch(0.99 0 0);
--color-avocado-200: oklch(0.98 0.04 113.22);
--color-avocado-300: oklch(0.94 0.11 115.03);
/_ ... _/
}
The generated CSS variables will include a prefix to avoid conflicts with any existing variables in your project:

:root {
--tw-font-display: "Satoshi", "sans-serif";
--tw-breakpoint-3xl: 120rem;
--tw-color-avocado-100: oklch(0.99 0 0);
--tw-color-avocado-200: oklch(0.98 0.04 113.22);
--tw-color-avocado-300: oklch(0.94 0.11 115.03);
/_ ... _/
}
Adding custom utilities
In v3, any custom classes you defined within @layer utilities or @layer components would get picked up by Tailwind as a true utility class and would automatically work with variants like hover, focus, or lg with the difference being that @layer components would always come first in the generated stylesheet.

In v4 we are using native cascade layers and no longer hijacking the @layer at-rule, so we've introduced the @utility API as a replacement:

CSS
@layer utilities {
.tab-4 {
tab-size: 4;
}
}
@utility tab-4 {
tab-size: 4;
}
Custom utilities are now also sorted based on the amount of properties they define. This means that component utilities like this .btn can be overwritten by other Tailwind utilities without additional configuration:

CSS
@layer components {
.btn {
border-radius: 0.5rem;
padding: 0.5rem 1rem;
background-color: ButtonFace;
}
}
@utility btn {
border-radius: 0.5rem;
padding: 0.5rem 1rem;
background-color: ButtonFace;
}
Learn more about registering custom utilities in the adding custom utilities documentation.

Variant stacking order
In v3, stacked variants were applied from right to left, but in v4 we've updated them to apply left to right to look more like CSS syntax.

To update your project for this change, reverse the order of any order-sensitive stacked variants in your project:

HTML

<ul class="py-4 first:*:pt-0 last:*:pb-0">
<ul class="py-4 *:first:pt-0 *:last:pb-0">
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
You likely have very few of these if any—the direct child variant (*) and any typography plugin variants (prose-headings) are the most likely ones you might be using, and even then it's only if you've stacked them with other variants.

Variables in arbitrary values
In v3 you were able to use CSS variables as arbitrary values without var(), but recent updates to CSS mean that this can often be ambiguous, so we've changed the syntax for this in v4 to use parentheses instead of square brackets.

To update your project for this change, replace usage of the old variable shorthand syntax with the new variable shorthand syntax:

HTML

<div class="bg-[--brand-color]"></div>
<div class="bg-(--brand-color)"></div>
Hover styles on mobile
In v4 we've updated the hover variant to only apply when the primary input device supports hover:

CSS
@media (hover: hover) {
.hover\:underline:hover {
text-decoration: underline;
}
}
This can create problems if you've built your site in a way that depends on touch devices triggering hover on tap. If this is an issue for you, you can override the hover variant with your own variant that uses the old implementation:

CSS
@custom-variant hover (&:hover);
Generally though we recommend treating hover functionality as an enhancement, and not depending on it for your site to work since touch devices don't truly have the ability to hover.

Transitioning outline-color
The transition and transition-color utilities now include the outline-color property.

This means if you were adding an outline with a custom color on focus, you will see the color transition from the default color. To avoid this, make sure you set the outline color unconditionally, or explicitly set it for both states:

HTML
<button class="transition hover:outline-2 hover:outline-cyan-500"></button>
<button class="outline-cyan-500 transition hover:outline-2"></button>
Disabling core plugins
In v3 there was a corePlugins option you could use to completely disable certain utilities in the framework. This is no longer supported in v4.

Using the theme() function
Since v4 includes CSS variables for all of your theme values, we recommend using those variables instead of the theme() function whenever possible:

CSS
.my-class {
background-color: theme(colors.red.500);
background-color: var(--color-red-500);
}
For cases where you still need to use the theme() function (like in media queries where CSS variables aren't supported), you should use the CSS variable name instead of the old dot notation:

CSS
@media (width >= theme(screens.xl)) {
@media (width >= theme(--breakpoint-xl)) {
/_ ... _/
}
Using a JavaScript config file
JavaScript config files are still supported for backward compatibility, but they are no longer detected automatically in v4.

If you still need to use a JavaScript config file, you can load it explicitly using the @config directive:

CSS
@config "../../tailwind.config.js";
The corePlugins, safelist, and separator options from the JavaScript-based config are not supported in v4.0.

Theme values in JavaScript
In v3 we exported a resolveConfig function that you could use to turn your JavaScript-based config into a flat object that you could use in your other JavaScript.

We've removed this in v4 in hopes that people can use the CSS variables we generate directly instead, which is much simpler and will significantly reduce your bundle size.

For example, the popular Motion library for React lets you animate to and from CSS variable values:

JSX
<motion.div animate={{ backgroundColor: "var(--color-blue-500)" }} />
If you need access to a resolved CSS variable value in JS, you can use getComputedStyle to get the value of a theme variable on the document root:

spaghetti.js
let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue("--shadow-xl");
Using @apply with Vue, Svelte, or CSS modules
In v4, stylesheets that are bundled separately from your main CSS file (e.g. CSS modules files, <style> blocks in Vue, Svelte, or Astro, etc.) do not have access to theme variables, custom utilities, and custom variants defined in other files.

To make these definitions available in these contexts, use @reference to import them without duplicating any CSS in your bundle:

Vue
<template>

  <h1>Hello world!</h1>
</template>
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
Alternatively, you can use your CSS theme variables directly instead of using @apply at all, which will also improve performance since Tailwind won't need to process these styles:

Vue
<template>

  <h1>Hello world!</h1>
</template>
<style>
  h1 {
    color: var(--text-red-500);
  }
</style>
You can find more documentation on using Tailwind with CSS modules.

Compatibility
Styling with utility classes
On this page
Using the upgrade tool
Upgrading manually
Using PostCSS
Using Vite
Using Tailwind CLI
Changes from v3
Browser requirements
Removed @tailwind directives
Removed deprecated utilities
Renamed utilities
Space-between selector
Using variants with gradients
Container configuration
Default border color
Default ring width and color
Preflight changes
Using a prefix
Adding custom utilities
Variant stacking order
Variables in arbitrary values
Hover styles on mobile
Transitioning outline-color
Disabling core plugins
Using the theme() function
Using a JavaScript config file
Theme values in JavaScript
Using @apply with Vue, Svelte, or CSS modules
Refactoring UI
From the creators of Tailwind CSS

Make your ideas look awesome, without relying on a designer.

“This is the survival kit I wish I had when I started building apps.”

Derrick Reimer, SavvyCal

Learn
Documentation
Showcase
Blog
Playground
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.
·
Trademark Policy

---

Changelog:

v4.1

Ctrl K
Docs
Blog
Showcase
Plus
January 22, 2025
Tailwind CSS v4.0

Adam Wathan
@adamwathan
Tailwind CSS v4.0
Holy shit it's actually done — we just tagged Tailwind CSS v4.0.

Tailwind CSS v4.0 is an all-new version of the framework optimized for performance and flexibility, with a reimagined configuration and customization experience, and taking full advantage of the latest advancements the web platform has to offer.

New high-performance engine — where full builds are up to 5x faster, and incremental builds are over 100x faster — and measured in microseconds.
Designed for the modern web — built on cutting-edge CSS features like cascade layers, registered custom properties with @property, and color-mix().
Simplified installation — fewer dependencies, zero configuration, and just a single line of code in your CSS file.
First-party Vite plugin — tight integration for maximum performance and minimum configuration.
Automatic content detection — all of your template files are discovered automatically, with no configuration required.
Built-in import support — no additional tooling necessary to bundle multiple CSS files.
CSS-first configuration — a reimagined developer experience where you customize and extend the framework directly in CSS instead of a JavaScript configuration file.
CSS theme variables — all of your design tokens exposed as native CSS variables so you can access them anywhere.
Dynamic utility values and variants — stop guessing what values exist in your spacing scale, or extending your configuration for things like basic data attributes.
Modernized P3 color palette — a redesigned, more vivid color palette that takes full advantage of modern display technology.
Container queries — first-class APIs for styling elements based on their container size, no plugins required.
New 3D transform utilities — transform elements in 3D space directly in your HTML.
Expanded gradient APIs — radial and conic gradients, interpolation modes, and more.
@starting-style support — a new variant you can use to create enter and exit transitions, without the need for JavaScript.
not-\* variant — style an element only when it doesn't match another variant, custom selector, or media or feature query.
Even more new utilities and variants — including support for color-scheme, field-sizing, complex shadows, inert, and more.
Start using Tailwind CSS v4.0 today by installing it in a new project, or playing with it directly in the browser on Tailwind Play.

For existing projects, we've published a comprehensive upgrade guide and built an automated upgrade tool to get you on the latest version as quickly and painlessly as possible.

New high-performance engine
Tailwind CSS v4.0 is a ground-up rewrite of the framework, taking everything we've learned about the architecture over the years and optimizing it to be as fast as possible.

When benchmarking it on our own projects, we've found full rebuilds to be over 3.5x faster, and incremental builds to be over 8x faster.

Here are the median build times we saw when we benchmarked Tailwind CSS v4.0 against Catalyst:

v3.4 v4.0 Improvement
Full build 378ms 100ms 3.78x
Incremental rebuild with new CSS 44ms 5ms 8.8x
Incremental rebuild with no new CSS 35ms 192µs 182x
The most impressive improvement is on incremental builds that don't actually need to compile any new CSS — these builds are over 100x faster and complete in microseconds. And the longer you work on a project, the more of these builds you run into because you're just using classes you've already used before, like flex, col-span-2, or font-bold.

Designed for the modern web
The platform has evolved a lot since we released Tailwind CSS v3.0, and v4.0 takes full advantage of many of these improvements.

CSS
@layer theme, base, components, utilities;
@layer utilities {
.mx-6 {
margin-inline: calc(var(--spacing) \* 6);
}
.bg-blue-500\/50 {
background-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent);
}
}
@property --tw-gradient-from {
syntax: "<color>";
inherits: false;
initial-value: #0000;
}
We're leveraging modern CSS features like:

Native cascade layers — giving us more control than ever over how different style rules interact with each other.
Registered custom properties — making it possible to do things like animate gradients, and significantly improving performance on large pages.
color-mix() — which lets us adjust the opacity of any color value, including CSS variables and currentColor.
Logical properties — simplifying RTL support and reducing the size of your generated CSS.
Many of these features have even simplified Tailwind internally, reducing the surface area for bugs and making the framework easier for us to maintain.

Simplified installation
We've streamlined the setup process a ton in v4.0, reducing the number of steps and removing a lot of boilerplate.

1. Install Tailwind CSS
   npm i tailwindcss @tailwindcss/postcss;
2. Add the PostCSS plugin
   export default {
   plugins: ["@tailwindcss/postcss"],
   };
3. Import Tailwind in your CSS
   @import "tailwindcss";
   With the improvements we've made to this process for v4.0, Tailwind feels more light-weight than ever:

Just one-line of CSS — no more @tailwind directives, just add @import "tailwindcss" and start building.
Zero configuration — you can start using the framework without configuring anything, not even the paths to your template files.
No external plugins required — we bundle @import rules for you out of the box, and use Lightning CSS under the hood for vendor prefixing and modern syntax transforms.
Sure you only go through this once per project, but it adds up when you're starting and abandoning a different side-project every weekend.

First-party Vite plugin
If you're a Vite user, you can now integrate Tailwind using @tailwindcss/vite instead of PostCSS:

vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
plugins: [
tailwindcss(),
],
});
Tailwind CSS v4.0 is incredibly fast when used as a PostCSS plugin, but you'll get even better performance using the Vite plugin.

Automatic content detection
You know how you always had to configure that annoying content array in Tailwind CSS v3? In v4.0, we came up with a bunch of heuristics for detecting all of that stuff automatically so you don’t have to configure it at all.

For example, we automatically ignore anything in your .gitignore file to avoid scanning dependencies or generated files that aren’t under version control:

.gitignore
/node_modules
/coverage
/.next/
/build
We also automatically ignore all binary extensions like images, videos, .zip files, and more.

And if you ever need to explicitly add a source that's excluded by default, you can always add it with the @source directive, right in your CSS file:

CSS
@import "tailwindcss";
@source "../node_modules/@my-company/ui-lib";
The @source directive uses the same heuristics under the hood, so it will exclude binary file types for example as well, without you having to specify all of the extensions to scan explicitly.

Learn more about in our new documentation on detecting classes in source files.

Built-in import support
Before v4.0, if you wanted to inline other CSS files using @import you'd have to configure another plugin like postcss-import to handle it for you.

Now we handle this out of the box, so you don't need any other tools:

postcss.config.js
export default {
plugins: [
"postcss-import",
"@tailwindcss/postcss",
],
};
Our import system is purpose-built for Tailwind CSS, so we've also been able to make it even faster by tightly integrating it with our engine.

CSS-first configuration
One of the biggest changes in Tailwind CSS v4.0 is the shift from configuring your project in JavaScript to configuring it in CSS.

Instead of a tailwind.config.js file, you can configure all of your customizations directly in the CSS file where you import Tailwind, giving you one less file to worry about in your project:

CSS
@import "tailwindcss";
@theme {
--font-display: "Satoshi", "sans-serif";
--breakpoint-3xl: 1920px;
--color-avocado-100: oklch(0.99 0 0);
--color-avocado-200: oklch(0.98 0.04 113.22);
--color-avocado-300: oklch(0.94 0.11 115.03);
--color-avocado-400: oklch(0.92 0.19 114.08);
--color-avocado-500: oklch(0.84 0.18 117.33);
--color-avocado-600: oklch(0.53 0.12 118.34);
--ease-fluid: cubic-bezier(0.3, 0, 0, 1);
--ease-snappy: cubic-bezier(0.2, 0, 0, 1);
/_ ... _/
}
The new CSS-first configuration lets you do just about everything you could do in your tailwind.config.js file, including configuring your design tokens, defining custom utilities and variants, and more.

To learn more about how it all works, read the new theme variables documentation.

CSS theme variables
Tailwind CSS v4.0 takes all of your design tokens and makes them available as CSS variables by default, so you can reference any value you need at run-time using just CSS.

Using the example @theme from earlier, all of these values will be added to your CSS to as regular custom properties:

Generated CSS
:root {
--font-display: "Satoshi", "sans-serif";
--breakpoint-3xl: 1920px;
--color-avocado-100: oklch(0.99 0 0);
--color-avocado-200: oklch(0.98 0.04 113.22);
--color-avocado-300: oklch(0.94 0.11 115.03);
--color-avocado-400: oklch(0.92 0.19 114.08);
--color-avocado-500: oklch(0.84 0.18 117.33);
--color-avocado-600: oklch(0.53 0.12 118.34);
--ease-fluid: cubic-bezier(0.3, 0, 0, 1);
--ease-snappy: cubic-bezier(0.2, 0, 0, 1);
/_ ... _/
}
This makes it easy to reuse these values as inline styles or pass them to libraries like Motion to animate them.

Dynamic utility values and variants
We've simplified the way many utilities and variants work in v4.0 by effectively allowing them to accept certain types of arbitrary values, without the need for any configuration or dropping down to the arbitrary value syntax.

For example, in Tailwind CSS v4.0 you can create grids of any size out of the box:

HTML

<div class="grid grid-cols-15">
  <!-- ... -->
</div>
You can also target custom boolean data attributes without needing to define them:

HTML

<div data-current class="opacity-75 data-current:opacity-100">
  <!-- ... -->
</div>
Even spacing utilities like px-*, mt-*, w-*, h-*, and more are now dynamically derived from a single spacing scale variable and accept any value out of the box:

Generated CSS
@layer theme {
:root {
--spacing: 0.25rem;
}
}
@layer utilities {
.mt-8 {
margin-top: calc(var(--spacing) _ 8);
}
.w-17 {
width: calc(var(--spacing) _ 17);
}
.pr-29 {
padding-right: calc(var(--spacing) \* 29);
}
}
The upgrade tool we released alongside v4.0 will even simplify most of these utilities for you automatically if it notices you using an arbitrary value that's no longer needed.

Modernized P3 color palette
We've upgraded the entire default color palette from rgb to oklch, taking advantage of the wider gamut to make the colors more vivid in places where we were previously limited by the sRGB color space.

We've tried to keep the balance between all the colors the same as it was in v3, so even though we've refreshed things across the board, it shouldn't feel like a breaking change when upgrading your existing projects.

Container queries
We've brought container query support into core for v4.0, so you don't need the @tailwindcss/container-queries plugin anymore:

HTML

<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    <!-- ... -->
  </div>
</div>
We've also added support for max-width container queries using the new @max-* variant:

HTML

<div class="@container">
  <div class="grid grid-cols-3 @max-md:grid-cols-1">
    <!-- ... -->
  </div>
</div>
Like our regular breakpoint variants, you can also stack @min-* and @max-* variants to define container query ranges:

HTML

<div class="@container">
  <div class="flex @min-md:@max-xl:hidden">
    <!-- ... -->
  </div>
</div>
Learn more in our all-new container queries documentation.

New 3D transform utilities
We've finally added APIs for doing 3D transforms, like rotate-x-_, rotate-y-_, scale-z-_, translate-z-_, and tons more.

Mar 16, 2020
Michael Foster
Boost your conversion rate

<div class="perspective-distant">
  <article class="rotate-x-51 rotate-z-43 transform-3d ...">
    <!-- ... -->
  </article>
</div>
Check out the updated transform-style, rotate, perspective, and perspective-origin documentation to get started.

Expanded gradient APIs
We've added a ton of new gradient features in v4.0, so you can pull off even fancier effects without having to write any custom CSS.

Linear gradient angles
Linear gradients now support angles as values, so you can use utilities like bg-linear-45 to create a gradient on a 45 degree angle:

<div class="bg-linear-45 from-indigo-500 via-purple-500 to-pink-500"></div>
You may notice we've renamed bg-gradient-* to bg-linear-* too — you'll see why shortly!

Gradient interpolation modifiers
We've added the ability to control the color interpolation mode for gradients using a modifier, so a class like bg-linear-to-r/srgb interpolates using sRGB, and bg-linear-to-r/oklch interpolates using OKLCH:

<div class="bg-linear-to-r/srgb from-indigo-500 to-teal-400">...</div>
<div class="bg-linear-to-r/oklch from-indigo-500 to-teal-400">...</div>
Using polar color spaces like OKLCH or HSL can lead to much more vivid gradients when the from-* and to-* colors are far apart on the color wheel. We're using OKLAB by default in v4.0 but you can always interpolate using a different color space by adding one of these modifiers.

Conic and radial gradients
We've added new bg-conic-_ and bg-radial-_ utilities for creating conic and radial gradients:

<div class="size-24 rounded-full bg-conic/[in_hsl_longer_hue] from-red-600 to-red-600"></div>
<div class="size-24 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"></div>
These new utilities work alongside the existing from-*, via-*, and to-* utilities to let you create conic and radial gradients the same way you create linear gradients, and include modifiers for setting the color interpolation method and arbitrary value support for controlling details like the gradient position.

@starting-style support
The new starting variant adds support for the new CSS @starting-style feature, making it possible to transition element properties when an element is first displayed:

<div>
  <button popovertarget="my-popover">Check for updates</button>
  <div popover id="my-popover" class="transition-discrete starting:open:opacity-0 ...">
    <!-- ... -->
  </div>
</div>
With @starting-style, you can finally animate elements as they appear on the page without the need for any JavaScript at all. Browser support probably isn't quite there yet for most teams, but we're getting close!

not-_ variant
We've added a new not-_ variant which finally adds support for the CSS :not() pseudo-class:

HTML

<div class="not-hover:opacity-75">
  <!-- ... -->
</div>
CSS
.not-hover\:opacity-75:not(*:hover) {
  opacity: 75%;
}
@media not (hover: hover) {
  .not-hover\:opacity-75 {
    opacity: 75%;
  }
}
It does double duty and also lets you negate media queries and @supports queries:

HTML

<div class="not-supports-hanging-punctuation:px-4">
  <!-- ... -->
</div>
CSS
.not-supports-hanging-punctuation\:px-4 {
  @supports not (hanging-punctuation: var(--tw)) {
    padding-inline: calc(var(--spacing) * 4);
  }
}
Check out the new not-* documentation to learn more.

Even more new utilities and variants
We've added a ton of other new utilities and variants to v4.0 too, including:

New inset-shadow-_ and inset-ring-_ utilities — making it possible to stack up to four layers of box shadows on a single element.
New field-sizing utilities — for auto-resizing textareas without writing a single line of JavaScript.
New color-scheme utilities — so you can finally get rid of those ugly light scrollbars in dark mode.
New font-stretch utilities — for carefully tweaking variable fonts that support different widths.
New inert variant — for styling non-interactive elements marked with the inert attribute.
New nth-_ variants — for doing really clever things you'll eventually regret.
New in-_ variant — which is a lot like group-\*, but without the need for the group class.
Support for :popover-open — using the existing open variant to also target open popovers.
New descendant variant — for styling all descendant elements, for better or for worse.
Check out the relevant documentation for all of these features to learn more.

And that's it — that's Tailwind CSS v4.0. It's been years of work to get to this point, but we're all extremely proud of this release and we can't wait to see what you build with it.

Check it out, play with it, maybe even break it, and definitely let us know what you think.

Just no bug reports until tomorrow please — let us at least enjoy one celebratory team dinner and maybe relax in the hot tub at this hotel for a bit believing that somehow we really did ship flawless software.

Get all of our updates directly to your inbox.
Sign up for our newsletter.
Subscribe via email
Subscribe
Learn
Documentation
Showcase
Blog
Playground
Tailwind Plus
UI Blocks
Templates
UI Kit
Resources
Refactoring UI
Headless UI
Heroicons
Hero Patterns
Community
GitHub
Discord
X
Copyright © 2025 Tailwind Labs Inc.
·
Trademark Policy

---

index.css ( Tailwind v3 )

@tailwind base;
@tailwind utilities;
@tailwind components;

/_ @ Light _/

body {
@apply bg-zinc-50 text-black;
}

body .active-link {
color: #00501d;
}

body .active-link:hover {
color: #00501d;
}

body .active-button-link {
background: #15803d;
color: #fff;
}

body .active-button-link:hover {
background: #15803d;
color: #fff;
}

/_ @ Dark _/

body.dark {
@apply bg-zinc-950 text-white;
}

body.dark .active-link {
color: rgb(34 197 94);
}

body.dark .active-link:hover {
color: rgb(34 197 94);
}

body.dark .active-button-link {
background: #15803d;
}

body.dark .active-button-link:hover {
background: #15803d;
}

/_ @ General _/

::-webkit-scrollbar {
@apply w-2 h-1;
}

::-webkit-scrollbar-track {
@apply bg-zinc-200;
}

::-webkit-scrollbar-thumb {
@apply bg-zinc-700;
}

::-webkit-scrollbar-thumb:hover {
@apply bg-zinc-800;
}

/_ @ Utils _/

@keyframes lrotate {
100% {
transform: rotate(1turn);
}
}

.loader {
animation: lrotate 1s infinite linear;
}

/_ @Tailwind _/

@layer components {
.prose h1 {
@apply text-4xl md:text-5xl;
}

.prose h2 {
@apply text-3xl md:text-4xl;
}

.prose h3 {
@apply text-2xl md:text-3xl;
}

.prose h4 {
@apply text-xl md:text-2xl;
}

.prose h5 {
@apply text-lg md:text-xl font-bold;
}

.prose h6 {
@apply md:text-lg font-bold;
}

.prose {
:not(pre) > code[class*='language-'],
pre[class*='language-'] {
background: #181818;
}
}

body.dark .prose {
:not(pre) > code[class*='language-'],
pre[class*='language-'] {
background: #0f151b;
}
}

.prose code::before,
.prose code::after {
@apply content-none;
}

.prose table {
@apply overflow-auto block;
}

.prose td {
@apply whitespace-nowrap;
}

.prose a {
@apply break-words;
}

.prose .katex-display {
@apply overflow-x-auto overflow-y-hidden py-1;
}
}

---

index.css ( Tailwind v4 )

@import 'tailwindcss';

@config '../../tailwind.config.js';

/\*
The default border color has changed to `currentcolor` in Tailwind CSS v4,
so we've added these compatibility styles to make sure everything still
looks the same as it did with Tailwind CSS v3.

If we ever want to remove these styles, we need to add an explicit border
color utility to any element that depends on these defaults.
_/
@layer base {
_,
::after,
::before,
::backdrop,
::file-selector-button {
border-color: var(--color-gray-200, currentcolor);
}
}

@utility prose {
& h1 {
@apply text-4xl md:text-5xl;
}

& h2 {
@apply text-3xl md:text-4xl;
}

& h3 {
@apply text-2xl md:text-3xl;
}

& h4 {
@apply text-xl md:text-2xl;
}

& h5 {
@apply text-lg md:text-xl font-bold;
}

& h6 {
@apply md:text-lg font-bold;
}
:not(pre) > code[class*='language-'],
pre[class*='language-'] {
background: #181818;
}

body.dark & {
:not(pre) > code[class*='language-'],
pre[class*='language-'] {
background: #0f151b;
}
}

& code::before {
@apply content-none;
}

& code::after {
@apply content-none;
}

& table {
@apply overflow-auto block;
}

& td {
@apply whitespace-nowrap;
}

& a {
@apply break-words;
}

& .katex-display {
@apply overflow-x-auto overflow-y-hidden py-1;
}
}

@utility dark {
&body .prose {
:not(pre) > code[class*='language-'],
pre[class*='language-'] {
background: #0f151b;
}
}

/_ @ Dark _/

&body {
@apply bg-zinc-950 text-white;
}

&body .active-link {
color: rgb(34 197 94);
}

&body .active-link:hover {
color: rgb(34 197 94);
}

&body .active-button-link {
background: #15803d;
}

&body .active-button-link:hover {
background: #15803d;
}

/_ @Tailwind _/
}

@utility katex-display {
.prose & {
@apply overflow-x-auto overflow-y-hidden py-1;
}
}

@utility active-link {
body & {
color: #00501d;
}

body &:hover {
color: #00501d;
}

body.dark & {
color: rgb(34 197 94);
}

body.dark &:hover {
color: rgb(34 197 94);
}

/_ @Tailwind _/
}

@utility active-button-link {
body & {
background: #15803d;
color: #fff;
}

body &:hover {
background: #15803d;
color: #fff;
}

body.dark & {
background: #15803d;
}

body.dark &:hover {
background: #15803d;
}

/_ @Tailwind _/
}

@utility loader {
/_ @ Utils _/
animation: lrotate 1s infinite linear;

/_ @Tailwind _/
}

/\*
The default border color has changed to `currentcolor` in Tailwind CSS v4,
so we've added these compatibility styles to make sure everything still
looks the same as it did with Tailwind CSS v3.

If we ever want to remove these styles, we need to add an explicit border
color utility to any element that depends on these defaults.
_/
@layer base {
_,
::after,
::before,
::backdrop,
::file-selector-button {
border-color: var(--color-gray-200, currentcolor);
}
}

@layer components {
/_ @ Light _/

body {
@apply bg-zinc-50 text-black;
}

/_ @ Dark _/

body.dark {
@apply bg-zinc-950 text-white;
}

/_ @ General _/

::-webkit-scrollbar {
@apply w-2 h-1;
}

::-webkit-scrollbar-track {
@apply bg-zinc-200;
}

::-webkit-scrollbar-thumb {
@apply bg-zinc-700;
}

::-webkit-scrollbar-thumb:hover {
@apply bg-zinc-800;
}

@keyframes lrotate {
100% {
transform: rotate(1turn);
}
}
}
