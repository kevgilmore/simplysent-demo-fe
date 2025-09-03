import React, { useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ChevronRightIcon } from 'lucide-react';
export function BlogPost1() {
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
                App Announcement
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                🎉 SimplySent Mobile App Coming Soon: Your AI Gift Concierge in Your Pocket!
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <span>Published: September 1, 2025</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
            </div>
            <div className="flex justify-center mb-8">
              <img src="/app_screenshot1.png" alt="SimplySent Mobile App Interface" className="max-w-md w-full rounded-2xl shadow-lg border border-gray-200" />
            </div>
            <div className="prose prose-lg max-w-none space-y-6 leading-relaxed">
              <p>
                Get ready to revolutionize the way you give gifts! We're thrilled to announce that the SimplySent mobile app is coming soon, bringing our AI-powered gift concierge service directly to your smartphone. Say goodbye to last-minute gift panic and hello to effortless, thoughtful giving! 🎁
              </p>
              
              <h2>🤖 Meet Your Personal AI Gift Concierge</h2>
              <p>
                Imagine having a personal assistant who never forgets a birthday, always knows the perfect gift, and handles everything from selection to delivery. That's exactly what SimplySent delivers! Our AI concierge service is designed to handle all your gift-giving needs with the intelligence of artificial intelligence and the warmth of human thoughtfulness.
              </p>
              
              <h2>📱 How SimplySent Works (It's Ridiculously Simple!)</h2>
              <p>
                We've made gift-giving as easy as sending a text message. Here's how our magic works:
              </p>
              
              <div className="my-8 flex justify-center">
                <img src="/app_screenshot2.png" alt="SimplySent App Features" className="max-w-md w-full rounded-2xl shadow-lg border border-gray-200" />
              </div>
              
              <p>
                <strong>Step 1:</strong> Add your friends and family to the app - just their name, age, and a few interests (like "loves coffee and hiking" or "obsessed with skincare").
              </p>
              <p>
                <strong>Step 2:</strong> Set your budget and mark important dates like birthdays, anniversaries, or holidays.
              </p>
              <p>
                <strong>Step 3:</strong> Let our AI work its magic! It analyzes their interests, age, and current trends to recommend the perfect gift.
              </p>
              <p>
                <strong>Step 4:</strong> Approve the selection (or let the AI choose automatically), and we handle payment and delivery. Done! 🎉
              </p>
              
              <h2>🔄 The "Set It and Forget It" Subscription</h2>
              <p>
                Here's where SimplySent gets really exciting - our optional subscription model! Set it up once in just 2 minutes, and you'll never have to worry about that person's gifts again. Our AI learns and evolves, picking new and exciting gifts each year within your specified budget.
              </p>
              <p>
                Imagine never forgetting your mom's birthday, your partner's anniversary, or your best friend's graduation. The app remembers everything and ensures every gift feels personal and thoughtful, not automated.
              </p>
              
              <h2>🎯 Why SimplySent is a Game-Changer</h2>
              <p>
                <strong>Save Time:</strong> No more hours spent browsing endless online stores or wandering aimlessly through shopping centers.
              </p>
              <p>
                <strong>Never Forget:</strong> Our app keeps track of all important dates and sends you gentle reminders (or handles it automatically if you prefer).
              </p>
              <p>
                <strong>Personalized Intelligence:</strong> Our AI gets smarter with every interaction, learning what makes each person in your life smile.
              </p>
              <p>
                <strong>Stress-Free Giving:</strong> Transform gift-giving from a source of anxiety into a source of joy.
              </p>
              
              <h2>📸 Sneak Peek at the App</h2>
              <p>
                The screenshots show just how intuitive and beautiful the SimplySent experience will be. With a clean, modern interface, you can easily manage all your gift recipients, view AI recommendations, and track deliveries - all from one elegant app.
              </p>
              
              <p>
                Our intuitive interface makes managing your gift-giving effortless. The clean, modern design ensures you can quickly navigate through all features while maintaining the personal touch that makes each gift special.
              </p>
              
              <h2>🚀 Coming Soon to Your Pocket</h2>
              <p>
                We're putting the finishing touches on the SimplySent mobile app and can't wait to share it with you. Whether you're someone who loves giving gifts but struggles with timing, or you're the type who wants to be thoughtful but finds shopping overwhelming, SimplySent is designed for you.
              </p>
              <p>
                The future of gift-giving is intelligent, personal, and effortless. And it's coming to your smartphone very soon!
              </p>
              
              <h2>🎁 Ready to Transform Your Gift-Giving?</h2>
              <p>
                Stay tuned for the official launch announcement! In the meantime, you can experience our AI gift recommendations on our website. We're confident that once you try SimplySent, you'll wonder how you ever managed gift-giving without it.
              </p>
              <p>
                <em>Because the best gifts come from the heart... but a little AI assistance doesn't hurt! 💜</em>
              </p>
            </div>
          </motion.div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/fathers-day-guide" className="group">
                <div className="bg-purple-50 rounded-xl p-4 transition-all group-hover:bg-purple-100">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    How to Totally Boss Father's Day
                  </h4>
                  <div className="flex items-center mt-2 text-purple-600">
                    <span className="text-sm">Read article</span>
                    <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              <Link to="/budget-gifts-guide" className="group">
                <div className="bg-purple-50 rounded-xl p-4 transition-all group-hover:bg-purple-100">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                    25 Thoughtful Gifts Under £20 That Don't Look Cheap
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