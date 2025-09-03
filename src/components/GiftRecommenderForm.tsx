import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiftIcon, UserIcon, CalendarIcon, HeartIcon, BeerIcon, DollarSignIcon, SparklesIcon, ShirtIcon, ArrowLeftIcon, UsersIcon, PartyPopperIcon, SmileIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
interface FormData {
  personAge: string;
  interests: string[];
  favoritedrink: string;
  clothesSize: string;
  minBudget: number | null;
  maxBudget: number | null;
  relationship: string;
  occasion: string;
  sentiment: string;
  gender: string;
}
interface ApiResponse {
  recommendation_id: string;
  llmEnabled: boolean;
  products: Array<{
    sku: string;
    rank: string;
  }>;
}
interface FormErrors {
  personAge?: string;
  interests?: string[];
  favoritedrink?: string;
  clothesSize?: string;
  minBudget?: string;
  maxBudget?: string;
  relationship?: string;
  occasion?: string;
  sentiment?: string;
  gender?: string;
}
// Complete interests list
const allInterests = [
  'Action Figures', 'Antique Collecting', 'Aquarium Keeping', 'Archery', 'Astrophotography', 'Astronomy',
  'Backpacking', 'Baking', 'Barre Fitness', 'Beekeeping', 'Being Cosy (Homebody)', 'Bird Watching',
  'Blogging', 'Board Games', 'Book Clubs', 'Boxing', 'Brunching & Foodie Experiences',
  'Calligraphy', 'Calligraphy Journaling', 'Camping', 'Candle Making', 'Car Restoration', 'Cheesemaking',
  'Chess', 'Coding', 'Coffee Brewing', 'Comic Books', 'Cooking', 'Creative Writing', 'Crocheting',
  'CrossFit', 'Dance', 'DIY Crafts', 'Drawing', 'Drone Flying', 'Electronics', 'Embroidery',
  'Fashion & Styling', 'Film Watching', 'Fishing', 'Flower Arranging', 'Gardening', 'Geocaching',
  'Genealogy', 'Golf', 'Grilling/BBQ', 'Hiking', 'Home Automation', 'Home Brewing', 'Home Decorating',
  'Home Improvement', 'Hunting', 'Interior Design', 'Jewellery Making', 'Journaling', 'Kayaking',
  'Kite Flying', 'Knife Making', 'Knitting', 'Language Learning', 'Landscaping', 'Leather Craft',
  'Leatherworking', 'Magic Tricks', 'Makeup & Beauty', 'Martial Arts', 'Meditation', 'Metal Detecting',
  'Metalworking', 'Model Building', 'Model Trains', 'Motorcycling', 'Music (Playing Instruments)',
  'Off-Roading', 'Origami', 'Painting', 'Pet Training', 'Photography', 'Pilates', 'Podcasting',
  'Pottery & Ceramics', 'Quilting', 'RC Boats', 'RC Cars', 'RC Planes', 'Reading', 'Road Trips',
  'Rock Climbing', 'Rowing', 'Sailing', 'Scuba Diving', 'Scrapbooking', 'Self-Care/Wellness Routines',
  'Sewing', 'Skiing', 'Skincare Routines', 'Soap Making', 'Social Media Content Creation', 'Sculpting',
  'Sports Memorabilia', 'Stamp Collecting', 'Stock Market Trading', 'Storytelling', 'Surfing',
  'Swimming', 'Tattooing', 'Tea Appreciation', 'Tech', 'Theatre', 'Treasure Hunting', 'Travel Planning',
  'Video Gaming', 'Vintage Cars', 'Vinyl Records', 'Virtual Reality', 'Volunteering', 'Weightlifting',
  'Wine Tasting', 'Watches', 'Woodworking', 'Writing', 'Yoga'
];

// Gender-specific top interests for sorting
const topMaleInterests = [
  'Tech', 'Sports Memorabilia', 'Video Gaming', 'Weightlifting', 'Fishing', 
  'Hiking', 'Car Restoration', 'Home Improvement', 'Golf', 'Grilling/BBQ'
];

