import { Button } from 'design-system/button';
import React, { useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';

const MoreNav = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        className="ml-2"
        i={2}
        rfull
        title="Navigation"
        onClick={() => setOpened(!opened)}
      >
        <BiMenu className="text-2xl" />
      </Button>
      {opened && (
        <aside className="bg-zinc-200 dark:bg-gray-950 border-l-2 border-zinc-300 dark:border-zinc-800 fixed top-0 right-0 h-full w-[280px] overflow-y-auto">
          <div className="p-4 flex items-center h-[72px]">
            <img
              src="/favicon-32x32.png"
              alt="4Markdown"
              title="4Markdown - Online Markdown Editor"
            />
            <p className="text-xl ml-3 font-bold">4Markdown</p>
            <Button
              className="ml-auto"
              i={2}
              rfull
              title="Close navigation"
              onClick={() => setOpened(false)}
            >
              <BiX className="text-2xl" />
            </Button>
          </div>
          <div className="p-4 flex flex-col h-[calc(100svh-72px)]">
            <a
              href="https://greenonsoftware.com/authors/"
              target="_blank"
              className="mb-2"
              title="4Markdown authors"
              rel="noopener noreferrer"
            >
              <Button i={2} wfull>
                Authors
              </Button>
            </a>
            <a
              href="https://greenonsoftware.com/articles/"
              target="_blank"
              className="mb-2"
              title="GreenOn Software learning platform"
              rel="noopener noreferrer"
            >
              <Button i={2} wfull>
                Articles
              </Button>
            </a>
            <a
              href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
              target="_blank"
              title="Markdown Cheatsheet"
              rel="noopener noreferrer"
            >
              <Button i={2} wfull>
                Cheatsheet
              </Button>
            </a>
            <a
              href="https://greenonsoftware.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mt-auto cursor-pointer justify-end"
            >
              <p className="text-md font-medium font-mono">
                by <strong>GreenOn Software</strong>
              </p>
              <svg
                className="ml-3"
                width="32"
                height="32"
                viewBox={`0 0 52 52`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.3784 12.1375C44.1761 16.3698 50.2363 19.057 50.9307 22.819C51.6252 26.5811 46.9537 31.418 43.3554 35.919C39.7572 40.3528 37.2321 44.3836 33.255 47.2723C29.3411 50.0938 23.9122 51.7061 18.6095 50.6984C13.3067 49.6236 8.06716 45.9959 4.7214 40.7559C1.43877 35.4487 0.0499603 28.5964 1.69128 22.9534C3.33259 17.3103 8.00403 12.8765 12.7386 8.57704C17.5363 4.27756 22.5234 0.246812 26.7529 1.12014C30.9825 1.99347 34.5176 7.83806 39.3784 12.1375Z"
                  stroke="url(#paint0_linear_102_163)"
                  strokeWidth="2"
                />
                <path
                  d="M36.0338 15.6032C39.6321 18.7774 44.1773 20.7927 44.6981 23.6143C45.2189 26.4358 41.7153 30.0635 39.0166 33.4392C36.3179 36.7646 34.4241 39.7877 31.4413 41.9542C28.5058 44.0704 24.4341 45.2796 20.4571 44.5238C16.4801 43.7177 12.5504 40.9969 10.041 37.0669C7.57907 33.0865 6.53747 27.9473 7.76846 23.715C8.99944 19.4828 12.503 16.1574 16.0539 12.9328C19.6522 9.70817 23.3925 6.68511 26.5647 7.34011C29.7368 7.9951 32.3882 12.3785 36.0338 15.6032Z"
                  stroke="url(#paint1_linear_102_163)"
                  strokeWidth="2"
                />
                <path
                  d="M32.6892 19.0688C35.0881 21.1849 38.1182 22.5285 38.4654 24.4095C38.8126 26.2905 36.4769 28.709 34.6777 30.9595C32.8786 33.1764 31.616 35.1918 29.6275 36.6361C27.6706 38.0469 24.9561 38.8531 22.3047 38.3492C19.6534 37.8118 17.0336 35.9979 15.3607 33.3779C13.7194 30.7244 13.025 27.2982 13.8456 24.4767C14.6663 21.6552 17.002 19.4383 19.3693 17.2885C21.7681 15.1388 24.2617 13.1234 26.3765 13.5601C28.4912 13.9967 30.2588 16.919 32.6892 19.0688Z"
                  stroke="url(#paint2_linear_102_163)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_102_163"
                    x1="1"
                    y1="51"
                    x2="51"
                    y2="1"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF0000" />
                    <stop offset="1" stopColor="#FBA81F" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_102_163"
                    x1="7.25"
                    y1="44.75"
                    x2="44.75"
                    y2="7.25"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00FF38" />
                    <stop offset="1" stopColor="#FBA81F" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_102_163"
                    x1="13.5"
                    y1="38.5"
                    x2="38.5"
                    y2="13.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#69B6CE" />
                    <stop offset="1" stopColor="#FBA81F" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </div>
        </aside>
      )}
    </>
  );
};

export default MoreNav;
