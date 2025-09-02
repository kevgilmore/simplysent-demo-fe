import React, { useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react';
export function BlogPost2() {
  const navigate = useNavigate();
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="SimplySent" className="h-10" />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-800 hover:text-purple-600 font-medium">
                Home
              </Link>
              <Link to="/fathers-day" className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium px-6 py-3 rounded-2xl shadow-md transition-all transform hover:scale-105 flex items-center">
                AI Gift Finder
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <motion.button initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.2
        }} onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <div className="mb-8">
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                Father's Day
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                How to Totally Boss Father's Day
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <span>Published: June 13, 2020</span>
                <span className="mx-2">•</span>
                <span>6 min read</span>
              </div>
            </div>
            <img src="/like_a_boss.jpg" alt="Like a boss" className="w-full h-80 object-cover rounded-2xl mb-8" />
            <div className="prose prose-lg max-w-none">
              <p>
                We know, we know. You didn't forget. You definitely know that Father's Day is almost here, and you're totally sorted, right?
              </p>
              <p>
                No?
              </p>
              <p>
                Don't panic! We've put together a handy checklist to make sure your old man gets a great Father's Day — and you get to beat the stress!
              </p>
              
              <h2>1. The Gift List</h2>
              <p>
                Ok, the first thing you're going to need is a gift. But a pair of Best Dad EVER!!! socks just isn't going to cut it. Sorry. You're not 8 anymore. If you've got the budget, get him something he can keep, like an engraved watch or treat him to the latest iPhone. Hey, he raised you into the excellent person you are. He deserves it.
              </p>
              <p>
                If you've got a million-dollar dad on a dime store budget, however, you'll need to get creative. Sometimes the simple things have the most impact — so get your siblings together and re-create a precious photo from your childhood, or offer your services for the day as a car washer or to help out with some DIY. He'll love the gesture as much as you love him.
              </p>
              <p>
                <a href="https://www.buzzfeed.com/jennaguillaume/hilariously-recreated-childhood-photos" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">Check out these hilariously recreated childhood photos</a>
              </p>
              
              <h2>2. The Way to His Heart Is Through His Stomach</h2>
              <p>
                What could be more special than sharing a meal on Father's Day? Spend time together, show you care, and you get to eat! Bonus! Cook from scratch (and don't forget to wash up!) or book a table at your dad's favourite restaurant — but remember, it's a busy day so call well in advance! Apps like OpenTable and Urbanspoon can help you search out that little-known tandoori with the 5-star rating. Check out the ratings on TripAdvisor — and this time, it's your turn to pay!
              </p>
              <p>
                <a href="https://www.tripadvisor.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">Visit TripAdvisor for restaurant reviews</a>
              </p>
              
              <h2>3. Let's Get Messy</h2>
              <p>
                If you're spoiling the father of your own kids, or you've got kids of your own now who call your dad Grandpa, it's time to whip out the arts and crafts box. Now, you may think it's your mum who keeps all those Christmas tree ornaments you made at school, but trust us; even if he doesn't show it, your Dad is just as soppy on the inside. No father needs yet another Rad Dad!!! mug from a card shop (we've all been there, it's OK) but a hand-made, badly-spelled, wonky-but-wonderful Dad's Shed sign is something he'll keep forever. And the kids can make him something too!
              </p>
              <p>
                Pinterest is your friend: check out some craft ideas.
              </p>
              
              <h2>4. Father's Day: Extreme Edition</h2>
              <p>
                If you're looking for a more extreme way to express your love for the dad in your life, it's time to think BIG. Help your dad tick something off the bucket list with an experience day. What dad would pass up the opportunity to push their offspring out of a plane or fire at you from a WW2 tank? If your dad knows his cask finish from his Captains' reserve, a tour of Ireland's whisky distilleries will guarantee you both a great weekend to (hopefully) remember. There are lots of advantages to booking an experience — you don't have to wrap it, for one! And if you're reading this last minute (and if it's Father's Day today, you're really cutting it fine) a lot of experiences can be booked online. You are only a phone call away from getting your dad that zorb-football day you just know he's always wanted…
              </p>
              
              <h2>5. Automate</h2>
              <p>
                If you're not going to see your Dad this Father's Day, then what you need is the perfect solution. If you're anything like us, gift-giving is the one thing you always forget. Never fear! Technology to the rescue! Drop whatever you're doing and check out SimplySent - we're building an amazing AI-powered gifting app that will automatically find and send your nearest and dearest the perfect gifts on the dates you choose every year. Our AI learns their interests and picks something new and thoughtful each time. Ok, that's the gifting sorted. What's next?
              </p>
              <p>
                <a href="/" className="text-purple-600 hover:text-purple-700">Check out SimplySent</a>
              </p>
            </div>
          </motion.div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/app-release-blog" className="group">
                <div className="bg-purple-50 rounded-xl p-4 transition-all group-hover:bg-purple-100">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    SimplySent Mobile App Coming Soon!
                  </h4>
                  <div className="flex items-center mt-2 text-purple-600">
                    <span className="text-sm">Read article</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link to="/blog3" className="group">
                <div className="bg-purple-50 rounded-xl p-4 transition-all group-hover:bg-purple-100">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    25 Thoughtful Gifts Under £20
                  </h4>
                  <div className="flex items-center mt-2 text-purple-600">
                    <span className="text-sm">Read article</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}