import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiftIcon, SparklesIcon, ShoppingBagIcon, ShoppingCartIcon, MenuIcon, SearchIcon, ChevronRightIcon, StarIcon, ZapIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { GiftCarousel } from './GiftCarousel';
import { fetchCollectionProducts, ShopifyProduct } from '../services/shopifyService';
import { ModeIndicator } from './ModeIndicator';
import { getApiBaseUrl } from '../utils/apiConfig';
export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popularGiftIdeasRef = useRef<HTMLElement>(null);
  
  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  // Add reference for Gift Inspiration section
  const giftInspirationRef = useRef<HTMLElement>(null);
  // Add states for product data
  const [forHimProducts, setForHimProducts] = useState<any[]>([]);
  const [forHerProducts, setForHerProducts] = useState<any[]>([]);
  const [isLoadingHim, setIsLoadingHim] = useState(true);
  const [isLoadingHer, setIsLoadingHer] = useState(true);
  // Trigger API config detection/logging on initial load (so ?mode=dev prints immediately)
  useEffect(() => {
    try {
      getApiBaseUrl();
    } catch {}
  }, []);
  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch "for him" products
        setIsLoadingHim(true);
        const himProducts = await fetchCollectionProducts('for-him', 50); // Added price limit parameter
        // Transform to GiftItem format
        const himGiftItems = himProducts.map(product => ({
          image: product.featuredImage?.url || 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg',
          name: product.title,
          price: product.variants[0]?.price ? `£${product.variants[0].price.toFixed(2)}` : '£0.00',
          rating: 4.5,
          description: product.description || `${product.title} - a perfect gift idea`,
          sku: product.variants[0]?.sku || ''
        }));
        setForHimProducts(himGiftItems);
        setIsLoadingHim(false);
        // Fetch "for her" products
        setIsLoadingHer(true);
        const herProducts = await fetchCollectionProducts('for-her', 50); // Added price limit parameter
        // Transform to GiftItem format
        const herGiftItems = herProducts.map(product => ({
          image: product.featuredImage?.url || 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg',
          name: product.title,
          price: product.variants[0]?.price ? `£${product.variants[0].price.toFixed(2)}` : '£0.00',
          rating: 4.7,
          description: product.description || `${product.title} - a perfect gift idea`,
          sku: product.variants[0]?.sku || ''
        }));
        setForHerProducts(herGiftItems);
        setIsLoadingHer(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoadingHim(false);
        setIsLoadingHer(false);
      }
    };
    fetchProducts();
  }, []);

  // Newsletter signup handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      // Create form data for Mailchimp
      const formData = new FormData();
      formData.append('EMAIL', newsletterEmail);
      
      // Submit to Mailchimp
      const response = await fetch('https://simplysent.us21.list-manage.com/subscribe/post?u=3b085c2372019cf71eb4fa459&id=42bf4a93a4&f_id=001f80e6f0', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Mailchimp
      });

      // Since we're using no-cors, we can't read the response
      // We'll assume success and show success message
      setNewsletterStatus('success');
      setNewsletterMessage('Thank you for subscribing!');
      setNewsletterEmail('');
      
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Something went wrong. Please try again.');
    }
  };

  // Function to handle smooth scrolling to the Popular Gift Ideas section
  const scrollToGiftIdeas = (e: React.MouseEvent) => {
    e.preventDefault();
    if (popularGiftIdeasRef.current) {
      const yOffset = -20; // Add a small offset from the top
      const y = popularGiftIdeasRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  // Function to handle smooth scrolling to the Gift Inspiration section
  const scrollToGiftInspiration = (e: React.MouseEvent) => {
    e.preventDefault();
    if (giftInspirationRef.current) {
      const yOffset = -20; // Add a small offset from the top
      const y = giftInspirationRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  return (
    <>
      
      <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.4
      }} className="w-full">
      {/* Header */}
      <header className="py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo - removed hover scale effect */}
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="SimplySent" className="h-10" />
            </Link>
            {/* Desktop Navigation - Home removed */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#popular-gift-ideas" onClick={scrollToGiftIdeas} className="text-gray-800 hover:text-purple-600 font-medium">
                Gift Guides
              </a>
              <a href="#gift-inspiration" onClick={scrollToGiftInspiration} className="text-gray-800 hover:text-purple-600 font-medium">
                Blog
              </a>
              <Link to="/results" className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium px-6 py-3 rounded-2xl shadow-md transition-all transform hover:scale-105 flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2 text-purple-200" />
                AI Gift Finder
              </Link>
            </nav>
            {/* Right-side controls: mode pill (always visible) + mobile menu */}
            <div className="flex items-center gap-3">
              <ModeIndicator />
              <button className="md:hidden text-gray-700 hover:text-purple-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          {/* Mobile Navigation - Home removed */}
          {mobileMenuOpen && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} className="md:hidden mt-4 py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a href="#popular-gift-ideas" onClick={scrollToGiftIdeas} className="text-gray-800 hover:text-purple-600 font-medium">
                  Gift Guides
                </a>
                <a href="#gift-inspiration" onClick={scrollToGiftInspiration} className="text-gray-800 hover:text-purple-600 font-medium">
                  Blog
                </a>
                <Link to="/results" className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium px-6 py-3 rounded-2xl shadow-md transition-all transform hover:scale-105 flex items-center w-fit">
                  <SparklesIcon className="w-4 h-4 mr-2 text-purple-200" />
                  AI Gift Finder
                </Link>
              </div>
            </motion.div>}
        </div>
      </header>

      {/* Hero Section - Fixed: Only change height on mobile, not tablet/desktop */}
      <section className="relative overflow-hidden mx-[calc(50%-50vw)] md:mx-0 w-screen md:w-auto py-16 md:py-24 min-h-[600px] md:min-h-0 flex md:block items-center">
        {/* Simplified background design with static gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900"></div>
        {/* Simplified static overlay - removed animated elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-400/20 via-transparent to-transparent"></div>
        </div>
        {/* Enhanced textured overlay - static */}
        <div className="absolute inset-0 opacity-15 mix-blend-soft-light" style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')",
        backgroundRepeat: 'repeat'
      }}></div>
        {/* Animated gradient blobs for depth */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div 
            className="absolute -top-16 -left-16 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-fuchsia-500/30 to-purple-500/30 blur-3xl"
            animate={{
              x: [0, 20, -10, 0],
              y: [0, -15, 10, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute -bottom-16 -right-16 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-indigo-500/30 to-pink-500/30 blur-3xl"
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 20, -5, 0],
              scale: [1, 0.8, 1.2, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </div>
        {/* Subtle static grid overlay (desktop only) */}
        <div className="hidden md:block absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)'
      }}></div>
        {/* Dancing sparkle elements */}
        <motion.div 
          className="absolute left-[2%] md:left-[5%] top-[15%] md:top-[15%] w-10 h-10 md:w-14 md:h-14"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 0.8, 1],
            y: [0, -10, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(249,168,212,0.9)" />
          </svg>
        </motion.div>
        {/* Dancing gift box */}
        <motion.div 
          className="absolute right-[8%] bottom-[15%] md:bottom-[15%] w-16 h-16 md:w-24 md:h-24"
          animate={{
            rotate: [0, -8, 8, 0],
            scale: [1, 1.1, 0.95, 1],
            x: [0, 5, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="giftBoxTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <linearGradient id="giftBoxBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E879F9" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d="M20 12V22H4V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#giftBoxBottom)" filter="url(#glow)" />
            <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#giftBoxTop)" filter="url(#glow)" />
            <path d="M12 22V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#F9A8D4" />
            <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#C4B5FD" />
          </svg>
        </motion.div>
        
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-[25%] left-[15%] w-6 h-6 md:w-8 md:h-8 text-pink-300"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
        
        <motion.div 
          className="absolute top-[35%] right-[20%] w-5 h-5 md:w-7 md:h-7 text-purple-300"
          animate={{
            x: [0, 15, -15, 0],
            y: [0, -10, 10, 0],
            scale: [1, 1.3, 0.8, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎁
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[25%] left-[10%] w-4 h-4 md:w-6 md:h-6 text-yellow-300"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 1],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>
        
        <motion.div 
          className="absolute top-[45%] left-[25%] w-3 h-3 md:w-5 md:h-5 text-pink-200"
          animate={{
            x: [0, 10, -5, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💝
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[35%] right-[15%] w-4 h-4 md:w-6 md:h-6 text-indigo-300"
          animate={{
            y: [0, -25, 0],
            rotate: [0, -180, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎉
        </motion.div>
        
        {/* Content container with enhanced styling - adjusted for full width on mobile */}
        <div className="w-full px-4 md:container md:mx-auto md:px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg relative z-10"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(236, 72, 153, 0.3)",
                    "0 0 30px rgba(147, 51, 234, 0.4)",
                    "0 0 20px rgba(236, 72, 153, 0.3)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Find the Perfect Gift <br className="hidden md:block" />
                <span className="relative">
                  <motion.span 
                    className="relative inline-block"
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    in 3 Minutes
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-3 bg-pink-400/60 rounded-full"
                      animate={{
                        scaleX: [1, 1.1, 1],
                        opacity: [0.6, 0.9, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                  </motion.span>
                </span>
              </motion.h1>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 blur-xl"></div>
            </div>
            <p className="text-xl text-white mb-10 font-medium drop-shadow-lg">
              Discover curated gift guides or get personalised AI
              recommendations for any occasion.
            </p>
            {/* Top hero section buttons with disabled hover effects on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#popular-gift-ideas" onClick={scrollToGiftIdeas} className="bg-white hover:bg-gray-100 text-purple-800 font-bold py-3 px-8 rounded-2xl shadow-lg transition-all relative overflow-hidden group">
                <span className="relative z-10">Browse Gift Guides</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"></span>
              </a>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-2xl"></div>
                <Link to="/results" className="relative bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-pink-200" />
                  <span>Try the AI Gift Finder</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gift Guide Section - Completely redesigned header styling */}
      <section ref={popularGiftIdeasRef} id="popular-gift-ideas" className="py-16 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 rounded-b-3xl">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            {/* Redesigned Popular Gift Ideas header without box */}
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="mb-8">
              <h2 className="text-3xl md:text-5xl font-bold relative inline-block">
                <span className="relative">
                  <span className="absolute -inset-1 -skew-x-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg -z-10 transform rotate-1"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 py-2 px-1">
                    Popular Gift Ideas
                  </span>
                </span>
                <motion.div className="h-1.5 w-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2" initial={{
                scaleX: 0
              }} animate={{
                scaleX: 1
              }} transition={{
                delay: 0.3,
                duration: 0.6
              }}></motion.div>
                <motion.div className="absolute -right-8 -top-6 text-pink-500 text-2xl" animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }} transition={{
                repeat: Infinity,
                duration: 3
              }}>
                  ✨
                </motion.div>
              </h2>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.5
          }} className="text-center mb-8">
              <span className="relative inline-flex items-center justify-center">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-md opacity-70"></span>
                <span className="relative px-6 py-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-lg">
                  Thoughtful gifts under £50
                </span>
                <motion.span className="absolute -right-3 -top-3 text-pink-500 text-xl" animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }} transition={{
                repeat: Infinity,
                duration: 3
              }}>
                  ✨
                </motion.span>
              </span>
            </motion.div>
          </div>
          {/* Gift sections side by side with consistent height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gifts for Him Section */}
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center font-heading relative">
                <span className="relative inline-block">
                  <span className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-blue-200 to-indigo-200 transform -skew-x-12 opacity-30 rounded-lg"></span>
                  <span className="relative bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Gifts for Him
                  </span>
                </span>
                <div className="absolute w-8 h-8 -top-4 -right-4 text-blue-400 opacity-50 transform rotate-12">
                  ♂
                </div>
              </h3>
              {/* Carousel for products */}
              <div className="flex-grow">
                <GiftCarousel items={forHimProducts.slice(0, 4)} theme="purple" isLoading={isLoadingHim} />
              </div>
              <div className="mt-4 text-center">
                <Link to="/for-him" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100 px-5 py-2 rounded-xl transition-colors">
                  View all gifts for him
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            {/* Gifts for Her Section */}
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center font-heading relative">
                <span className="relative inline-block">
                  <span className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-pink-200 to-rose-200 transform -skew-x-12 opacity-30 rounded-lg"></span>
                  <span className="relative bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Gifts for Her
                  </span>
                </span>
                <div className="absolute w-8 h-8 -top-4 -right-4 text-pink-400 opacity-50 transform rotate-12">
                  ♀
                </div>
              </h3>
              {/* Carousel for products */}
              <div className="flex-grow">
                <GiftCarousel items={forHerProducts.slice(0, 4)} theme="pink" isLoading={isLoadingHer} />
              </div>
              <div className="mt-4 text-center">
                <Link to="/for-her" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100 px-5 py-2 rounded-xl transition-colors">
                  View all gifts for her
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Preview Section - Soften corners */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white relative overflow-hidden rounded-3xl my-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }} className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-200" />
                <span className="text-purple-100 font-medium">
                  AI-Powered Recommendations
                </span>
              </motion.div>
              <motion.h2 initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }} className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
                Experience the Magic of Our AI Gift Finder
              </motion.h2>
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }} className="relative inline-block">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-px rounded-xl">
                  <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl px-6 py-3">
                    <div className="flex items-center space-x-2">
                      <ZapIcon className="w-8 h-8 md:w-5 md:h-5 text-purple-200" />
                      <p className="text-white/90 font-medium text-sm md:text-base">
                        For a 65-year-old Father who loves cooking, golf and camping
                        (£30-£140)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Recommendation Cards - Soften corners */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* AI Recommendation 1 - Soften corners */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group flex flex-col h-full">
                <div className="relative">
                  <img src="https://cdn.shopify.com/s/files/1/0938/0885/3335/files/81bLGw30NOL._AC_SL1500.jpg?v=1755196234" alt="BAYINBULAK Golf Chipping Practice Net" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      Golf Chipping Net
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £33.85
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm mb-4 flex-1">
                    Full Package - Includes foldable chipping net, ground stakes, storage bag and illustrated instruction sheet.
                  </p>
                </div>
              </div>
              {/* AI Recommendation 2 - Soften corners */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group flex flex-col h-full">
                <div className="relative">
                  <img src="https://cdn.shopify.com/s/files/1/0938/0885/3335/files/515MDb48RbL._AC_SL1000.jpg?v=1756487720" alt="Cadac 2 Cook 3 Pro Deluxe QR Camping Stove" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      Camping Stove
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £136.00
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm mb-4 flex-1">
                    One BBQ, multiple cooking variations. The possibility of discovery is endless with the 2 Cook 3 Pro Deluxe QR.
                  </p>
                </div>
              </div>
              {/* AI Recommendation 3 - Soften corners */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group flex flex-col h-full">
                <div className="relative">
                  <img src="https://cdn.shopify.com/s/files/1/0938/0885/3335/files/51DJrP4SKOL._AC_SL1500.jpg?v=1755195241" alt="Philips Air Fryer 2000 Series 6.2L" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      Air Fryer 6.2L
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £67.99
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm mb-4 flex-1">
                    RapidAir technology: Enjoy irresistibly crispy exteriors and tender interiors with minimal oil.
                  </p>
                </div>
              </div>
            </motion.div>
            {/* CTA Button - Soften corners */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.2
          }} className="mt-12 text-center">
              <Link to="/results" className="group bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all inline-flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-200" />
                <span>Try the AI Gift Finder</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog/Content Section - Redesigned header styling */}
      <section ref={giftInspirationRef} id="gift-inspiration" className="py-16 bg-gradient-to-br from-gray-50 to-pink-50 rounded-3xl my-8">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            {/* Redesigned Gift Inspiration header without box */}
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="mb-4">
              <h2 className="text-3xl md:text-5xl font-bold relative inline-block">
                <span className="relative">
                  <span className="absolute -inset-1 -skew-x-3 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 rounded-lg -z-10 transform rotate-1"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 py-2 px-1">
                    Gift Inspiration
                  </span>
                </span>
                <motion.div className="h-1.5 w-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mt-2" initial={{
                scaleX: 0
              }} animate={{
                scaleX: 1
              }} transition={{
                delay: 0.3,
                duration: 0.6
              }}></motion.div>
                <motion.div className="absolute -right-8 -top-6 text-indigo-500 text-2xl" animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }} transition={{
                repeat: Infinity,
                duration: 3
              }}>
                  💡
                </motion.div>
              </h2>
            </motion.div>
            <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }} className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full blur-md opacity-70"></span>
              <span className="relative px-6 py-2 text-indigo-800 italic font-medium">
                Discover gift ideas and inspiration from our blog
              </span>
            </motion.p>
          </div>
          {/* Blog Post grid - Fixed to show 3 cards in a row on tablet/small desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Blog Post 1 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
              <img src="/app_screenshot1.png" alt="SimplySent Mobile App" className="w-full h-48 object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  App Announcement
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  🎉 SimplySent Mobile App Coming Soon!
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Your AI gift concierge is coming to mobile! Never forget a birthday again with our intelligent gift recommendation app...
                </p>
                <Link to="/app-release-blog" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm mt-auto">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            {/* Blog Post 2 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
              <img src="/like_a_boss.jpg" alt="How to Totally Boss Father's Day" className="w-full h-48 object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Father's Day
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  How to Totally Boss Father's Day
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Don't panic! We've put together a handy checklist to make sure your old man gets a great Father's Day...
                </p>
                <Link to="/fathers-day-guide" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm mt-auto">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            {/* Blog Post 3 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
              <img src="/time_street.jpg" alt="Budget Gifts Guide" className="w-full h-48 object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Budget Gifts
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  25 Thoughtful Gifts Under £20 That Don't Look Cheap
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  Discover impressive presents that won't break the bank but will still make a big impact on your loved ones...
                </p>
                <Link to="/budget-gifts-guide" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm mt-auto">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Fixed to be 100% width on mobile with no white spacing */}
      <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-16 rounded-t-3xl sm:rounded-t-3xl overflow-hidden w-screen -mx-4 sm:w-full sm:mx-0">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-700/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <svg className="absolute bottom-0 left-0 right-0 text-purple-900/20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,149.3C672,160,768,224,864,218.7C960,213,1056,139,1152,117.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Logo and description column */}
            <div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl h-full">
                <img src="/logo_dark.png" alt="SimplySent" className="h-10 mb-4 drop-shadow-lg" />
                <p className="text-purple-100 mb-4">
                  SimplySent helps you find the perfect gift for any occasion
                  using our curated gift guides and AI-powered recommendations.
                </p>
                <p className="text-purple-200 text-sm">
                  As an Amazon Associate we earn from qualifying purchases.
                </p>
                {/* Social media icons */}
                <div className="flex space-x-4 mt-6">
                  <motion.a 
                    href="https://www.facebook.com/simplysent.co" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }} 
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <span className="text-white text-lg font-bold">f</span>
                  </motion.a>
                  <motion.a 
                    href="https://www.instagram.com/simplysent.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }} 
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <span className="text-white text-sm font-bold">IG</span>
                  </motion.a>
                </div>
              </div>
            </div>
            {/* Quick Links Column */}
            <div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full shadow-xl">
                <h4 className="text-white font-semibold uppercase tracking-wider mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center mr-2">
                    <ChevronRightIcon className="w-5 h-5 text-purple-200" />
                  </span>
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/results" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      Gift Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/results" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/results" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      AI Gift Finder
                    </Link>
                  </li>
                  <li>
                    <Link to="/about-us" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:hello@simplysent.co" className="text-purple-200 hover:text-white transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Newsletter Column - Fix responsive layout */}
            <div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl h-full">
                <h4 className="text-white font-semibold uppercase tracking-wider mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center mr-2">
                    <SparklesIcon className="w-5 h-5 text-purple-200" />
                  </span>
                  Newsletter
                </h4>
                <p className="text-purple-200 mb-4 text-sm">
                  Subscribe for news on app release and offers
                </p>
                {newsletterStatus === 'success' ? (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 text-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-green-200 text-sm font-medium">
                      {newsletterMessage}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email" 
                      className="w-full bg-white/20 border border-purple-300/30 rounded-lg px-4 py-2 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                      required
                      disabled={newsletterStatus === 'loading'}
                    />
                    {newsletterStatus === 'error' && (
                      <p className="text-red-300 text-xs">{newsletterMessage}</p>
                    )}
                    <button 
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-400 disabled:to-pink-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {newsletterStatus === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          {/* Copyright bar with company links moved below */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-purple-200 mb-6">
              © {new Date().getFullYear()} SimplySent. All rights reserved.
            </p>
            {/* Company links moved here without header */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-2">
              <Link to="/about-us" className="text-purple-200 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <a href="mailto:hello@simplysent.co" className="text-purple-200 hover:text-white transition-colors text-sm">
                Contact
              </a>
              <Link to="/privacy-policy" className="text-purple-200 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-purple-200 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
    </>
  );
}