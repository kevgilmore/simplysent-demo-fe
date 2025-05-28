import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiftIcon, UserIcon, CalendarIcon, HeartIcon, DollarSignIcon, SparklesIcon, ShirtIcon } from 'lucide-react';
interface FormData {
  personName: string;
  personAge: string;
  interests: string[];
  favoritedrink: string;
  clothesSize: string;
  minBudget: number | null;
  maxBudget: number | null;
}
interface ApiResponse extends Array<{
  recommendation_id: string;
  name: string;
  description: string;
  average_star_rating: number;
  price: number;
  url: string;
  image_url: string;
}> {}
const interestOptions = ['Tech', 'Golf', 'Fishing', 'Hiking', 'Camping', 'Cycling', 'Running', 'Swimming', 'Weightlifting', 'Yoga', 'Martial Arts', 'Boxing', 'CrossFit', 'Rowing', 'Rock Climbing', 'Kayaking', 'Sailing', 'Surfing', 'Skiing', 'Snowboarding', 'Archery', 'Hunting', 'Gardening', 'Woodworking', 'Car Restoration', 'Home Improvement', 'Leatherworking', 'Metalworking', 'Model Building', 'Electronics', '3D Printing', 'Drone Flying', 'Coding', 'Video Gaming', 'Board Games', 'Chess', 'Photography', 'Painting', 'Drawing', 'Sculpting', 'Calligraphy', 'Music (Playing Instruments)', 'Writing', 'Reading', 'Film Watching', 'Theatre', 'Magic Tricks', 'Cooking', 'Baking', 'Grilling/BBQ', 'Home Brewing', 'Wine Tasting', 'Coffee Brewing', 'Cheesemaking', 'Stamp Collecting', 'Coin Collecting', 'Vintage Cars', 'Antique Collecting', 'Action Figures', 'Comic Books', 'Watches', 'Vinyl Records', 'Sports Memorabilia', 'Model Trains', 'Road Trips', 'Backpacking', 'Scuba Diving', 'Geocaching', 'Motorcycling', 'Off-Roading', 'Genealogy', 'Bird Watching', 'Astronomy', 'Language Learning', 'Meditation', 'Podcasting', 'Blogging', 'Home Automation', 'Virtual Reality', 'Retro Gaming', 'Pet Training', 'Storytelling', 'Volunteering', 'Landscaping', 'Interior Design', 'Tattooing', 'Soap Making', 'Stock Market Trading', 'Leather Craft', 'Knife Making', 'RC Planes', 'RC Boats', 'RC Cars', 'Metal Detecting', 'Treasure Hunting', 'Beekeeping', 'Aquarium Keeping', 'Origami', 'Kite Flying'];
export function GiftRecommenderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    personName: '',
    personAge: '',
    interests: [],
    favoritedrink: '',
    clothesSize: '',
    minBudget: 10,
    maxBudget: 20 // Set default value
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    // Name validation - letters only, max 25 characters
    if (!formData.personName.trim()) {
      newErrors.personName = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.personName)) {
      newErrors.personName = 'Name can only contain letters';
    } else if (formData.personName.length > 25) {
      newErrors.personName = 'Name must be 25 characters or less';
    }
    // Age validation - 18-99
    if (!formData.personAge || parseInt(formData.personAge) < 18 || parseInt(formData.personAge) > 99) {
      newErrors.personAge = 'Please enter a valid age';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = ['Please select at least one interest'];
    }
    // New drink validation
    if (!formData.favoritedrink) {
      newErrors.favoritedrink = 'Please select their favorite drink';
    }
    // New clothes size validation
    if (!formData.clothesSize) {
      newErrors.clothesSize = 'Please select their clothes size';
    }
    // Budget validation - only validate if values are provided
    if (formData.minBudget !== null && (formData.minBudget < 10 || formData.minBudget > 490)) {
      newErrors.minBudget = 'Min budget must be between £10-£490';
    }
    if (formData.maxBudget !== null && (formData.maxBudget < 15 || formData.maxBudget > 500)) {
      newErrors.maxBudget = 'Max budget must be between £15-£500';
    }
    if (formData.minBudget !== null && formData.maxBudget !== null && formData.minBudget > formData.maxBudget) {
      newErrors.minBudget = 'Min budget cannot be greater than max budget';
      newErrors.maxBudget = 'Max budget must be greater than or equal to min budget';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };
  const handleBudgetChange = (field: 'minBudget' | 'maxBudget', value: string) => {
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
      return;
    }
    if (value.length > 1 && value.startsWith('0')) {
      return;
    }
    const numValue = parseInt(value) || null;
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const requestData = {
        interests: formData.interests,
        favourite_drink: formData.favoritedrink.toLowerCase(),
        size: formData.clothesSize,
        age: parseInt(formData.personAge),
        budget_min: formData.minBudget,
        budget_max: formData.maxBudget
      };
      const response = await fetch('https://gift-api-973409790816.europe-west1.run.app/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      console.log('API Response:', data);
      navigate('/products', {
        state: {
          formData,
          recommendations: data // Pass the array directly
        }
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Sorry, there was an error getting recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      {/* First Card - Keep purple gradient */}
      <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-purple-500 opacity-10 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Let's Find the Perfect Gift
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Person's Name */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <UserIcon className="w-4 h-4 mr-2 text-purple-600" />
                Who's the lucky person?
              </label>
              <input type="text" value={formData.personName} maxLength={25} onChange={e => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setFormData(prev => ({
                ...prev,
                personName: value
              }));
            }} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter their name" />
              <div className="text-xs text-gray-500 mt-1">
                {formData.personName.length}/25 characters
              </div>
              {errors.personName && <p className="text-red-500 text-sm mt-1">{errors.personName}</p>}
            </div>
            {/* Person's Age */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <CalendarIcon className="w-4 h-4 mr-2 text-purple-600" />
                How old are they?
              </label>
              <input type="number" min="18" max="99" value={formData.personAge} onChange={e => setFormData(prev => ({
              ...prev,
              personAge: e.target.value
            }))} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter their age" />
              {errors.personAge && <p className="text-red-500 text-sm mt-1">{errors.personAge}</p>}
            </div>
          </div>
        </div>
      </div>
      {/* Second Card - Change to subtle pink theme */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-pink-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <HeartIcon className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              What do they love?
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {interestOptions.map(interest => <label key={interest} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${formData.interests.includes(interest) ? 'bg-pink-100 border-2 border-pink-300 shadow-md' : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200'}`}>
                  <input type="checkbox" checked={formData.interests.includes(interest)} onChange={() => handleInterestToggle(interest)} className="sr-only" />
                  <span className={`text-sm font-medium ${formData.interests.includes(interest) ? 'text-pink-700' : 'text-gray-600'}`}>
                    {interest}
                  </span>
                </label>)}
            </div>
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-3">
              Please select at least one interest
            </p>}
        </div>
      </div>
      {/* New Favorite Drink Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-blue-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What's their favorite drink?
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
            <select value={formData.favoritedrink} onChange={e => setFormData(prev => ({
            ...prev,
            favoritedrink: e.target.value
          }))} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors">
              <option value="">Select a drink...</option>
              <option value="Wine">Wine</option>
              <option value="Beer">Beer</option>
              <option value="Spirits">Spirits</option>
              <option value="Whiskey">Whiskey</option>
              <option value="Non-drinker">Non-drinker</option>
            </select>
            {errors.favoritedrink && <p className="text-red-500 text-sm mt-1">
                {errors.favoritedrink}
              </p>}
          </div>
        </div>
      </div>
      {/* New Clothes Size Card */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-orange-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <ShirtIcon className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What's their clothes size?
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
            <select value={formData.clothesSize} onChange={e => setFormData(prev => ({
            ...prev,
            clothesSize: e.target.value
          }))} className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors">
              <option value="">Select a size...</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            {errors.clothesSize && <p className="text-red-500 text-sm mt-1">{errors.clothesSize}</p>}
          </div>
        </div>
      </div>
      {/* Third Card - Change to subtle green theme */}
      <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-green-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSignIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What's your budget range?
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/40">
            <div className="grid grid-cols-2 gap-6">
              {/* Min Budget Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    £
                  </span>
                  <input type="number" min="10" max="490" value={formData.minBudget === 0 ? '' : formData.minBudget} onChange={e => handleBudgetChange('minBudget', e.target.value)} className="w-full pl-8 pr-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors" placeholder="10" />
                </div>
                {errors.minBudget && <p className="text-red-500 text-sm mt-1">
                    {errors.minBudget}
                  </p>}
              </div>
              {/* Max Budget Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    £
                  </span>
                  <input type="number" min="15" max="500" value={formData.maxBudget === 0 ? '' : formData.maxBudget} onChange={e => handleBudgetChange('maxBudget', e.target.value)} className="w-full pl-8 pr-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-colors" placeholder="15" />
                </div>
                {errors.maxBudget && <p className="text-red-500 text-sm mt-1">
                    {errors.maxBudget}
                  </p>}
              </div>
            </div>
            {/* Budget Display */}
            <div className="text-center mt-4 p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">
                Budget Range: £{formData.minBudget ?? '-'} - £
                {formData.maxBudget ?? '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Consolidated Error List */}
      {Object.keys(errors).length > 0 && <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Please fix the following errors:
          </h3>
          <ul className="space-y-2">
            {errors.personName && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.personName}
              </li>}
            {errors.personAge && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.personAge}
              </li>}
            {errors.interests && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                Please select at least one interest
              </li>}
            {errors.favoritedrink && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                Please select their favorite drink
              </li>}
            {errors.clothesSize && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                Please select their clothes size
              </li>}
            {errors.minBudget && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.minBudget}
              </li>}
            {errors.maxBudget && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.maxBudget}
              </li>}
          </ul>
        </motion.div>}
      {/* Submit Button */}
      <button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center">
        {isLoading ? <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Finding Perfect Gifts...
          </> : <>
            <GiftIcon className="w-6 h-6 mr-3" />
            Find Perfect Gifts
          </>}
      </button>
    </motion.div>;
}