const topFemaleInterests = [
  'Reading', 'Yoga', 'Cooking', 'Gardening', 'Fashion & Styling', 
  'Knitting', 'Photography', 'Dance', 'Creative Writing', 'Being Cosy (Homebody)'
];

// Function to get sorted interests based on gender
const getSortedInterests = (gender: string): string[] => {
  if (gender === 'male') {
    // Put top male interests first, then the rest alphabetically
    const remainingInterests = allInterests
      .filter(interest => !topMaleInterests.includes(interest))
      .sort();
    return [...topMaleInterests, ...remainingInterests];
  } else if (gender === 'female') {
    // Put top female interests first, then the rest alphabetically
    const remainingInterests = allInterests
      .filter(interest => !topFemaleInterests.includes(interest))
      .sort();
    return [...topFemaleInterests, ...remainingInterests];
  } else {
    // No gender selected - show all interests alphabetically
    return [...allInterests].sort();
  }
};
export function GiftRecommenderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    personAge: '',
    interests: [],
    favoritedrink: '',
    clothesSize: '',
    minBudget: 10,
    maxBudget: 110,
    relationship: '',
    occasion: '',
    sentiment: '',
    gender: 'male'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingStage, setLoadingStage] = useState(0);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [budgetRange, setBudgetRange] = useState([10, 110]);
  // Add the missing loadingMessages array
  const loadingMessages = [{
    icon: '🎁',
    message: 'Analyzing your preferences...'
  }, {
    icon: '🤖',
    message: 'Finding perfect matches...'
  }, {
    icon: '✨',
    message: 'Curating recommendations...'
  }, {
    icon: '🎉',
    message: 'Almost ready!'
  }];
  // Handle interest toggle function
  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  // Smart gender logic based on relationship
  const getGenderFromRelationship = (relationship: string): string | null => {
    switch (relationship) {
      case 'Father':
      case 'Brother':
        return 'male';
      case 'Mother':
      case 'Sister':
        return 'female';
      case 'Partner':
      case 'Friend':
      case 'Other':
      default:
        return null; // Gender selection needed
    }
  };

  // Check if gender field should be shown
  const shouldShowGender = (relationship: string): boolean => {
    return ['Partner', 'Friend', 'Other'].includes(relationship);
  };

  // Get available occasions based on relationship and selected gender
  const getAvailableOccasions = (relationship: string, selectedGender?: string): string[] => {
    const autoGender = getGenderFromRelationship(relationship);
    const effectiveGender = autoGender || selectedGender;
    const baseOccasions = ['Birthday', 'Anniversary', 'Other'];

    let occasions = [...baseOccasions];
    if (effectiveGender === 'male') {
      occasions.push("Father's Day");
    } else if (effectiveGender === 'female') {
      occasions.push("Mother's Day");
    } else {
      // No gender selected – show general parental occasions
      occasions.push("Mother's Day", "Father's Day");
    }

    // For Partner, Friend, Other, do not show Father's Day regardless of gender
    if (['Partner', 'Friend', 'Other'].includes(relationship)) {
      occasions = occasions.filter(o => o !== "Father's Day");
    }
    return occasions;
  };

  // Handle relationship change with automatic gender setting
  const handleRelationshipChange = (relationship: string) => {
    const autoGender = getGenderFromRelationship(relationship);
    const newGender = autoGender || formData.gender;
    const availableOccasions = getAvailableOccasions(relationship, newGender);
    
    setFormData(prev => ({
      ...prev,
      relationship,
      gender: newGender,
      // Reset occasion if current one is not available for this relationship
      occasion: availableOccasions.includes(prev.occasion) ? prev.occasion : ''
    }));
  };

  // Handle gender change and filter occasions accordingly
  const handleGenderChange = (gender: string) => {
    const availableOccasions = getAvailableOccasions(formData.relationship, gender);
    
    setFormData(prev => ({
      ...prev,
      gender,
      // Reset occasion if current one is not available for this gender
      occasion: availableOccasions.includes(prev.occasion) ? prev.occasion : ''
    }));
  };
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Fill form and submit (testing) - now uses real API without artificial delay
  const fillFormAndSubmit = async () => {
    const newFormData = {
      personAge: '65',
      gender: 'male', // Will be auto-set by relationship
      relationship: 'Father',
      occasion: 'Birthday',
      sentiment: 'Funny',
      interests: ['Reading', 'Cooking'],
      favoritedrink: 'Beer',
      clothesSize: 'M',
      minBudget: 10,
      maxBudget: 110
    };
    setBudgetRange([10, 110]);
    setFormData(newFormData);
    setIsLoading(true);
    try {
      if (window.fbq) {
        window.fbq('track', 'FormCompletion', {
          form_name: 'fday-demo'
        });
      }
      const requestData = {
        age: parseInt(newFormData.personAge),
        gender: newFormData.gender,
        relationship: newFormData.relationship.toLowerCase(),
        occasion: newFormData.occasion.toLowerCase(),
        sentiment: newFormData.sentiment.toLowerCase(),
        interests: newFormData.interests,
        favourite_drink: newFormData.favoritedrink.toLowerCase(),
        size: newFormData.clothesSize,
        budget_min: newFormData.minBudget,
        budget_max: newFormData.maxBudget
      };
      const reqId = uuidv4();
      const urlParams = new URLSearchParams(window.location.search);
      const origin = urlParams.get('origin');
      const apiUrl = new URL('https://catboost-recommender-api-973409790816.europe-west1.run.app/recommend');
      apiUrl.searchParams.append('use_llm', 'true');
      apiUrl.searchParams.append('reqId', reqId);
      if (origin) {
        apiUrl.searchParams.append('origin', origin);
      }
      const response = await fetch(apiUrl.toString(), {
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
      if (data.products && data.products.length > 0) {
        navigate('/products', {
          state: {
            formData: newFormData,
            recommendations: data.products,
            recommendationId: data.recommendation_id
          }
        });
      } else {
        throw new Error('No product recommendations received');
      }
    } catch (error) {
      console.error('Error getting recommendations (test):', error);
      navigate('/products', {
        state: {
          error: true,
          formData: newFormData,
          reqId: uuidv4()
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Modify validateForm to respect test override
  const validateForm = () => {
    // Skip validation if this is a test submission
    if ((window as any).tempValidateFormOverride) {
      return true;
    }
    const newErrors: FormErrors = {};
    // Age validation - 18-99
    if (!formData.personAge || parseInt(formData.personAge) < 18 || parseInt(formData.personAge) > 99) {
      newErrors.personAge = 'Please enter a valid age';
    }
    if (formData.interests.length === 0) {
      newErrors.interests = ['Please select at least one interest'];
    }
    // Drink validation
    if (!formData.favoritedrink) {
      newErrors.favoritedrink = 'Please select their favorite drink';
    }
    // Clothes size validation
    if (!formData.clothesSize) {
      newErrors.clothesSize = 'Please select their clothes size';
    }
    // Relationship validation
    if (!formData.relationship) {
      newErrors.relationship = 'Please select your relationship';
    }
    // Occasion validation
    if (!formData.occasion) {
      newErrors.occasion = 'Please select the occasion';
    }
    // Sentiment validation
    if (!formData.sentiment) {
      newErrors.sentiment = 'Please select the gift sentiment';
    }
    // Gender validation - only required if gender field is shown (relationship doesn't auto-determine gender)
    if (shouldShowGender(formData.relationship) && !formData.gender) {
      newErrors.gender = 'Please select gender';
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
  // Handle slider mouse events
  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };
  // Handle slider touch events
  const handleTouchStart = (handle: 'min' | 'max') => (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX, e.currentTarget.getBoundingClientRect());
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    updateSliderPosition(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
  };
  const updateSliderPosition = (clientX: number, rect: DOMRect) => {
    const newPosition = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100));
    const newValue = Math.round(newPosition / 100 * 490) + 10; // Scale to 10-500 range
    // Ensure minimum value is 10 and max is 500
    const adjustedValue = Math.max(10, Math.min(500, newValue));
    if (isDragging === 'min') {
      if (adjustedValue < budgetRange[1]) {
        setBudgetRange([adjustedValue, budgetRange[1]]);
      }
    } else {
      if (adjustedValue > budgetRange[0]) {
        setBudgetRange([budgetRange[0], adjustedValue]);
      }
    }
  };
  const handleMouseUp = () => {
    setIsDragging(null);
  };
  const handleTouchEnd = () => {
    setIsDragging(null);
  };
  // Add event listeners for mouse up and touch end outside the slider
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(null);
      const handleGlobalTouchEnd = () => setIsDragging(null);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalTouchEnd);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const requestData = {
        age: parseInt(formData.personAge),
        gender: formData.gender,
        relationship: formData.relationship.toLowerCase(),
        occasion: formData.occasion.toLowerCase(),
        sentiment: formData.sentiment.toLowerCase(),
        interests: formData.interests,
        favourite_drink: formData.favoritedrink.toLowerCase(),
        size: formData.clothesSize,
        budget_min: formData.minBudget,
        budget_max: formData.maxBudget
      };
      // Track form submission with Meta Pixel
      if (window.fbq) {
        window.fbq('track', 'FormCompletion', {
          form_name: 'fday-demo'
        });
      }
      const reqId = uuidv4();
      const urlParams = new URLSearchParams(window.location.search);
      const origin = urlParams.get('origin');
      const apiUrl = new URL('https://catboost-recommender-api-973409790816.europe-west1.run.app/recommend');
      apiUrl.searchParams.append('use_llm', 'true');
      apiUrl.searchParams.append('reqId', reqId);
      if (origin) {
        apiUrl.searchParams.append('origin', origin);
      }
      const response = await fetch(apiUrl.toString(), {
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
      // Ensure the products array exists and has items before navigating
      if (data.products && data.products.length > 0) {
        navigate('/products', {
          state: {
            formData,
            recommendations: data.products,
            recommendationId: data.recommendation_id
          }
        });
      } else {
        throw new Error('No product recommendations received');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      navigate('/products', {
        state: {
          error: true,
          formData,
          reqId: uuidv4()
        }
      });
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
  }} className="space-y-8 pb-5">
      {/* Add Back Button and Test Button - fixed to show on /results path */}
      {(location.pathname === '/fathers-day' || location.pathname === '/results') && <div className="flex items-center mb-6 justify-between">
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
          {/* Add Fill Form button for testing */}
          <motion.button initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }} onClick={fillFormAndSubmit} className="text-purple-600 hover:text-purple-700 font-medium flex items-center bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Fill Form (Testing)
          </motion.button>
        </div>}

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
          <div className="grid md:grid-cols-3 gap-6">
            {/* Relationship (replacing Person's Name) */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <UsersIcon className="w-4 h-4 mr-2 text-purple-600" />
                What's your relationship to them?
              </label>
              <div className="relative">
                <select value={formData.relationship} onChange={e => handleRelationshipChange(e.target.value)} className="w-full appearance-none px-4 py-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-10">
                  <option value="">Select relationship...</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Partner">Partner</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.relationship && <p className="text-red-500 text-sm mt-1">
                  {errors.relationship}
                </p>}
            </div>
            {/* Person's Age */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <CalendarIcon className="w-4 h-4 mr-2 text-purple-600" />
                How old are they?
              </label>
              <input type="number" min="18" max="99" value={formData.personAge} onChange={e => setFormData(prev => ({
              ...prev,
              personAge: e.target.value
            }))} className="w-full px-4 py-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter their age" />
              {errors.personAge && <p className="text-red-500 text-sm mt-1">{errors.personAge}</p>}
            </div>
            {/* Occasion field moved to first card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <PartyPopperIcon className="w-4 h-4 mr-2 text-purple-600" />
                What's the occasion?
              </label>
              <div className="relative">
                <select value={formData.occasion} onChange={e => setFormData(prev => ({
                ...prev,
                occasion: e.target.value
              }))} className="w-full appearance-none px-4 py-3 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-10">
                  <option value="">Select occasion...</option>
                  {getAvailableOccasions(formData.relationship, formData.gender).map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.occasion && <p className="text-red-500 text-sm mt-1">{errors.occasion}</p>}
            </div>
            {/* Gender selection - conditional based on relationship */}
            {shouldShowGender(formData.relationship) && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/40 md:col-span-3">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <UserIcon className="w-4 h-4 mr-2 text-purple-600" />
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${formData.gender === 'male' ? 'bg-purple-100 border-2 border-purple-300 shadow-sm' : 'bg-white border border-gray-200 hover:bg-purple-50'}`}>
                    <input type="radio" value="male" checked={formData.gender === 'male'} onChange={() => handleGenderChange('male')} className="sr-only" />
                    <span className={`text-sm font-medium ${formData.gender === 'male' ? 'text-purple-700' : 'text-gray-600'}`}>
                      Male
                    </span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${formData.gender === 'female' ? 'bg-purple-100 border-2 border-purple-300 shadow-sm' : 'bg-white border border-gray-200 hover:bg-purple-50'}`}>
                    <input type="radio" value="female" checked={formData.gender === 'female'} onChange={() => handleGenderChange('female')} className="sr-only" />
                    <span className={`text-sm font-medium ${formData.gender === 'female' ? 'text-purple-700' : 'text-gray-600'}`}>
                      Female
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sentiment Card */}
      <div className="bg-gradient-to-r from-rose-50 to-red-50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-8 md:translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-rose-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <SmileIcon className="w-6 h-6 text-rose-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What sentiment would you like the gift to convey?
            </h2>
          </div>
          <div className="relative">
            <select value={formData.sentiment} onChange={e => setFormData(prev => ({
            ...prev,
            sentiment: e.target.value
          }))} className="w-full appearance-none px-4 py-3 bg-gradient-to-r from-rose-50/80 to-red-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors pr-10">
              <option value="">Select sentiment...</option>
              <option value="Funny">Funny</option>
              <option value="Sentimental">Sentimental</option>
              <option value="Romantic">Romantic</option>
              <option value="Practical">Practical</option>
              <option value="Luxurious">Luxurious</option>
              <option value="Thoughtful">Thoughtful</option>
              <option value="Unique">Unique</option>
              <option value="Adventurous">Adventurous</option>
              <option value="Relaxing">Relaxing</option>
              <option value="Nostalgic">Nostalgic</option>
              <option value="Educational">Educational</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {errors.sentiment && <p className="text-red-500 text-sm mt-1">{errors.sentiment}</p>}
          </div>
        </div>
      </div>

      {/* Second Card - Change to subtle pink theme */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-xl p-8 shadow-sm border border-white/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-8 md:translate-x-16 -translate-y-16">
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
              {getSortedInterests(formData.gender).map(interest => <label key={interest} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${formData.interests.includes(interest) ? 'bg-pink-100 border-2 border-pink-300 shadow-md' : 'bg-gray-50 border-2 border-gray-100 hover:border-gray-200'}`}>
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

      {/* Favorite Drink Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 shadow-sm border border-white/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-8 md:translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-blue-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <BeerIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What's their favorite drink?
            </h2>
          </div>
          <div className="relative">
            <select value={formData.favoritedrink} onChange={e => setFormData(prev => ({
            ...prev,
            favoritedrink: e.target.value
          }))} className="w-full appearance-none px-4 py-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors pr-10">
              <option value="">Select a drink...</option>
              <option value="Wine">Wine</option>
              <option value="Beer">Beer</option>
              <option value="Spirits">Spirits</option>
              <option value="Whiskey">Whiskey</option>
              <option value="Non-drinker">Non-drinker</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {errors.favoritedrink && <p className="text-red-500 text-sm mt-1">
                {errors.favoritedrink}
              </p>}
          </div>
        </div>
      </div>

      {/* Clothes Size Card */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-xl p-8 shadow-sm border border-white/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-8 md:translate-x-16 -translate-y-16">
          <div className="absolute inset-0 bg-orange-100 opacity-30 rounded-full"></div>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <ShirtIcon className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              What's their clothes size?
            </h2>
          </div>
          <div className="relative">
            <select value={formData.clothesSize} onChange={e => setFormData(prev => ({
            ...prev,
            clothesSize: e.target.value
          }))} className="w-full appearance-none px-4 py-3 bg-gradient-to-r from-orange-50/80 to-amber-50/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors pr-10">
              <option value="">Select a size...</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            {errors.clothesSize && <p className="text-red-500 text-sm mt-1">{errors.clothesSize}</p>}
          </div>
        </div>
      </div>

      {/* Budget Card with Slider */}
      <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-2xl shadow-xl p-8 shadow-sm border border-white/40">
        <div className="relative">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSignIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Budget Range
            </h2>
          </div>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-green-600">
                £{budgetRange[0]}
              </p>
              <p className="text-sm font-medium text-green-600">
                £{budgetRange[1]}
              </p>
            </div>
            <div className="relative h-12 flex items-center cursor-pointer touch-none" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {/* Track background */}
              <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
              {/* Colored track between handles */}
              <div className="absolute h-2 bg-gradient-to-r from-green-300 to-lime-300 rounded-full" style={{
              left: `${(budgetRange[0] - 10) / 490 * 100}%`,
              width: `${(budgetRange[1] - budgetRange[0]) / 490 * 100}%`
            }}></div>
              {/* Min handle */}
              <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'min' ? 'border-green-500 scale-110' : 'border-green-400'} rounded-full shadow-md cursor-grab ${isDragging === 'min' ? 'cursor-grabbing' : ''} transition-transform`} style={{
              left: `calc(${(budgetRange[0] - 10) / 490 * 100}% - 14px)`
            }} onMouseDown={handleMouseDown('min')} onTouchStart={handleTouchStart('min')}></div>
              {/* Max handle */}
              <div className={`absolute w-7 h-7 bg-white border-2 ${isDragging === 'max' ? 'border-lime-500 scale-110' : 'border-lime-400'} rounded-full shadow-md cursor-grab ${isDragging === 'max' ? 'cursor-grabbing' : ''} transition-transform`} style={{
              left: `calc(${(budgetRange[1] - 10) / 490 * 100}% - 14px)`
            }} onMouseDown={handleMouseDown('max')} onTouchStart={handleTouchStart('max')}></div>
            </div>
          </div>
          {/* Budget Display */}
          <div className="text-center p-4 bg-gradient-to-r from-green-100/60 to-lime-100/60 rounded-lg">
            <div className="text-lg font-semibold text-green-700">
              Budget Range: £{budgetRange[0]} - £{budgetRange[1]}
            </div>
          </div>
          {errors.minBudget && <p className="text-red-500 text-sm mt-1">{errors.minBudget}</p>}
          {errors.maxBudget && <p className="text-red-500 text-sm mt-1">{errors.maxBudget}</p>}
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
            {errors.relationship && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.relationship}
              </li>}
            {errors.occasion && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.occasion}
              </li>}
            {errors.sentiment && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.sentiment}
              </li>}
            {errors.gender && <li className="flex items-start text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {errors.gender}
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

      {/* Submit Button - Added significant bottom margin for spacing */}
      <motion.button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-400 disabled:to-indigo-400 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] mb-20">
        {isLoading ? <motion.div className="flex items-center justify-center space-x-3" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <motion.span key={loadingStage} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} transition={{
          duration: 0.5
        }} className="text-lg">
              {loadingMessages[loadingStage].icon}{' '}
              {loadingMessages[loadingStage].message}
            </motion.span>
          </motion.div> : <div className="flex items-center justify-center">
            <GiftIcon className="w-6 h-6 mr-3" />
            Find Perfect Gifts
          </div>}
      </motion.button>
    </motion.div>;
}