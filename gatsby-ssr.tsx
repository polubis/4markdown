import React from "react";
import type { GatsbySSR } from "gatsby";
// Based on following implementation:
// https://github.com/insin/gatsby-plugin-dark-mode
export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setPreBodyComponents,
}) => {
  setPreBodyComponents([
    <script
      id="dark-mode"
      key="dark-mode"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <No injection RISK - DONE FULLY DURING SSG>
      dangerouslySetInnerHTML={{
        __html: `
        void function() {
          window.__onThemeChange = function() {}
        
          var preferredTheme
          try {
            preferredTheme = localStorage.getItem('theme')
          } catch (err) { }
        
          function setTheme(newTheme) {
            if (preferredTheme && document.body.classList.contains(preferredTheme)) {
              document.body.classList.replace(preferredTheme, newTheme)
            } else {
              document.body.classList.add(newTheme)
            }
        
            window.__theme = newTheme
            preferredTheme = newTheme
            window.__onThemeChange(newTheme)
          }
        
          window.__setPreferredTheme = function(newTheme) {
            setTheme(newTheme)
            try {
              localStorage.setItem('theme', newTheme)
            } catch (err) {}
          }
        
          var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
          darkQuery.addListener(function(e) {
            window.__setPreferredTheme(e.matches ? 'dark' : 'light')
          })
        
          setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))
        }()
            `,
      }}
    />,
  ]);
};
