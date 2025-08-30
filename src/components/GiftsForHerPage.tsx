import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';
// Mock data for women's gifts
const womensGifts = [{
  id: 1,
  name: 'Luxury Silk Pajama Set',
  image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
  price: 89.99,
  description: 'Indulgent 100% mulberry silk pajama set that feels luxurious against the skin and helps maintain healthy hair and skin while sleeping.',
  features: ['100% Grade 6A mulberry silk (22 momme)', 'Temperature regulating for all seasons', 'Includes long-sleeve top and full-length pants', 'Available in 6 elegant colors', 'Gentle on skin and hair'],
  rating: 4.8
}, {
  id: 2,
  name: 'Artisanal Jewelry Box',
  image_url: 'https://images.unsplash.com/photo-1620783770629-122b7f187703?w=800&auto=format&fit=crop&q=80',
  price: 59.99,
  description: 'Beautifully crafted wooden jewelry box with multiple compartments, drawers, and a built-in mirror to organize and display her favorite pieces.',
  features: ['Handcrafted from sustainable hardwood', 'Velvet-lined compartments and ring rolls', 'Built-in mirror and lock with key', 'Multiple drawers and necklace hooks', 'Personalization available'],
  rating: 4.7
}, {
  id: 3,
  name: 'Luxury Scented Candle Set',
  image_url: 'https://images.unsplash.com/photo-1608181831718-de794d5eac08?w=800&auto=format&fit=crop&q=80',
  price: 49.99,
  description: 'Set of three premium hand-poured soy candles with sophisticated scent profiles that transform any space into a luxurious retreat.',
  features: ['100% natural soy wax for clean burning', 'Three complementary signature scents', '50+ hour burn time per candle', 'Reusable decorative glass containers', 'Eco-friendly and cruelty-free'],
  rating: 4.9
}, {
  id: 4,
  name: 'Personalized Birth Flower Necklace',
  image_url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop&q=80',
  price: 69.99,
  description: 'Delicate handcrafted necklace featuring her birth month flower preserved in crystal clear resin, set in sterling silver.',
  features: ['Real pressed flowers in resin pendant', 'Sterling silver chain and setting', 'Customizable chain length (16-20 inches)', 'Includes elegant gift box and care instructions', 'Handmade by skilled artisans'],
  rating: 4.8
}, {
  id: 5,
  name: 'Luxury Skincare Gift Set',
  image_url: 'https://images.unsplash.com/photo-1619451334207-99c9819ef909?w=800&auto=format&fit=crop&q=80',
  price: 129.99,
  description: 'Complete premium skincare collection featuring cleanser, toner, serum, moisturizer, and eye cream made with natural, organic ingredients.',
  features: ['Clinically tested, dermatologist approved', 'Free from parabens, sulfates, and artificial fragrances', 'Suitable for all skin types', 'Cruelty-free and vegan formulations', 'Includes elegant reusable gift box'],
  rating: 4.7
}, {
  id: 6,
  name: 'Cashmere Wrap Scarf',
  image_url: 'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=800&auto=format&fit=crop&q=80',
  price: 79.99,
  description: 'Incredibly soft and luxurious 100% cashmere wrap scarf that provides elegant warmth and versatile styling options for any outfit.',
  features: ['100% Grade A Mongolian cashmere', 'Generous size (78" x 28")', 'Lightweight yet exceptionally warm', 'Available in 12 classic and seasonal colors', 'Ethically sourced and sustainably produced'],
  rating: 4.9
}, {
  id: 7,
  name: 'Wireless Bluetooth Earbuds',
  image_url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
  price: 99.99,
  description: 'Premium wireless earbuds with exceptional sound quality, active noise cancellation, and comfortable fit for workouts or everyday use.',
  features: ['Active noise cancellation technology', '8-hour battery life (24 hours with charging case)', 'Water and sweat resistant (IPX7 rated)', 'Touch controls and voice assistant compatible', 'Includes wireless charging case'],
  rating: 4.6
}, {
  id: 8,
  name: 'Artisan Chocolate Gift Box',
  image_url: 'https://images.unsplash.com/photo-1600703136783-bdb5ea365239?w=800&auto=format&fit=crop&q=80',
  price: 39.99,
  description: 'Luxury assortment of handcrafted chocolates made by master chocolatiers using premium ingredients and unique flavor combinations.',
  features: ['24 assorted handcrafted chocolates', 'Single-origin cocoa from sustainable sources', 'Includes flavor guide and tasting notes', 'No artificial preservatives or additives', 'Elegant gift packaging'],
  rating: 4.8
}, {
  id: 9,
  name: 'Personalized Star Map',
  image_url: 'https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=800&auto=format&fit=crop&q=80',
  price: 49.99,
  description: 'Customized star map showing the exact arrangement of stars in the night sky from a specific date and location - perfect for commemorating special moments.',
  features: ['Astronomically accurate star positioning', 'Customizable date, time, location, and message', 'Museum-quality printing on premium paper', 'Multiple sizes and frame options available', 'Includes certificate of authenticity'],
  rating: 4.7
}, {
  id: 10,
  name: 'Luxury Bath and Spa Gift Basket',
  image_url: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=800&auto=format&fit=crop&q=80',
  price: 69.99,
  description: 'Comprehensive collection of premium bath and spa products to create a relaxing at-home spa experience, beautifully presented in a keepsake basket.',
  features: ['Includes bath bombs, body scrub, lotion, and more', 'All-natural ingredients with essential oils', 'Cruelty-free and environmentally friendly', 'Handwoven reusable basket', 'Perfect for creating a spa day at home'],
  rating: 4.8
}];
// Star rating component
const StarRating = ({
  rating
}: {
  rating: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);
  return <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {Array.from({
        length: fullStars
      }).map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
        {/* Half star */}
        {hasHalfStar && <div className="relative">
            <StarIcon className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{
          width: '50%'
        }}>
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>}
        {/* Empty stars */}
        {Array.from({
        length: emptyStars
      }).map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
      </div>
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>;
};
export function GiftsForHerPage() {
  const navigate = useNavigate();
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.4
  }} className="space-y-8">
      <div className="flex items-center mb-6">
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 relative inline-block">
          <span className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 transform -rotate-1 rounded-xl"></span>
          <span className="relative bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent px-6 py-2">
            Gifts for Her
          </span>
          <div className="absolute -top-4 -right-6 text-pink-400 opacity-60 transform rotate-12 text-2xl">
            ♀
          </div>
        </h1>
        <p className="text-gray-600">
          Curated selection of perfect gifts for the special woman in your life
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {womensGifts.map(gift => <motion.div key={gift.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: gift.id * 0.1
      }} className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="relative">
              <img src={gift.image_url} alt={gift.name} className="w-full h-72 object-cover" onError={handleImageError} />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-2 rounded-full shadow-md">
                <span className="text-purple-600 font-bold text-lg">
                  £{gift.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                {gift.name}
              </h3>
              <div className="mb-4">
                <StarRating rating={gift.rating} />
              </div>
              <p className="text-gray-700 mb-4">{gift.description}</p>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {gift.features.map((feature, index) => <li key={index} className="text-gray-600 flex items-start">
                      <span className="text-pink-500 mr-2">•</span>
                      {feature}
                    </li>)}
                </ul>
              </div>
              <div className="flex justify-center w-full">
                <a href="#" className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  View on Amazon
                </a>
              </div>
            </div>
          </motion.div>)}
      </div>
    </motion.div>;
}