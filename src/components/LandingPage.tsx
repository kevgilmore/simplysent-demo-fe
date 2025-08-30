import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiftIcon, SparklesIcon, ShoppingBagIcon, ShoppingCartIcon, MenuIcon, SearchIcon, ChevronRightIcon, StarIcon, ZapIcon, ArrowRightIcon } from 'lucide-react';
import { GiftCarousel } from './GiftCarousel';
export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popularGiftIdeasRef = useRef<HTMLElement>(null);
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
  return <motion.div initial={{
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
              <Link to="/" className="text-gray-800 hover:text-purple-600 font-medium">
                Blog
              </Link>
              <Link to="/fathers-day" className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium px-5 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center">
                <SparklesIcon className="w-4 h-4 mr-2 text-purple-200" />
                AI Gift Finder
              </Link>
            </nav>
            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700 hover:text-purple-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon className="w-6 h-6" />
            </button>
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
                <Link to="/" className="text-gray-800 hover:text-purple-600 font-medium">
                  Blog
                </Link>
                <Link to="/fathers-day" className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center w-fit">
                  <SparklesIcon className="w-4 h-4 mr-2 text-purple-200" />
                  AI Gift Finder
                </Link>
              </div>
            </motion.div>}
        </div>
      </header>

      {/* Hero Section with darker purple company colors */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Enhanced background design with darker purple colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-900"></div>
        {/* Animated gradient overlay with pink/purple colors */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-400/20 via-transparent to-transparent animate-pulse"></div>
        </div>
        {/* Enhanced textured overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-soft-light" style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')",
        backgroundRepeat: 'repeat'
      }}></div>
        {/* Enhanced gift box animation with vibrant gradient colors */}
        <motion.div className="absolute right-[8%] bottom-[25%] md:bottom-[15%] w-16 h-16 md:w-24 md:h-24" initial={{
        y: 0,
        rotate: 0
      }} animate={{
        y: [-10, 10, -10],
        rotate: [0, 5, -5, 0]
      }} transition={{
        repeat: Infinity,
        duration: 4,
        ease: 'easeInOut'
      }}>
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
        {/* Repositioned floating sparkle elements with pink colors */}
        <motion.div className="absolute left-[2%] md:left-[5%] top-[15%] w-10 h-10 md:w-14 md:h-14" initial={{
        opacity: 0,
        scale: 0
      }} animate={{
        opacity: 1,
        scale: [0, 1.2, 1]
      }} transition={{
        delay: 0.8,
        duration: 1
      }}>
          <motion.svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg" animate={{
          rotate: 360
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(249,168,212,0.9)" />
          </motion.svg>
        </motion.div>
        <motion.div className="absolute right-[5%] top-[25%] w-8 h-8 md:w-12 md:h-12" initial={{
        opacity: 0,
        scale: 0
      }} animate={{
        opacity: 1,
        scale: [0, 1.2, 1]
      }} transition={{
        delay: 1,
        duration: 1
      }}>
          <motion.svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg" animate={{
          rotate: -360
        }} transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(196,181,253,0.9)" />
          </motion.svg>
        </motion.div>
        {/* Repositioned floating confetti elements with purple/pink colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({
          length: 12
        }).map((_, i) => <motion.div key={i} className={`absolute w-2 h-2 rounded-full bg-${['purple', 'pink', 'fuchsia', 'violet', 'rose'][i % 5]}-300`} style={{
          left: `${i % 2 === 0 ? Math.random() * 30 : 70 + Math.random() * 30}%`,
          top: `-20px`
        }} animate={{
          y: ['0vh', '100vh'],
          x: [0, Math.random() * 40 - 20],
          rotate: [0, Math.random() * 360]
        }} transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: 'linear'
        }} />)}
        </div>
        {/* Enhanced wavy shapes with animation and purple/pink colors */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <motion.div animate={{
          x: [0, 10, -10, 0]
        }} transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
              <path fill="rgba(216,180,254,0.15)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,224,576,218.7C672,213,768,235,864,245.3C960,256,1056,256,1152,234.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </motion.div>
          <motion.div animate={{
          x: [0, -15, 15, 0]
        }} transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut'
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full opacity-50">
              <path fill="rgba(244,114,182,0.2)" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,245.3C960,256,1056,256,1152,234.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </motion.div>
        </div>
        {/* Content container with enhanced styling */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="relative inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg relative z-10">
                Find the Perfect Gift <br className="hidden md:block" />
                <span className="relative">
                  <span className="relative inline-block">
                    in 3 Minutes
                    <motion.div className="absolute -bottom-2 left-0 right-0 h-3 bg-pink-400/60 rounded-full" initial={{
                    scaleX: 0
                  }} animate={{
                    scaleX: 1
                  }} transition={{
                    delay: 0.6,
                    duration: 0.8
                  }}></motion.div>
                  </span>
                </span>
              </h1>
              <motion.div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 blur-xl" animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }} transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut'
            }}></motion.div>
            </motion.div>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-xl text-white mb-10 font-medium drop-shadow-lg">
              Discover curated gift guides or get personalised AI
              recommendations for any occasion.
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a href="#popular-gift-ideas" onClick={scrollToGiftIdeas} className="bg-white hover:bg-gray-100 text-purple-800 font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-105 relative overflow-hidden group" whileHover={{
              y: -3
            }} whileTap={{
              scale: 0.98
            }}>
                <span className="relative z-10">Browse Gift Guides</span>
                <motion.span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity"></motion.span>
              </motion.a>
              <motion.div whileHover={{
              y: -3
            }} whileTap={{
              scale: 0.98
            }} className="relative">
                <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-2xl group-hover:opacity-100 transition" animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }} transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut'
              }}></motion.div>
                <Link to="/fathers-day" className="relative bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-pink-200" />
                  <span>Try the AI Gift Finder</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Gift Guide Section - Improved flow and gradient */}
      <section ref={popularGiftIdeasRef} id="popular-gift-ideas" className="py-16 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 rounded-b-3xl">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-pink-500" style={{
            textShadow: '0 0 1px rgba(168, 85, 247, 0.4)'
          }}>
              Popular Gift Ideas
            </h2>
            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.5
          }} className="relative inline-block">
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
          {/* Gift sections side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gifts for Him Section */}
            <div>
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
              <GiftCarousel items={[{
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Wireless Bluetooth Headphones',
              price: '49.99',
              rating: 4.0,
              description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.'
            }, {
              image: 'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Portable Bluetooth Speaker',
              price: '45.99',
              rating: 4.9,
              description: 'Waterproof portable speaker with rich bass, 24-hour playtime and built-in power bank.'
            }, {
              image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Fitness Smart Watch',
              price: '39.99',
              rating: 4.3,
              description: 'Track fitness goals with heart rate monitoring, GPS, and smartphone notifications.'
            }, {
              image: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'RFID Leather Wallet',
              price: '29.99',
              rating: 4.7,
              description: 'Genuine leather wallet with RFID blocking technology and multiple card slots.'
            }]} theme="purple" />
              <div className="mt-4 text-center">
                <Link to="/for-him" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100 px-5 py-2 rounded-xl transition-colors">
                  View all gifts for him
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            {/* Gifts for Her Section */}
            <div>
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
              <GiftCarousel items={[{
              image: 'https://images.unsplash.com/photo-1600703136783-bdb5ea365239?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Artisan Chocolate Gift Box',
              price: '39.99',
              rating: 4.8,
              description: 'Luxury assortment of handcrafted chocolates with unique flavor combinations.'
            }, {
              image: 'https://images.unsplash.com/photo-1608181831718-de794d5eac08?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Luxury Scented Candle Set',
              price: '49.99',
              rating: 4.9,
              description: 'Set of three premium hand-poured soy candles with sophisticated scent profiles.'
            }, {
              image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Luxury Bath and Spa Set',
              price: '44.99',
              rating: 4.8,
              description: 'Premium bath products for a relaxing at-home spa experience in a keepsake basket.'
            }, {
              image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              name: 'Birth Flower Necklace',
              price: '34.99',
              rating: 4.7,
              description: 'Delicate necklace with birth month flower preserved in crystal clear resin.'
            }]} theme="pink" />
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
                      <ZapIcon className="w-5 h-5 text-purple-200" />
                      <p className="text-white/90 font-medium">
                        For a 65-year-old father who loves golf and tech
                        (£20-£50)
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
          }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI Recommendation 1 - Soften corners */}
              <motion.div whileHover={{
              y: -8,
              scale: 1.02
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17
            }} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Golf Accessory" className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      Golf Ball Finder
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £24.99
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    Ultra-bright LED technology helps locate lost golf balls in
                    rough or low light conditions.
                  </p>
                  <a href="#" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center text-sm">
                    <ShoppingCartIcon className="w-3 h-3 mr-1" />
                    View on Amazon
                  </a>
                </div>
              </motion.div>
              {/* AI Recommendation 2 - Soften corners */}
              <motion.div whileHover={{
              y: -8,
              scale: 1.02
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17
            }} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Smart Watch" className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      GPS Rangefinder Watch
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £49.99
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    Wearable tech with preloaded golf courses and precise
                    distance measurements to greens and hazards.
                  </p>
                  <a href="#" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center text-sm">
                    <ShoppingCartIcon className="w-3 h-3 mr-1" />
                    View on Amazon
                  </a>
                </div>
              </motion.div>
              {/* AI Recommendation 3 - Soften corners */}
              <motion.div whileHover={{
              y: -8,
              scale: 1.02
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17
            }} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Tech Gadget" className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-white font-bold text-lg">
                      Golf Swing Analyzer
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      £34.99
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    Bluetooth device that attaches to any club and provides
                    real-time swing analysis on your smartphone.
                  </p>
                  <a href="#" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center text-sm">
                    <ShoppingCartIcon className="w-3 h-3 mr-1" />
                    View on Amazon
                  </a>
                </div>
              </motion.div>
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
            duration: 0.6,
            delay: 0.5
          }} className="mt-12 text-center">
              <Link to="/fathers-day" className="group bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all inline-flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-200" />
                <span>Try the AI Gift Finder</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog/Content Section - Soften corners */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-pink-50 rounded-3xl my-8">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500" style={{
            textShadow: '0 0 1px rgba(168, 85, 247, 0.4)'
          }}>
              Gift Inspiration
            </h2>
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
              <span className="relative inline-block px-8 py-3">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-lg transform -rotate-1"></span>
                <span className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-lg transform rotate-1 opacity-50"></span>
                <span className="relative font-medium text-purple-800 italic">
                  Discover gift ideas and inspiration from our blog
                </span>
                <motion.span className="absolute -right-2 -bottom-2 text-purple-500" animate={{
                y: [0, -5, 0]
              }} transition={{
                repeat: Infinity,
                duration: 2
              }}>
                  💫
                </motion.span>
              </span>
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Post 1 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Gift Wrapping" className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Guides
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  10 Creative Gift Wrapping Ideas for Any Occasion
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Transform ordinary presents into extraordinary gifts with
                  these simple yet stunning wrapping techniques...
                </p>
                <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            {/* Blog Post 2 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Father's Day" className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Guides
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  The Ultimate Father's Day Gift Guide for 2023
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find the perfect way to show your appreciation with our
                  curated selection of gifts for every type of dad...
                </p>
                <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            {/* Blog Post 3 - Soften corners */}
            <motion.div whileHover={{
            y: -5
          }} className="bg-gradient-to-b from-purple-50 to-pink-100 rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Budget Gifts" className="w-full h-48 object-cover" />
              <div className="p-5">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                  Tips
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">
                  25 Thoughtful Gifts Under £20 That Don't Look Cheap
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Impressive presents that won't break the bank but will still
                  make a big impact on your loved ones...
                </p>
                <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center text-sm">
                  Read more
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Soften corners */}
      <footer className="bg-gradient-to-r from-gray-50 to-purple-50 border-t border-gray-100 py-12 rounded-t-3xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src="/logo.png" alt="SimplySent" className="h-8 mb-4" />
              <p className="text-gray-600 mb-4 max-w-md">
                SimplySent helps you find the perfect gift for any occasion
                using our curated gift guides and AI-powered recommendations.
              </p>
              <p className="text-sm text-gray-500">
                As an Amazon Associate we earn from qualifying purchases.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#popular-gift-ideas" onClick={scrollToGiftIdeas} className="text-gray-600 hover:text-purple-600">
                    Gift Guides
                  </a>
                </li>
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/fathers-day" className="text-gray-600 hover:text-purple-600">
                    AI Gift Finder
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-600 hover:text-purple-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} SimplySent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>;
}