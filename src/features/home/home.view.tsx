import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Link } from 'gatsby';
import React from 'react';

interface AnimatedCompanyLogoProps {
  className?: string;
  size: number;
  animationSpeed?: number;
  rotationSpeed?: number;
  pulseIntensity?: number;
  zapEffect?: boolean;
  morphIntensity?: number;
  continuous?: boolean;
}

const AnimatedCompanyLogo = ({
  className,
  size = 32,
  animationSpeed = 1,
  rotationSpeed = 0.0092,
  pulseIntensity = 1.37,
  zapEffect = true,
  morphIntensity = 0.8,
  continuous = true,
}: AnimatedCompanyLogoProps) => {
  const [rotation, setRotation] = React.useState(0);
  const [scale, setScale] = React.useState(1);
  const [zapOpacity, setZapOpacity] = React.useState(0);
  const [morphProgress, setMorphProgress] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Add a small delay before starting animations to prevent flash
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    let animationFrame: number;
    let startTime = Date.now();
    let lastZapTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - startTime) * 0.001 * animationSpeed;
      startTime = currentTime;

      // Smooth rotation
      if (rotationSpeed > 0) {
        setRotation((prev) => (prev + rotationSpeed * deltaTime * 360) % 360);
      }

      // Smoother pulse effect
      if (pulseIntensity > 0) {
        const pulseVal =
          Math.sin(currentTime * 0.001 * pulseIntensity) * 0.05 + 1;
        setScale(pulseVal);
      }

      if (zapEffect && currentTime - lastZapTime > 3000) {
        // Only trigger every 3 seconds
        if (Math.random() < 0.3) {
          // Reduced probability
          setZapOpacity(0.7);
          setTimeout(() => setZapOpacity(0), 200); // Longer duration
          lastZapTime = currentTime;
        }
      }

      // Smoother morph effect
      if (morphIntensity > 0) {
        const morphVal =
          Math.sin(currentTime * 0.0005 * morphIntensity) * 0.5 + 0.5;
        setMorphProgress(morphVal);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    if (continuous) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      clearTimeout(visibilityTimer);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    animationSpeed,
    rotationSpeed,
    pulseIntensity,
    zapEffect,
    morphIntensity,
    continuous,
  ]);

  const centerX = 26;
  const centerY = 26;
  const morphDistortion = (val: number) => morphProgress * val * morphIntensity;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        overflow: `visible`,
        display: `inline-block`,
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.3s ease-in-out`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 52 52`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: `center`,
          transition: `transform 0.2s ease-out`,
        }}
      >
        {/* Main circles with morph effect */}
        <path
          d={`M39.3784 ${12.1375 + morphDistortion(2)}C44.1761 ${16.3698 + morphDistortion(1)}C50.2363 ${19.057 + morphDistortion(1.5)}C50.9307 ${22.819 + morphDistortion(0.8)}C51.6252 ${26.5811 + morphDistortion(1)}C46.9537 ${31.418 + morphDistortion(2)}C43.3554 ${35.919 + morphDistortion(1)}C39.7572 ${40.3528 + morphDistortion(0.5)}C37.2321 ${44.3836 + morphDistortion(1)}C33.255 ${47.2723 + morphDistortion(0.8)}C29.3411 ${50.0938 + morphDistortion(1)}C23.9122 ${51.7061 + morphDistortion(0.4)}C18.6095 ${50.6984 + morphDistortion(0.7)}C13.3067 ${49.6236 + morphDistortion(1)}C8.06716 ${45.9959 + morphDistortion(1.2)}C4.7214 ${40.7559 + morphDistortion(0.8)}C1.43877 ${35.4487 + morphDistortion(1)}C0.0499603 ${28.5964 + morphDistortion(0.6)}C1.69128 ${22.9534 + morphDistortion(1)}C3.33259 ${17.3103 + morphDistortion(0.9)}C8.00403 ${12.8765 + morphDistortion(1.1)}C12.7386 ${8.57704 + morphDistortion(0.7)}C17.5363 ${4.27756 + morphDistortion(0.9)}C22.5234 ${0.246812 + morphDistortion(0.5)}C26.7529 ${1.12014 + morphDistortion(0.4)}C30.9825 ${1.99347 + morphDistortion(0.6)}C34.5176 ${7.83806 + morphDistortion(0.9)}C39.3784 ${12.1375 + morphDistortion(0.3)}Z`}
          stroke="url(#paint0_linear_102_163)"
          strokeWidth={2}
        />
        <path
          d={`M36.0338 ${15.6032 + morphDistortion(1.5)}C39.6321 ${18.7774 + morphDistortion(0.8)}C44.1773 ${20.7927 + morphDistortion(1)}C44.6981 ${23.6143 + morphDistortion(0.6)}C45.2189 ${26.4358 + morphDistortion(0.9)}C41.7153 ${30.0635 + morphDistortion(1.2)}C39.0166 ${33.4392 + morphDistortion(0.7)}C36.3179 ${36.7646 + morphDistortion(1)}C34.4241 ${39.7877 + morphDistortion(0.8)}C31.4413 ${41.9542 + morphDistortion(0.5)}C28.5058 ${44.0704 + morphDistortion(0.9)}C24.4341 ${45.2796 + morphDistortion(0.4)}C20.4571 ${44.5238 + morphDistortion(0.6)}C16.4801 ${43.7177 + morphDistortion(0.8)}C12.5504 ${40.9969 + morphDistortion(1)}C10.041 ${37.0669 + morphDistortion(0.7)}C7.57907 ${33.0865 + morphDistortion(0.9)}C6.53747 ${27.9473 + morphDistortion(0.5)}C7.76846 ${23.715 + morphDistortion(0.8)}C8.99944 ${19.4828 + morphDistortion(0.6)}C12.503 ${16.1574 + morphDistortion(0.9)}C16.0539 ${12.9328 + morphDistortion(0.7)}C19.6522 ${9.70817 + morphDistortion(0.8)}C23.3925 ${6.68511 + morphDistortion(0.4)}C26.5647 ${7.34011 + morphDistortion(0.3)}C29.7368 ${7.9951 + morphDistortion(0.5)}C32.3882 ${12.3785 + morphDistortion(0.8)}C36.0338 ${15.6032 + morphDistortion(0.4)}Z`}
          stroke="url(#paint1_linear_102_163)"
          strokeWidth={2}
        />
        <path
          d={`M32.6892 ${19.0688 + morphDistortion(1)}C35.0881 ${21.1849 + morphDistortion(0.6)}C38.1182 ${22.5285 + morphDistortion(0.8)}C38.4654 ${24.4095 + morphDistortion(0.4)}C38.8126 ${26.2905 + morphDistortion(0.7)}C36.4769 ${28.709 + morphDistortion(0.9)}C34.6777 ${30.9595 + morphDistortion(0.5)}C32.8786 ${33.1764 + morphDistortion(0.8)}C31.616 ${35.1918 + morphDistortion(0.6)}C29.6275 ${36.6361 + morphDistortion(0.4)}C27.6706 ${38.0469 + morphDistortion(0.7)}C24.9561 ${38.8531 + morphDistortion(0.3)}C22.3047 ${38.3492 + morphDistortion(0.5)}C19.6534 ${37.8118 + morphDistortion(0.6)}C17.0336 ${35.9979 + morphDistortion(0.8)}C15.3607 ${33.3779 + morphDistortion(0.5)}C13.7194 ${30.7244 + morphDistortion(0.7)}C13.025 ${27.2982 + morphDistortion(0.4)}C13.8456 ${24.4767 + morphDistortion(0.6)}C14.6663 ${21.6552 + morphDistortion(0.5)}C17.002 ${19.4383 + morphDistortion(0.7)}C19.3693 ${17.2885 + morphDistortion(0.5)}C21.7681 ${15.1388 + morphDistortion(0.6)}C24.2617 ${13.1234 + morphDistortion(0.3)}C26.3765 ${13.5601 + morphDistortion(0.2)}C28.4912 ${13.9967 + morphDistortion(0.4)}C30.2588 ${16.919 + morphDistortion(0.6)}C32.6892 ${19.0688 + morphDistortion(0.3)}Z`}
          stroke="url(#paint2_linear_102_163)"
          strokeWidth={2}
        />

        {/* Zap/electrical effect overlay */}
        {zapEffect && (
          <g opacity={zapOpacity}>
            <circle
              cx={centerX}
              cy={centerY}
              r={size / 2.5}
              fill={`rgba(255, 255, 255, 0.3)`}
            />
            <path
              d="M26 10L30 26L18 22L26 38"
              stroke={`rgba(255, 215, 0, 0.8)`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

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
    </div>
  );
};

export { AnimatedCompanyLogo };

const HomeView = () => {
  // Add state for FAQ items collapse state
  const [openFAQs, setOpenFAQs] = React.useState<number[]>([]);

  // Function to toggle FAQ item open/closed state
  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  // FAQ contents with random text
  const faqItems = [
    {
      question: `What services do you offer?`,
      answer: `4Markdown offers a complete suite of document creation and organization tools. Our primary services include an AI-powered markdown editor with live preview, interactive mindmaps that integrate with your documents, automated document formatting, collaborative editing features, and AI writing assistance. We also provide educational resources and templates to help you get the most out of markdown formatting.`,
    },
    {
      question: `How long does a typical project take?`,
      answer: `The time to complete a project in 4Markdown varies depending on complexity and size. Most users can create basic documents in minutes, while complex documents with extensive mindmaps might take a few hours. Our AI assistance can significantly reduce your writing time by up to 40%. The platform is designed for efficiency, with features like templates and keyboard shortcuts that help streamline your workflow.`,
    },
    {
      question: `Do you offer ongoing support after project completion?`,
      answer: `Yes, we offer comprehensive ongoing support for all 4Markdown users. Our support includes access to our knowledge base, video tutorials, community forums, and direct customer support via email. Premium users receive priority support with faster response times. We also regularly update our platform with new features and improvements based on user feedback, ensuring that your 4Markdown experience continues to evolve and improve over time.`,
    },
    {
      question: `What is your pricing structure?`,
      answer: `4Markdown operates on a token-based pricing model. We offer three main pricing tiers: Starter (100 tokens for $2.50), Popular (1,000 tokens for $15), and Professional (10,000 tokens for $99). Basic document creation is free, while tokens are consumed when using premium features like AI writing assistance, advanced mindmap creation, and collaborative tools. This flexible approach allows you to pay only for the features you actually use, making it cost-effective for both occasional and power users.`,
    },
    {
      question: `How do we get started working together?`,
      answer: `Getting started with 4Markdown is simple. Just create a free account on our platform, which gives you immediate access to the basic document editor and mindmap tools. You can start creating documents right away without any token purchases. To access premium features, purchase a token package that suits your needs. We also offer a comprehensive onboarding guide and tutorial videos to help new users become familiar with all the features. For teams and organizations, we provide customized onboarding sessions upon request.`,
    },
  ];

  return (
    <>
      <AppNavigation>
        <Link to="/" className="hover:underline underline-offset-2">
          Document Creator
        </Link>
        <Link
          to="/mindmap-creator"
          className="hover:underline underline-offset-2"
        >
          Mindmap Creator
        </Link>
        <Link
          to="/education-zone"
          className="hover:underline underline-offset-2"
        >
          Education Zone
        </Link>
      </AppNavigation>

      <section className="py-16 px-4 md:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
            Your AI-Powered Markdown & Mindmap Workspace
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Create beautiful documents, visualize ideas with mindmaps, and
            accelerate your writing with AI assistance—all in one seamless
            workspace.
          </p>
          <Link
            to="/"
            className="bg-gray-300 hover:bg-gray-400/70 dark:bg-slate-800 dark:hover:bg-slate-800/70 text-black dark:text-white font-semibold py-3 px-8 rounded-md text-lg inline-block"
          >
            Start Writing for Free
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white dark:bg-gray-950 border-t border-zinc-300 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            How It Works
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Get started with 4Markdown in just a few simple steps
          </p>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Step connector lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-24 left-[25%] right-[25%] h-0.5 bg-gray-300 dark:bg-zinc-700 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-gray-200 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-950">
                <span className="text-green-700 dark:text-green-400 text-2xl font-bold">
                  1
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800 h-full">
                <h3 className="text-xl font-semibold mb-3 text-center dark:text-white">
                  Create
                </h3>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-36 mb-4 overflow-hidden">
                  <div className="flex h-8 bg-gray-300 dark:bg-zinc-700 items-center px-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-3 text-xs">
                    <div className="flex mb-2">
                      <span className="text-gray-700 dark:text-gray-300 mr-2">
                        #
                      </span>
                      <span className="text-black dark:text-white">
                        My Document
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Start writing your content with our intuitive editor...
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Begin writing in our intuitive markdown editor with live
                  preview
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-gray-200 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-950">
                <span className="text-green-700 dark:text-green-400 text-2xl font-bold">
                  2
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800 h-full">
                <h3 className="text-xl font-semibold mb-3 text-center dark:text-white">
                  Organize
                </h3>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-36 mb-4 overflow-hidden flex items-center justify-center">
                  <div className="mindmap-preview">
                    <div className="w-20 h-10 rounded-md bg-green-600 text-white text-xs flex items-center justify-center mb-4 mx-auto relative">
                      Main Idea
                      <div className="absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gray-400 dark:bg-gray-600"></div>
                    </div>
                    <div className="flex justify-center gap-8">
                      <div className="w-16 h-8 rounded-md bg-gray-300 dark:bg-gray-700 text-xs flex items-center justify-center text-black dark:text-white relative">
                        Topic 1
                        <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gray-400 dark:bg-gray-600"></div>
                      </div>
                      <div className="w-16 h-8 rounded-md bg-gray-300 dark:bg-gray-700 text-xs flex items-center justify-center text-black dark:text-white relative">
                        Topic 2
                        <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-gray-400 dark:bg-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Transform text into interactive mindmaps with a single click
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-gray-200 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-950">
                <span className="text-green-700 dark:text-green-400 text-2xl font-bold">
                  3
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800 h-full">
                <h3 className="text-xl font-semibold mb-3 text-center dark:text-white">
                  Enhance
                </h3>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-36 mb-4 overflow-hidden">
                  <div className="p-3">
                    <div className="flex mb-3">
                      <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded border border-green-200 dark:border-green-800">
                      <div className="text-xs text-green-800 dark:text-green-200 font-medium">
                        AI Suggestion:
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        Consider rephrasing this sentence for clarity...
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Let our AI tools polish your writing and suggest improvements
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-gray-200 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-950">
                <span className="text-green-700 dark:text-green-400 text-2xl font-bold">
                  4
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800 h-full">
                <h3 className="text-xl font-semibold mb-3 text-center dark:text-white">
                  Share
                </h3>
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-36 mb-4 overflow-hidden">
                  <div className="flex flex-col h-full justify-center items-center p-3">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="bg-white dark:bg-gray-900 p-2 rounded flex items-center justify-center">
                        <span className="text-xs">PDF</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-2 rounded flex items-center justify-center">
                        <span className="text-xs">HTML</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-2 rounded flex items-center justify-center">
                        <span className="text-xs">Word</span>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-2 rounded flex items-center justify-center">
                        <span className="text-xs">Image</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-green-600 text-white text-xs py-1 px-3 rounded">
                      Export & Share
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Export to multiple formats or share directly with colleagues
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="bg-gray-300 hover:bg-gray-400/70 dark:bg-slate-800 dark:hover:bg-slate-800/70 text-black dark:text-white font-semibold py-2 px-6 rounded-md inline-block"
            >
              Try 4Markdown Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            Powerful Features
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Everything you need to create, organize, and enhance your thoughts
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800">
              <div className="bg-gray-300 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-black dark:text-white text-xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Markdown Documents
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create beautiful documents with our intuitive markdown editor
                featuring live preview and formatting tools.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800">
              <div className="bg-gray-300 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-black dark:text-white text-xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Mindmap Generator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your ideas with interactive mindmaps that integrate
                seamlessly with your documents.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800">
              <div className="bg-gray-300 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-black dark:text-white text-xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                AI Assistance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let AI help you write better with grammar checks, style
                suggestions, and idea expansion capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            Why Choose 4Markdown?
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            See how we compare to other solutions
          </p>

          {/* Comparison table - desktop version */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-gray-950 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-900">
                  <th className="p-4 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-zinc-300 dark:border-zinc-800 w-1/4">
                    Features
                  </th>
                  <th className="p-4 text-center font-semibold text-green-700 dark:text-green-400 border-b border-zinc-300 dark:border-zinc-800 w-1/4">
                    <div className="flex flex-col items-center">
                      <span>4Markdown</span>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded mt-1">
                        Recommended
                      </span>
                    </div>
                  </th>
                  <th className="p-4 text-center font-semibold text-gray-800 dark:text-gray-200 border-b border-zinc-300 dark:border-zinc-800 w-1/4">
                    Traditional Markdown Editors
                  </th>
                  <th className="p-4 text-center font-semibold text-gray-800 dark:text-gray-200 border-b border-zinc-300 dark:border-zinc-800 w-1/4">
                    Note-taking Apps
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 font-medium">
                    Markdown Support
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Full syntax + extensions
                      </span>
                      <svg
                        className="w-6 h-6 text-green-700 dark:text-green-400 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Basic/Standard
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Limited/None
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 font-medium">
                    Visual Mindmapping
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Built-in, bidirectional
                      </span>
                      <svg
                        className="w-6 h-6 text-green-700 dark:text-green-400 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    None/Plugin required
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Limited
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 font-medium">
                    AI Assistance
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Grammar, style, expansion
                      </span>
                      <svg
                        className="w-6 h-6 text-green-700 dark:text-green-400 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    None
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Basic/None
                  </td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 font-medium">
                    Export Options
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        10+ formats
                      </span>
                      <svg
                        className="w-6 h-6 text-green-700 dark:text-green-400 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    2-5 formats
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Limited
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 font-medium">
                    Pricing Model
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Freemium + token-based
                      </span>
                      <svg
                        className="w-6 h-6 text-green-700 dark:text-green-400 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Subscription/One-time
                  </td>
                  <td className="p-4 border-b border-zinc-300 dark:border-zinc-800 text-center">
                    Subscription
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comparison cards - mobile version */}
          <div className="md:hidden space-y-6">
            {/* 4Markdown Card */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border-2 border-green-600 dark:border-green-500 overflow-hidden">
              <div className="bg-green-600 dark:bg-green-700 p-3">
                <h3 className="text-xl font-bold text-white text-center">
                  4Markdown
                </h3>
                <p className="text-white/80 text-sm text-center">Recommended</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium dark:text-white">
                      Markdown Support
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Full syntax + extensions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium dark:text-white">
                      Visual Mindmapping
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Built-in, bidirectional
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium dark:text-white">AI Assistance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Grammar, style, expansion
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium dark:text-white">
                      Export Options
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      10+ formats
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium dark:text-white">Pricing Model</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Freemium + token-based
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Editors Brief Comparison */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-zinc-300 dark:border-zinc-800 p-4">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                Other Solutions
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium dark:text-white">
                    Traditional Markdown Editors
                  </h4>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      No built-in mindmapping
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Limited or no AI assistance
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium dark:text-white">
                    Note-taking Apps
                  </h4>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Limited markdown support
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 text-red-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Higher monthly subscription costs
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-md inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Started Guide Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            Get Started in Minutes
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Follow these simple steps to begin your markdown journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 border border-zinc-300 dark:border-zinc-800">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                1. Create an Account
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sign up for free and get access to basic features immediately.
                No credit card required.
              </p>
              <Link
                to="/signup"
                className="text-green-700 dark:text-green-400 font-medium inline-flex items-center"
              >
                Sign up free
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 border border-zinc-300 dark:border-zinc-800">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                2. Customize Your Workspace
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Set up your preferences, choose themes, and configure keyboard
                shortcuts to match your workflow.
              </p>
              <Link
                to="/docs/customization"
                className="text-green-700 dark:text-green-400 font-medium inline-flex items-center"
              >
                Explore settings
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 border border-zinc-300 dark:border-zinc-800">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-700 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                3. Create Your First Document
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start writing in Markdown or import existing files. Our editor
                supports all standard Markdown syntax.
              </p>
              <Link
                to="/docs/getting-started"
                className="text-green-700 dark:text-green-400 font-medium inline-flex items-center"
              >
                View tutorial
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl p-6 md:p-8 border border-zinc-300 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-semibold mb-2 dark:text-white">
                  Need Help Getting Started?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Check out our comprehensive documentation and video tutorials
                  to master 4Markdown and boost your productivity.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/docs"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md inline-flex items-center border border-zinc-300 dark:border-zinc-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Documentation
                  </Link>
                  <Link
                    to="/tutorials"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md inline-flex items-center border border-zinc-300 dark:border-zinc-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Video Tutorials
                  </Link>
                  <Link
                    to="/community"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-md inline-flex items-center border border-zinc-300 dark:border-zinc-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Community Forum
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden border border-zinc-300 dark:border-zinc-700">
                  <div className="p-1 bg-gray-100 dark:bg-gray-900 border-b border-zinc-300 dark:border-zinc-700 flex">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-4 text-sm font-mono bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <span className="text-blue-600 dark:text-blue-400">
                      # Welcome to 4Markdown
                    </span>
                    <br />
                    <br />
                    <span className="text-gray-800 dark:text-gray-200">
                      Start typing here...
                    </span>
                    <br />
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            Token Pricing
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Purchase tokens for premium features like AI-powered writing and
            mindmap expansion
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pricing Option 1 */}
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">
                Starter
              </h3>
              <p className="text-5xl font-bold text-center mb-6 text-green-700 dark:text-green-400">
                100
              </p>
              <p className="text-2xl font-semibold text-center mb-8 dark:text-white">
                $2.50
              </p>
              <button className="w-full bg-gray-300 hover:bg-gray-400/70 dark:bg-slate-800 dark:hover:bg-slate-800/70 text-black dark:text-white font-semibold py-2 px-4 rounded-md">
                Buy Tokens
              </button>
            </div>

            {/* Pricing Option 2 */}
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">
                Popular
              </h3>
              <p className="text-5xl font-bold text-center mb-6 text-green-700 dark:text-green-400">
                1,000
              </p>
              <p className="text-2xl font-semibold text-center mb-8 dark:text-white">
                $15
              </p>
              <button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md">
                Buy Tokens
              </button>
            </div>

            {/* Pricing Option 3 */}
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">
                Professional
              </h3>
              <p className="text-5xl font-bold text-center mb-6 text-green-700 dark:text-green-400">
                10,000
              </p>
              <p className="text-2xl font-semibold text-center mb-8 dark:text-white">
                $99
              </p>
              <button className="w-full bg-gray-300 hover:bg-gray-400/70 dark:bg-slate-800 dark:hover:bg-slate-800/70 text-black dark:text-white font-semibold py-2 px-4 rounded-md">
                Buy Tokens
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            What Our Users Say
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Join thousands of writers and thinkers who love 4Markdown
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <p className="italic mb-6 text-gray-600 dark:text-gray-300">
                &ldquo;The combination of markdown editing and mindmapping has
                completely transformed my workflow. I use 4Markdown for
                everything from blog posts to project planning.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-gray-300 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center text-black dark:text-white font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <p className="font-semibold dark:text-white">Jane Doe</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Content Creator
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border border-zinc-300 dark:border-zinc-800">
              <p className="italic mb-6 text-gray-600 dark:text-gray-300">
                &ldquo;The AI writing suggestions are incredibly accurate.
                It&rsquo;s like having a writing coach watching over my
                shoulder, but without the pressure!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="bg-gray-300 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center text-black dark:text-white font-bold">
                  MS
                </div>
                <div className="ml-4">
                  <p className="font-semibold dark:text-white">Mark Smith</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Technical Writer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
            Find answers to common questions about our services and products.
          </p>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="border-b border-zinc-300 dark:border-zinc-800 pb-6"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`flex items-center justify-between w-full text-left`}
                  aria-expanded={openFAQs.includes(index)}
                  aria-controls={`faq-content-${index}`}
                >
                  <h3 className="text-xl font-medium dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${openFAQs.includes(index) ? `rotate-180` : ``}`}
                    fill={`none`}
                    stroke={`currentColor`}
                    viewBox={`0 0 24 24`}
                    xmlns={`http://www.w3.org/2000/svg`}
                  >
                    <path
                      strokeLinecap={`round`}
                      strokeLinejoin={`round`}
                      strokeWidth={`2`}
                      d={`M19 9l-7 7-7-7`}
                    ></path>
                  </svg>
                </button>

                <div
                  id={`faq-content-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQs.includes(index)
                      ? `max-h-96 opacity-100 mt-4`
                      : `max-h-0 opacity-0`
                  }`}
                >
                  <p className={`text-gray-600 dark:text-gray-300`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            See 4Markdown in Action
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Watch how our editor, mindmap, and AI tools work together
          </p>
          <Link
            to="/"
            className="bg-white hover:bg-gray-100 text-green-700 font-semibold py-3 px-8 rounded-md text-lg inline-block"
          >
            Start Writing for Free
          </Link>
        </div>
      </section>

      <AppFooterContainer />
    </>
  );
};

export { HomeView };
