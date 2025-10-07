import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, TagIcon, ShoppingCartIcon, XIcon, StarIcon, CheckCircle2Icon, SparklesIcon, Share2Icon, CopyIcon, CheckIcon } from 'lucide-react';
import { getApiBaseUrl, apiFetch, isAnySandboxMode } from '../utils/apiConfig';
import { ModeIndicator } from './ModeIndicator';
import { useTracking } from '../hooks/useTracking';
import { StarRating } from './StarRating';
import { getOrCreateAnonId } from '../utils/tracking';

// Typeform global declaration
declare global {
  interface Window {
    TypeformEmbed: {
      init: () => void;
    };
  }
}
interface Product {
  sku: string;
  productTitle?: string;
  imageUrl?: string;
  price: string;
  description: string;
  rank: string;
  // Fields from API response
  ASIN?: string;
  name?: string;
  image_url?: string;
}
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
  clientOrigin?: string;
  llmEnabled?: boolean;
}
export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize tracking with periodic pings
  useTracking();

  // State declarations
  const [showVoucherIncentive, setShowVoucherIncentive] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [showFeedbackBanner, setShowFeedbackBanner] = useState(() => {
    // Check local storage for show_feedback_form flag
    const showFeedbackForm = localStorage.getItem('show_feedback_form');
    return showFeedbackForm === 'true';
  });
  const [bannerReady, setBannerReady] = useState(false);
  const [showEmailFallback, setShowEmailFallback] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const [emailAddress, setEmailAddress] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [sharePopoverPosition, setSharePopoverPosition] = useState<'top' | 'bottom'>('top');
  const [copySuccess, setCopySuccess] = useState(false);
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bottomShareSectionRef = useRef<HTMLDivElement>(null);
  
  // Update animation stage as text elements appear
  useEffect(() => {
    if (showEmailFallback && !showCompletion) {
      const timer1 = setTimeout(() => setAnimationStage(1), 0);
      const timer2 = setTimeout(() => setAnimationStage(2), 2000);
      const timer3 = setTimeout(() => setAnimationStage(3), 4000);
      const timer4 = setTimeout(() => setAnimationStage(4), 6000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [showEmailFallback, showCompletion]);

  // Show email input after 2 seconds when email fallback appears
  useEffect(() => {
    if (showEmailFallback && !showCompletion) {
      const timer = setTimeout(() => {
        setShowEmailInput(true);
      }, 2000); // Match the delay of the email input animation
      
      return () => clearTimeout(timer);
    } else {
      setShowEmailInput(false);
    }
  }, [showEmailFallback, showCompletion]);

  
  // Prefill email in sandbox mode
  useEffect(() => {
    const isSandbox = window.location.hostname.includes('sandbox') || window.location.hostname.includes('localhost');
    if (isSandbox) {
      setEmailAddress('kev@example.com');
    }
  }, []);


  // Function to check if user is in 25% feedback cohort
  const isInFeedbackCohort = (anonId: string): boolean => {
    let hash = 0;
    for (let i = 0; i < anonId.length; i++) {
      hash = ((hash << 5) - hash) + anonId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 4 === 0;
  };

  // Function to count feedback given
  const getFeedbackCount = (): number => {
    return Object.values(productFeedback).filter(feedback => feedback !== null).length;
  };

  // Function to get progress percentage
  const getProgressPercentage = (): number => {
    const total = products.length;
    const given = getFeedbackCount();
    return total > 0 ? (given / total) * 100 : 0;
  };

  // Function to submit form response to API
  const submitFormResponse = async (formResponseId: string) => {
    if (!recommendationId) {
      console.error('No recommendation ID available for form submission');
      return;
    }

    try {
      console.log('Submitting form response to API...', {
        recommendation_id: recommendationId,
        form_response_id: formResponseId
      });

      const response = await apiFetch(`${getApiBaseUrl()}/feedback/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          form_response_id: formResponseId
        })
      }, 'POST /feedback/form');

      if (response.ok) {
        console.log('✅ Form response submitted successfully');
        const responseData = await response.text();
        console.log('API response:', responseData);
        
        // Mark form as submitted and close modal
        localStorage.setItem('typeform_submitted', 'true');
        setHasSubmittedForm(true);
        setShowVoucherIncentive(false);
      } else {
        console.error('❌ Failed to submit form response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error submitting form response:', error);
    }
  };

  // Listen for Typeform submission events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from Typeform
      if (event.origin !== 'https://form.typeform.com') {
        return;
      }

      // Log all Typeform events for debugging
      console.log('Typeform event received:', event.data);

      // Handle different Typeform events
      if (event.data && typeof event.data === 'object') {
        // Check for various possible event types
        const eventType = event.data.type || event.data.eventType || event.data.event;
        
        if (eventType === 'form-submit' || eventType === 'form-complete' || eventType === 'submit') {
          console.log('Form submitted/completed! Event type:', eventType);
          console.log('Full event data:', event.data);
          
          // Look for response ID in various possible locations
          const responseId = event.data.responseId || 
                           event.data.response_id || 
                           event.data.responseToken || 
                           event.data.token ||
                           event.data.id;
          
          if (responseId) {
            console.log('🎉 Response ID captured:', responseId);
            
            // Submit to /feedback/form endpoint
            submitFormResponse(responseId);
          } else {
            console.log('⚠️ No response ID found in event data');
          }
        }
        
        // Also check for any response ID regardless of event type
        const responseId = event.data.responseId || 
                         event.data.response_id || 
                         event.data.responseToken || 
                         event.data.token ||
                         event.data.id;
        
        if (responseId) {
          console.log('Response ID found in event:', responseId);
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Check localStorage and cohort on component mount
  useEffect(() => {
    // Check if user has already submitted
    const hasSubmitted = localStorage.getItem('typeform_submitted') === 'true';
    setHasSubmittedForm(hasSubmitted);

    // Check local storage flag first
    const showFeedbackForm = localStorage.getItem('show_feedback_form');
    const localStorageFlag = showFeedbackForm === 'true';
    
    // Check if user is in feedback cohort or has manual override
    const urlParams = new URLSearchParams(window.location.search);
    const manualOverride = urlParams.get('show_feedback') === 'true';
    
    let shouldShowBanner = false;
    
    // Check if local storage flag is explicitly set
    if (showFeedbackForm !== null) {
      // Local storage flag is set, use its value
      shouldShowBanner = localStorageFlag;
    } else if (manualOverride) {
      // No local storage flag, check manual override
      shouldShowBanner = true;
    } else {
      // No local storage flag, use cohort logic
      const anonId = getOrCreateAnonId();
      const inCohort = isInFeedbackCohort(anonId);
      shouldShowBanner = inCohort;
    }
    
    // Set banner visibility immediately, but delay showing it by 4 seconds
    setShowFeedbackBanner(shouldShowBanner);
    
    if (shouldShowBanner && !hasSubmitted) {
      const timer = setTimeout(() => {
        setBannerReady(true);
      }, 4000); // 4 second delay
      
      return () => clearTimeout(timer);
    } else {
      setBannerReady(true); // Show immediately if not in cohort or already submitted
    }
  }, []);

  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Safely extract state data with fallbacks
  const formData = location.state?.formData || null;
  const recommendations = location.state?.recommendations || [];
  const recommendationId = location.state?.recommendationId || null;
  
  // Debug logging (only log once)
  useEffect(() => {
    console.log('🔍 ResultsPage Debug:', {
      hasLocationState: !!location.state,
      formData: !!formData,
      recommendationsCount: recommendations?.length || 0,
      recommendationId: !!recommendationId
    });
  }, []);

  // Store recommendation data in localStorage for sharing
  useEffect(() => {
    if (recommendationId && recommendations && recommendations.length > 0) {
      const dataToStore = {
        recommendation_id: recommendationId,
        recommendations: recommendations,
        formData: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`recommendation_${recommendationId}`, JSON.stringify(dataToStore));
      console.log('Stored recommendation data in localStorage for sharing:', recommendationId);
    }
  }, [recommendationId, recommendations, formData]);
  const routeError = location.state?.error || false;
  const [error, setError] = useState(routeError);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFeedback, setModalFeedback] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [showRatingThankYou, setShowRatingThankYou] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(true);
  
  // Cycle through titles - FIXED VERSION
  useEffect(() => {
    // Clear any existing interval first
    if (titleIntervalRef.current) {
      clearInterval(titleIntervalRef.current);
      titleIntervalRef.current = null;
    }
    
    if (isSubmitted && !showEmailFallback) {
      console.log('Starting title cycling...');
      setTitleIndex(0);
      
      titleIntervalRef.current = setInterval(() => {
        setTitleIndex(prev => {
          console.log('Title cycling from:', prev);
          if (prev === 0) {
            console.log('Going to 1');
            return 1;
          }
          if (prev === 1) {
            console.log('Going to 2');
            return 2;
          }
          if (prev === 2) {
            console.log('Going to 0');
            return 0;
          }
          return 0;
        });
      }, 4000);
    }
    
    return () => {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
        titleIntervalRef.current = null;
      }
    };
  }, [isSubmitted]); // Only depend on isSubmitted, not showEmailFallback
  
  // Process and normalize the recommendations data
  useEffect(() => {
    console.log('Raw recommendations data:', recommendations);
    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      // Map and normalize the data structure
      const normalizedProducts = recommendations.map(product => {
        return {
          sku: product.sku || product.ASIN || '',
          productTitle: product.productTitle || product.name || '',
          imageUrl: product.imageUrl || product.image_url || '',
          price: product.price || '0.00',
          description: product.description || '',
          rank: product.rank || '999',
          // Keep original fields too
          ASIN: product.ASIN,
          name: product.name,
          image_url: product.image_url
        };
      });
      // Sort products by rank (as number)
      const sortedProducts = [...normalizedProducts].sort((a, b) => {
        const rankA = parseInt(a.rank) || 999;
        const rankB = parseInt(b.rank) || 999;
        return rankA - rankB;
      });
      console.log('Sorted and normalized products:', sortedProducts);
      setProducts(sortedProducts);
    }
  }, [recommendations]);

  // Auto-fill feedback in sandbox mode with localStorage key
  useEffect(() => {
    if (isAnySandboxMode() && products.length > 0) {
      const addLabelsAndRating = localStorage.getItem('add_labels_and_rating');
      
      if (addLabelsAndRating === 'true') {
        console.log('🧪 Auto-filling feedback in sandbox mode with', products.length, 'products');
        
        // Auto-fill product feedback with sample data
        const autoFeedback: Record<number, 'up' | 'down' | null> = {};
        products.forEach((_, index) => {
          if (index < 5) { // Only fill first 5 products
            if (index === 0 || index === 2 || index === 3 || index === 4) {
              autoFeedback[index] = 'up';    // Thumbs up
            } else if (index === 1) {
              autoFeedback[index] = 'down';  // Thumbs down
            } else {
              autoFeedback[index] = null;    // No feedback
            }
          }
        });
        
        setProductFeedback(autoFeedback);
        
        // Auto-fill recommendation rating
        setRecommendationRating(4); // 4-star rating
        
        console.log('✅ Auto-filled feedback:', autoFeedback, 'with 4-star rating');
      }
    }
  }, [products]);
  // Redirect to home if accessed directly without state
  useEffect(() => {
    if (!location.state) {
      console.log('No location state found, redirecting to home');
      navigate('/');
    }
  }, [location.state, navigate]);
  // Get top recommendation and other recommendations
  const topRecommendation = products && products.length > 0 ? products[0] : null;
  const otherRecommendations = products && products.length > 1 ? products.slice(1) : [];
  // Generate Amazon URL from SKU with affiliate tag
  const generateAmazonUrl = (sku: string) => {
    if (!sku) {
      console.error('No SKU provided for Amazon URL generation');
      return 'https://www.amazon.co.uk?tag=simplysent09-21';
    }
    return `https://www.amazon.co.uk/dp/${sku}?tag=simplysent09-21`;
  };
  // Interest emoji helpers
  const interestEmojiMap: Record<string, string> = {
    sports: '🏀', football: '⚽', gaming: '🎮', music: '🎵', cooking: '👩‍🍳', baking: '🧁',
    fashion: '👗', tech: '💻', technology: '💻', books: '📚', reading: '📖', coffee: '☕',
    wine: '🍷', skincare: '🧴', beauty: '💄', fitness: '🏋️', gym: '🏋️', outdoors: '🏕️',
    hiking: '🥾', camping: '🏕️', art: '🎨', pets: '🐾', gardening: '🌿', travel: '✈️',
    photography: '📷', jewelry: '💍', toys: '🧸', home: '🏠', diy: '🧰', food: '🍽️',
    tea: '🍵', beer: '🍺'
  };
  const getEmojiForInterest = (interest: string): string => {
    const key = (interest || '').toLowerCase().trim();
    return interestEmojiMap[key] || '🎁';
  };
  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  // Feedback state for each product
  const [productFeedback, setProductFeedback] = useState<Record<number, 'up' | 'down' | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  });
  // Handle feedback submission
  const handleFeedback = async (sku: string, isGood: boolean) => {
    if (!recommendationId) return;
    try {
      console.log('Sending feedback for item:', sku, isGood ? 'good' : 'bad');
      const response = await apiFetch(`${getApiBaseUrl()}/feedback/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            sku: sku,
            feedback_label: isGood ? 1 : 0
          }
        })
      }, 'POST /feedback/label');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Feedback sent successfully');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  // Handle link click tracking
  const handleLinkClick = async (sku: string) => {
    if (!recommendationId) return;
    try {
      console.log('Sending click feedback for item:', sku);
      await apiFetch(`${getApiBaseUrl()}/feedback/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          item_feedback: {
            sku: sku,
            clicked: true
          }
        })
      }, 'POST /feedback/click');
      console.log('Click feedback sent successfully');
    } catch (error) {
      console.error('Error sending link click feedback:', error);
    }
  };
  // Function to get modal height based on current stage
  const getModalHeight = () => {
    if (!isSubmitted) {
      // State 1: Original feedback form "🧞Ready to find better matches!" (same size as state 2)
      return '380px';
    } else if (isSubmitted && !showEmailFallback) {
      // State 2: Genie animation "🧞‍♂️ Cosmic gift energy detected" (same size as state 1)
      return '380px';
    } else if (isSubmitted && showEmailFallback && !showEmailInput) {
      // State 3: Email text appears "Drop your email below..." (slight increase)
      return '420px';
    } else if (isSubmitted && showEmailFallback && showEmailInput) {
      // State 4: Email input and button appear (larger increase)
      return '480px';
    }
    return '380px'; // fallback
  };

  // Handle modal close and reset
  const handleModalClose = () => {
    setShowModal(false);
    setModalFeedback('');
    setModalError('');
    setIsSubmitted(false);
    setShowEmailFallback(false);
    setTimerProgress(0);
    setEmailAddress('');
    setShowCompletion(false);
    setShowEmailInput(false);
    setTitleIndex(0); // Reset title to first one
  };

  const handleCopyLink = async () => {
    const url = `https://simplysent.co/${recommendationId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'My Gift Recommendations',
      text: 'Check out my personalized gift recommendations!',
      url: `https://simplysent.co/${recommendationId}`
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy if native share is not available
        handleCopyLink();
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback to copy on error
      handleCopyLink();
    }
  };

  // Close share popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSharePopover) {
        const target = event.target as Element;
        if (!target.closest('[data-share-popover]')) {
          setShowSharePopover(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSharePopover]);

  // Smooth scroll to bottom share section when it appears
  useEffect(() => {
    if (showSharePopover && sharePopoverPosition === 'bottom' && bottomShareSectionRef.current) {
      // Small delay to allow the animation to start, then scroll smoothly
      const timer = setTimeout(() => {
        bottomShareSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [showSharePopover, sharePopoverPosition]);

  // Handle going back to form
  const handleBackToForm = () => {
    handleModalClose();
    navigate('/');
  };

  // Handle rating change
  const handleRatingChange = async (rating: number) => {
    setRecommendationRating(rating);
    setShowRatingThankYou(true);
    setShowRatingInput(false); // Hide the star input after selection
    
    // Submit rating to /v2/feedback endpoint
    if (recommendationId) {
      try {
        const response = await apiFetch(`${getApiBaseUrl()}/feedback/rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recommendation_id: recommendationId,
            rating: rating
          })
        });
        
        if (response.ok) {
          console.log('Rating submitted successfully');
        } else {
          console.error('Failed to submit rating');
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
    
    // Hide thank you message after 3 seconds
    setTimeout(() => {
      setShowRatingThankYou(false);
    }, 3000);
  };

  // Handle change rating button
  const handleChangeRating = () => {
    setShowRatingInput(true);
  };

  // Handle modal feedback submission - now just starts the timer
  const handleModalSubmit = () => {
    if (!recommendationId) return;
    if (modalFeedback.length > 0 && modalFeedback.length < 10) {
      setModalError('Please provide at least 10 characters of feedback');
      return;
    }
    setModalError(''); // Clear any previous errors
    
    // Start progress timer instead of submitting immediately
    setIsSubmitted(true);
    setTimerProgress(0);
    setShowEmailFallback(false);
    
    // Start 5-hour timer (18,000 seconds)
    const timerInterval = setInterval(() => {
      setTimerProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 18000) {
          clearInterval(timerInterval);
          handleModalClose();
          return 18000;
        }
        return newProgress;
      });
    }, 1000);
    
    // Show email fallback after 4 seconds
    setTimeout(() => {
      setShowEmailFallback(true);
    }, 4000);
  };

  // Handle email notification submission
  const handleEmailNotify = async () => {
    console.log('handleEmailNotify called', { recommendationId, emailAddress, isLoading });
    if (!recommendationId) {
      console.log('No recommendationId, returning');
      return;
    }
    if (!emailAddress.trim()) {
      console.log('No email address, setting error');
      setModalError('Please enter your email address');
      return;
    }
    
    console.log('Starting email submission...');
    setIsLoading(true);
    setModalError(''); // Clear any previous errors
    
    try {
      console.log('Submitting feedback and email:', { modalFeedback, emailAddress });
      
      // Submit comment only if there's feedback text
      if (modalFeedback.trim()) {
        console.log('Submitting comment feedback...');
        const commentResponse = await apiFetch(`${getApiBaseUrl()}/feedback/comment?usellm=false&return_new_recommendation=false`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recommendation_id: recommendationId,
            feedback_comment: modalFeedback.trim()
          })
        }, 'POST /feedback/comment');
        
        if (!commentResponse.ok) {
          const errorText = await commentResponse.text();
          console.error('Comment API Error Response:', commentResponse.status, errorText);
          throw new Error(`Comment submission failed: ${commentResponse.status} - ${errorText || 'Unknown error'}`);
        }
        
        const commentText = await commentResponse.text();
        console.log('Comment feedback response:', commentText);
      } else {
        console.log('No comment feedback to submit, skipping comment endpoint');
      }
      
      // Submit email separately
      console.log('Submitting email notification...');
      const emailResponse = await apiFetch(`${getApiBaseUrl()}/feedback/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation_id: recommendationId,
          email: emailAddress.trim(),
          anon_id: getOrCreateAnonId()
        })
      }, 'POST /feedback/email');
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Email API Error Response:', emailResponse.status, errorText);
        throw new Error(`Email submission failed: ${emailResponse.status} - ${errorText || 'Unknown error'}`);
      }
      
      const emailText = await emailResponse.text();
      console.log('Email feedback response:', emailText);
      
      setSubmissionCount(prev => prev + 1);
      setModalFeedback('');
      
      // Show completion state in popup (don't navigate away)
      setShowCompletion(true);
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Comment submission failed:')) {
          setModalError(`Comment error: ${error.message.split('Comment submission failed: ')[1]}`);
        } else if (error.message.includes('Email submission failed:')) {
          setModalError(`Email error: ${error.message.split('Email submission failed: ')[1]}`);
        } else if (error.message.includes('Network')) {
          setModalError('Network error. Please check your connection and try again.');
        } else {
          setModalError(`Error: ${error.message}`);
        }
      } else {
        setModalError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Redirect to error page if no data is available
  if (!formData || !products || products.length === 0 || !topRecommendation) {
    console.log('🚨 Redirecting to error page. Debug info:', {
      hasFormData: !!formData,
      hasProducts: !!products,
      productsLength: products?.length || 0,
      hasTopRecommendation: !!topRecommendation,
      products: products
    });
    navigate('/error', { state: { errorMessage: 'No recommendations available', formData, clientRequestId: 'unknown' } });
    return null;
  }
  return (
    <>
      <motion.div initial={{
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
        {/* Back Button and Share */}
        <div className="flex items-center mb-6 justify-between">
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
            Start Over
          </motion.button>
          
          <div className="flex-1 flex justify-center">
            <ModeIndicator />
          </div>
          
          <div className="flex items-center">
            {/* Share Button - only show if we have a recommendationId */}
            {recommendationId && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  if (showSharePopover && sharePopoverPosition === 'top') {
                    setShowSharePopover(false);
                    setSharePopoverPosition('top'); // Reset position
                  } else {
                    setSharePopoverPosition('top');
                    setShowSharePopover(true);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
              >
                <Share2Icon className="w-4 h-4" />
                Share
              </motion.button>
            )}
          </div>
        </div>

        {/* Share Your Recommendations Section - Top */}
        <AnimatePresence>
          {showSharePopover && sharePopoverPosition === 'top' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative mb-6"
              data-share-popover
            >
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Share Your Recommendations</h3>
                  <button
                    onClick={() => setShowSharePopover(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shareable Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`https://simplysent.co/${recommendationId}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                          copySuccess
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                        title={copySuccess ? 'Copied!' : 'Copy Link'}
                      >
                        {copySuccess ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    {/* Native Share Button */}
                    <div className="mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNativeShare}
                        className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        <Share2Icon className="w-4 h-4" />
                        Share via iOS/Android
                      </motion.button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Share this link with friends and family so they can see your personalized gift recommendations!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Recommendation Section */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-gradient-to-br from-[#7265f1] via-[#a87ec0] to-[#de9696] rounded-2xl shadow-xl p-8 border-2 border-white">
          <div className="text-center mb-6 px-4 sm:px-0 text-white">
            <h2 className="text-3xl font-bold mb-2">Top Recommendation</h2>
            <p className="text-white/90 mb-2">Based on their interests:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {Array.isArray(formData.interests) && formData.interests.length > 0 ? (
                formData.interests.map((interest: string, idx: number) => (
                  <span key={idx} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur">
                    <span className="mr-1">{getEmojiForInterest(interest)}</span>{interest}
                  </span>
                ))
              ) : (
                <span className="text-white/80">No interests provided</span>
              )}
            </div>
            <p className="text-white/90">
              And your budget of £{formData.minBudget} - £{formData.maxBudget}
            </p>
          </div>

          {/* Top Product Card */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.4
        }} className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
            <div className="relative">
              <img src={topRecommendation.imageUrl || topRecommendation.image_url} alt={getProductTitle(topRecommendation)} className="w-full h-64 object-contain bg-white p-4" onError={e => {
              console.error('Image load error:', e);
              e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
            }} />
              <div className="absolute bottom-4 right-4 md:bottom-auto md:top-4 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full shadow-lg ring-2 ring-yellow-300/60">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  £{topRecommendation.price}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <div className="bg-white text-[#343e47] px-4 py-1 rounded-full shadow-lg border-2 border-[#343e47]">
                  <div className="flex items-center">
                    <span className="font-black text-base tracking-tight mr-0.5" style={{fontWeight: '900', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)'}}>Check</span>
                    <img src="/prime_day_logo2.png" alt="Prime Day" className="h-10 w-auto" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {truncateText(getProductTitle(topRecommendation), 60)}
              </h3>
              {/* Ratings removed */}
              <div className="flex items-start space-x-3 mb-3">
                <TagIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {truncateText(capitalizeFirstWord(topRecommendation.description), 120)}
                </p>
              </div>
              {/* Buttons */}
              <div className="space-y-3">
                <a href={generateAmazonUrl(topRecommendation.sku)} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(topRecommendation.sku)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center no-underline">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Open on Amazon
                </a>
                
                
                {/* Sales CTA for top recommendation */}
                <div className="text-center py-2 px-4">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    🎯 <span className="text-orange-600 font-semibold">Perfect match!</span> Add to your Amazon wishlist or cart
                  </p>
                </div>
                
                {/* Floating Action Buttons */}
                <div className="relative group">
                  <div className="flex justify-center gap-4">
                    {/* Love Button */}
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (productFeedback[0] !== 'down') {
                          setProductFeedback(prev => ({
                            ...prev,
                            0: 'up'
                          }));
                          handleFeedback(topRecommendation.sku, true);
                        }
                      }}
                      className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                        productFeedback[0] === 'up' 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-300/50' 
                          : productFeedback[0] === 'down'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-br from-green-100 to-emerald-200 hover:from-green-300 hover:to-emerald-400 shadow-green-200/50 hover:shadow-green-300/70'
                      }`}
                      disabled={productFeedback[0] === 'down'}
                    >
                      {productFeedback[0] === 'up' ? (
                        <span className="text-2xl">💚</span>
                      ) : (
                        <span className="text-2xl">💚</span>
                      )}
                      {productFeedback[0] === 'up' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Not for me Button */}
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (productFeedback[0] !== 'up') {
                          setProductFeedback(prev => ({
                            ...prev,
                            0: 'down'
                          }));
                          handleFeedback(topRecommendation.sku, false);
                        }
                      }}
                      className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                        productFeedback[0] === 'down' 
                          ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-300/50' 
                          : productFeedback[0] === 'up'
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-br from-red-100 to-rose-200 hover:from-red-300 hover:to-rose-400 shadow-red-200/50 hover:shadow-red-300/70'
                      }`}
                      disabled={productFeedback[0] === 'up'}
                    >
                      {productFeedback[0] === 'down' ? (
                        <span className="text-2xl">💔</span>
                      ) : (
                        <span className="text-2xl">💔</span>
                      )}
                      {productFeedback[0] === 'down' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✗</span>
                        </motion.div>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Helper text */}
                  <div className="text-center mt-3">
                    <p className="text-sm text-gray-600">
                      {productFeedback[0] === null ? '✨ Teach your genie about this gift' : 
                       productFeedback[0] === 'up' ? '🧞‍♂️ Genie learned: "More like this!" 💚' :
                       '🧞‍♂️ Genie learned: "Avoid this style" 💔'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>


        {/* Gift Genie Training Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className={`rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border-2 relative overflow-hidden ${
            getFeedbackCount() === products.length 
              ? 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 border-cyan-200 shadow-2xl shadow-cyan-200/30' 
              : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 shadow-xl shadow-blue-200/20'
          }`}
        >
          {/* Magical sparkle overlay */}
          {getFeedbackCount() === products.length && (
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full opacity-20 blur-sm"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-6 left-6 w-6 h-6 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-30 blur-sm"
              />
              <motion.div
                animate={{
                  rotate: [0, -360],
                  scale: [1, 0.8, 1]
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 left-4 w-4 h-4 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-25 blur-sm"
              />
            </div>
          )}
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              {getFeedbackCount() === products.length ? (
                // Special fully trained genie with image
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative"
                >
                  <img 
                    src="/genie3.png" 
                    alt="Fully trained genie" 
                    className="w-20 h-20 object-contain"
                  />
                  {/* Magical aura around fully trained genie */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur-xl"
                    style={{ zIndex: -1 }}
                  />
                </motion.div>
              ) : (
                // Genie image for training states
                <div className={`${getFeedbackCount() === 0 ? 'opacity-50' : getFeedbackCount() < products.length ? 'animate-pulse' : 'animate-bounce'}`}>
                  <img 
                    src="/genie3.png" 
                    alt="Gift Genie" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className={`text-2xl font-bold ${
                  getFeedbackCount() === products.length ? 'text-cyan-800' : 'text-blue-800'
                }`}>
                  {getFeedbackCount() === 0 ? 'Your Gift Genie Needs Training' : 
                   getFeedbackCount() < products.length ? 'Training Your Gift Genie' : 
                   'Your Gift Genie is Ready!'}
                </h3>
                <p className={`font-medium ${
                  getFeedbackCount() === products.length ? 'text-cyan-700' : 'text-blue-700'
                }`}>
                  {getFeedbackCount() === 0 ? 'Your genie is weak - rate products to train it!' :
                   getFeedbackCount() < products.length ? 'Each rating makes your genie stronger!' :
                   '🧞‍♂️ Your genie is fully trained and ready for magic!'}
                </p>
                {getFeedbackCount() === products.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-2 text-sm text-cyan-600 font-medium"
                  >
                    ✨ The magic is real - your genie can now predict perfect gifts! ✨
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Magic Crystal Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                {Array.from({ length: products.length }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0.3 }}
                    animate={{ 
                      scale: i < getFeedbackCount() ? 1.3 : 0.8,
                      opacity: i < getFeedbackCount() ? 1 : 0.3
                    }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative ${
                      i < getFeedbackCount() 
                        ? getFeedbackCount() === products.length
                          ? 'bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200 border-cyan-300 shadow-xl shadow-cyan-200/50'
                          : 'bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200 border-blue-300 shadow-lg shadow-blue-200/50'
                        : 'bg-gradient-to-br from-slate-100 to-gray-200 border-slate-300 shadow-sm'
                    }`}
                  >
                    {i < getFeedbackCount() ? (
                      <motion.div
                        animate={getFeedbackCount() === products.length ? {
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: getFeedbackCount() === products.length ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                        className="w-8 h-8"
                      >
                        <img 
                          src="/magic_crystal_selected.png" 
                          alt="Selected Magic Crystal" 
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    ) : (
                      <img 
                        src="/magic_crystal.png" 
                        alt="Magic Crystal" 
                        className="w-8 h-8 object-contain opacity-40"
                      />
                    )}
                    {/* Magical sparkles for fully trained crystals */}
                    {i < getFeedbackCount() && getFeedbackCount() === products.length && (
                      <motion.div
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  getFeedbackCount() === products.length ? 'text-cyan-700' : 'text-blue-700'
                }`}>
                  {getFeedbackCount()}/{products.length}
                </div>
                <div className={`text-sm font-medium ${
                  getFeedbackCount() === products.length ? 'text-cyan-600' : 'text-blue-600'
                }`}>
                  {getFeedbackCount() === products.length ? 'Magic crystals mastered!' : 'Magic crystals collected'}
                </div>
              </div>
            </div>

            {/* Dynamic Encouragement */}
            {getFeedbackCount() === 0 && (
              <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                <p className="text-amber-800 font-medium">
                  🧞‍♂️ Your genie is weak! Rate products to train it!
                </p>
              </div>
            )}
            {getFeedbackCount() > 0 && getFeedbackCount() < products.length && (
              <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                <p className="text-amber-800 font-medium">
                  🧞‍♂️ Genie is getting stronger! {products.length - getFeedbackCount()} more ratings to fully train it!
                </p>
              </div>
            )}
            {getFeedbackCount() === products.length && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                className="relative overflow-hidden"
              >
                {/* Magical background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 rounded-xl opacity-50"></div>
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(45deg, #8B5CF6, #EC4899, #6366F1)',
                      'linear-gradient(45deg, #EC4899, #6366F1, #8B5CF6)',
                      'linear-gradient(45deg, #6366F1, #8B5CF6, #EC4899)'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 rounded-xl opacity-20"
                />
                
                {/* Floating magical particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.sin(i) * 15, 0],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3 + (i * 0.3),
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      background: `hsl(${i * 60}, 70%, 60%)`,
                      boxShadow: `0 0 8px hsl(${i * 60}, 70%, 60%)`
                    }}
                  />
                ))}
                
                <div className="relative bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 rounded-xl p-6 border-2 border-purple-300 shadow-2xl">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <motion.div
                        animate={{
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="text-3xl"
                      >
                        ✨
                      </motion.div>
                      <h4 className="text-purple-800 font-bold text-xl">
                        🧞‍♂️ Your genie is fully trained and ready for magic!
                      </h4>
                      <motion.div
                        animate={{
                          rotate: [0, -360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="text-3xl"
                      >
                        ✨
                      </motion.div>
                    </div>
                    <p className="text-purple-700 font-semibold text-sm">
                      Your genie has mastered the art of gift-giving and is ready to create perfect recommendations!
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Floating Voucher Incentive */}
        {!hasSubmittedForm && !bannerDismissed && showFeedbackBanner && bannerReady && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoucherIncentive(true)}
              className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-4 max-w-sm cursor-pointer relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerDismissed(true);
                }}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-30 p-1 bg-black/20 rounded-full hover:bg-black/30"
                title="Close"
              >
                <XIcon className="w-6 h-6" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <TagIcon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg drop-shadow-sm">
                    5 Questions for £5
                  </h4>
                </div>
                
                <p className="text-white/90 text-sm mb-3 drop-shadow-sm">
                  Quick feedback form for Amazon voucher
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-xs">
                    <span className="font-semibold">Quick</span> • 2 min
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">Start</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Typeform Modal */}
        <AnimatePresence>
          {showVoucherIncentive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVoucherIncentive(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">5 Questions for £5 Amazon Voucher</h3>
                  <button
                    onClick={() => setShowVoucherIncentive(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  {hasSubmittedForm ? (
                    <div className="text-center py-12">
                      <CheckCircle2Icon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Thank You!
                      </h3>
                      <p className="text-gray-600">
                        You've already submitted your feedback.
                      </p>
                    </div>
                  ) : (
                    <iframe
                      key={showVoucherIncentive ? 'typeform-open' : 'typeform-closed'}
                      src="https://form.typeform.com/to/t9PLfcPq"
                      width="100%"
                      height="500"
                      frameBorder="0"
                      className="rounded-lg"
                      title="Feedback Form"
                    ></iframe>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other Recommendations Section */}
        {otherRecommendations.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-heading">
              More Great Options
            </h3>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherRecommendations.map((item, index) => {
            const feedbackIndex = index + 1;
            return <motion.div key={item.sku} variants={itemVariants} className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                    {/* Add image section at the top */}
                    <div className="relative">
                      <img src={item.imageUrl || item.image_url} alt={getProductTitle(item)} className="w-full h-48 object-contain bg-white p-4" onError={e => {
                  console.error('Image load error:', e);
                  e.currentTarget.src = 'https://cerescann.com/wp-content/uploads/2016/07/Product-PlaceHolder.jpg';
                }} />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1 rounded-full shadow-md">
                        <span className="text-purple-600 font-semibold">
                          £{item.price}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <div className="bg-white text-[#343e47] px-3 py-0.5 rounded-full shadow-md border border-[#343e47]">
                          <div className="flex items-center">
                            <span className="font-black text-sm tracking-tight mr-0.5" style={{fontWeight: '900', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)'}}>Check</span>
                            <img src="/prime_day_logo2.png" alt="Prime Day" className="h-8 w-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {truncateText(getProductTitle(item), 60)}
                      </h4>
                      {/* Ratings removed */}
                      <div className="flex items-start space-x-2 mb-2">
                        <TagIcon className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          {truncateText(capitalizeFirstWord(item.description), 100)}
                        </p>
                      </div>
                      {/* Buttons */}
                      <div className="space-y-2 mt-auto">
                        <a href={generateAmazonUrl(item.sku)} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(item.sku)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm no-underline">
                          <ShoppingCartIcon className="w-4 h-4 mr-2" />
                          Open on Amazon
                        </a>
                        
                        
                        {/* Sales CTA */}
                        <div className="text-center py-2">
                          <p className="text-xs text-gray-600 font-medium">
                            💡 <span className="text-orange-600 font-semibold">Add to your Amazon wishlist</span> or save for later!
                          </p>
                        </div>
                        {/* Genie Training Buttons */}
                        <div className="flex justify-center gap-3 mt-3">
                          {/* Love Button */}
                          <motion.button 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (productFeedback[feedbackIndex] !== 'down') {
                                setProductFeedback(prev => ({
                                  ...prev,
                                  [feedbackIndex]: 'up'
                                }));
                                handleFeedback(item.sku, true);
                              }
                            }}
                            className={`relative w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                              productFeedback[feedbackIndex] === 'up' 
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-300/50' 
                                : productFeedback[feedbackIndex] === 'down'
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-br from-green-100 to-emerald-200 hover:from-green-300 hover:to-emerald-400 shadow-green-200/50 hover:shadow-green-300/70'
                            }`}
                            disabled={productFeedback[feedbackIndex] === 'down'}
                          >
                            <span className="text-lg">💚</span>
                            {productFeedback[feedbackIndex] === 'up' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <span className="text-white text-xs">✓</span>
                              </motion.div>
                            )}
                          </motion.button>

                          {/* Not for me Button */}
                          <motion.button 
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (productFeedback[feedbackIndex] !== 'up') {
                                setProductFeedback(prev => ({
                                  ...prev,
                                  [feedbackIndex]: 'down'
                                }));
                                handleFeedback(item.sku, false);
                              }
                            }}
                            className={`relative w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                              productFeedback[feedbackIndex] === 'down' 
                                ? 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-300/50' 
                                : productFeedback[feedbackIndex] === 'up'
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-br from-red-100 to-rose-200 hover:from-red-300 hover:to-rose-400 shadow-red-200/50 hover:shadow-red-300/70'
                            }`}
                            disabled={productFeedback[feedbackIndex] === 'up'}
                          >
                            <span className="text-lg">💔</span>
                            {productFeedback[feedbackIndex] === 'down' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                              >
                                <span className="text-white text-xs">✗</span>
                              </motion.div>
                            )}
                          </motion.button>
                        </div>
                        
                        {/* Helper text for other recommendations */}
                        <div className="text-center mt-2">
                          <p className="text-xs text-gray-500">
                            {productFeedback[feedbackIndex] === null ? '✨ Teach your genie' : 
                             productFeedback[feedbackIndex] === 'up' ? '🧞‍♂️ Learned!' :
                             '🧞‍♂️ Noted!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>;
          })}
            </motion.div>
          </motion.div>}

        {/* Rating Section */}
        <motion.div 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0,
            scale: getFeedbackCount() === products.length && recommendationRating === 0 ? 1.05 : 1
          }} 
          transition={{
            delay: 0.6,
            type: "spring",
            stiffness: 200
          }} 
          className={`rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-6 transition-all duration-500 ${
            getFeedbackCount() === products.length && recommendationRating === 0
              ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-4 border-amber-300 shadow-2xl ring-4 ring-amber-200/50'
              : 'bg-white shadow-lg'
          }`}
        >
          <div className="text-center">
            {getFeedbackCount() === products.length && recommendationRating === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                className="mb-4"
              >
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-lg">One More Step!</span>
                  <span className="text-2xl">⭐</span>
                </div>
              </motion.div>
            )}
            <h3 className={`text-xl font-bold mb-4 ${
              getFeedbackCount() === products.length && recommendationRating === 0 
                ? 'text-amber-800' 
                : 'text-gray-900'
            }`}>
              How would you rate these recommendations?
            </h3>
            {showRatingInput ? (
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div
                  animate={getFeedbackCount() === products.length && recommendationRating === 0 ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: getFeedbackCount() === products.length && recommendationRating === 0 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <StarRating
                    value={recommendationRating}
                    onChange={handleRatingChange}
                    size="lg"
                  />
                </motion.div>
                {recommendationRating > 0 && (
                  <span className="text-lg font-semibold text-gray-700">
                    {recommendationRating} star{recommendationRating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-6 h-6 ${
                          star <= recommendationRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {recommendationRating} star{recommendationRating !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={handleChangeRating}
                  className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  Change rating
                </button>
              </div>
            )}
            
            {/* Thank you message */}
            <AnimatePresence>
              {showRatingThankYou && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-2 text-green-600 font-semibold"
                >
                  <CheckCircle2Icon className="w-5 h-5" />
                  <span>Thank you for your feedback!</span>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-sm text-gray-500">
              Your feedback helps us improve our recommendations
            </p>
          </div>
        </motion.div>

        {/* Share Your Recommendations Section - Bottom */}
        <AnimatePresence>
          {showSharePopover && sharePopoverPosition === 'bottom' && (
            <motion.div
              ref={bottomShareSectionRef}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ 
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="mb-6"
              data-share-popover
            >
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Share Your Recommendations</h3>
                  <button
                    onClick={() => setShowSharePopover(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shareable Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`https://simplysent.co/${recommendationId}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${
                          copySuccess
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                        title={copySuccess ? 'Copied!' : 'Copy Link'}
                      >
                        {copySuccess ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    {/* Native Share Button */}
                    <div className="mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNativeShare}
                        className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        <Share2Icon className="w-4 h-4" />
                        Share via iOS/Android
                      </motion.button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Share this link with friends and family so they can see your personalized gift recommendations!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Request New Recommendations Button */}
          <button 
            onClick={() => setShowModal(true)} 
            className={`flex-1 font-semibold py-4 px-8 rounded-2xl shadow-xl transition-all transform flex items-center justify-center gap-3 ${
              getFeedbackCount() < products.length || recommendationRating === 0
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02] hover:shadow-2xl'
            } text-white`} 
            disabled={getFeedbackCount() < products.length || recommendationRating === 0}
          >
            {getFeedbackCount() < products.length ? (
              <>
                <SparklesIcon className="w-5 h-5" />
                Rate all products to unlock better recommendations
              </>
            ) : recommendationRating === 0 ? (
              <>
                <StarIcon className="w-5 h-5" />
                Add a star rating to unlock better recommendations
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Show me better ones based on my ratings
              </>
            )}
          </button>

          {/* Share Button */}
          {recommendationId && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (showSharePopover && sharePopoverPosition === 'bottom') {
                  setShowSharePopover(false);
                  setSharePopoverPosition('bottom'); // Reset position
                } else {
                  setSharePopoverPosition('bottom');
                  setShowSharePopover(true);
                }
              }}
              className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Share2Icon className="w-5 h-5" />
              Share
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleModalClose}>
            <motion.div 
              initial={{
                opacity: 0,
                scale: 0.95,
                height: getModalHeight()
              }} 
              animate={{
                opacity: 1,
                scale: 1,
                height: getModalHeight()
              }} 
              exit={{
                opacity: 0,
                scale: 0.95,
                height: getModalHeight()
              }} 
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }} 
              className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 ${
                !isSubmitted ? 'flex flex-col justify-between' : ''
              }`}
              onClick={e => e.stopPropagation()}
            >
              {isSubmitted ? <motion.div 
              initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} 
              className="pt-10 pb-0 md:pt-10 md:pb-0 lg:pt-10 lg:pb-0 flex flex-col items-center justify-center py-6">
                  <div className="relative mb-6">
                    {/* Main genie image with floating effect */}
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative"
                    >
                      <img 
                        src="/genie3.png" 
                        alt="Genie working" 
                        className="w-32 h-32 mx-auto object-contain"
                      />
                      
                      {/* Magical aura around genie */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur-xl"
                        style={{ zIndex: -1 }}
                      />
                    </motion.div>
                    
                    {/* Floating magical particles around genie */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -30, 0],
                          x: [0, Math.sin(i) * 20, 0],
                          opacity: [0, 1, 0],
                          scale: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 3 + (i * 0.2),
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeInOut"
                        }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          left: `${30 + (i * 5)}%`,
                          top: `${20 + (i % 3) * 15}%`,
                          background: `hsl(${i * 45}, 70%, 60%)`,
                          boxShadow: `0 0 10px hsl(${i * 45}, 70%, 60%)`
                        }}
                      />
                    ))}
                  </div>
                  <motion.h3 
                    key={titleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl font-semibold text-gray-900 mb-4 text-center"
                    style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {titleIndex === 0 && "🧞‍♂️ Cosmic gift energy detected"}
                    {titleIndex === 1 && "🧞‍♂️ Running a multi-dimensional vibe check"}
                    {titleIndex === 2 && "🧞‍♂️ These things can't be rushed."}
                  </motion.h3>
                  
                  {/* Infinite Progress Animation */}
                  <div className="w-full max-w-xs mb-2">
                    <div className="text-sm text-gray-500 mb-2 text-center">
                      CUDA cores at 99%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 h-2 rounded-full"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{ width: '50%' }}
                      />
                    </div>
                  </div>
                  
                  {/* Email Fallback */}
                  {showEmailFallback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full mb-0"
                    >
                      {showCompletion ? (
                        // Confirmation message after email submission
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-3">
                            We'll send your new recommendations to <span className="font-semibold text-purple-600">{emailAddress}</span> in a few hours.
                          </p>
                        </div>
                      ) : (
                        // Email input form
                        <>
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
                            className="text-xs text-gray-600 mb-4 text-center py-2"
                            style={{ paddingTop: "10px" }}
                          >
                            Drop your email below and we'll send your recommendations once he's done meditating.
                          </motion.p>
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
                            className="flex gap-2 mb-2"
                          >
                            <input
                              type="email"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              placeholder="your@email.com"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                console.log('Notify button clicked!', { isLoading, emailAddress, recommendationId });
                                handleEmailNotify();
                              }}
                              disabled={isLoading}  
                              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? 'Sending...' : 'Notify'}
                            </button>
                          </motion.div>
                          <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 2.5 }}
                            className="text-xs text-gray-500 text-center mt-2 mb-2"
                          >
                            We'll never email you about anything else
                          </motion.p>
                        </>
                      )}
                    </motion.div>
                  )}
                </motion.div> : (
                  // Original form state
                  <div className="px-3 md:px-6 relative">
                    <button onClick={handleModalClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10">
                      <XIcon className="w-6 h-6" />
                    </button>
                    <div style={{ height: '20px' }}></div>
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        🧞Ready to find better matches!
                      </h3>
                    </div>
                    <div className="mb-4">
                      <textarea 
                        value={modalFeedback} 
                        onChange={e => {
                          setModalFeedback(e.target.value);
                          if (e.target.value.length >= 10 || e.target.value.length === 0) {
                            setModalError('');
                          }
                        }} 
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${modalError ? 'border-red-300' : 'border-gray-200'}`} 
                        rows={5} 
                        placeholder="Anything else we should know? (Optional)" 
                      />
                      {modalError && <p className="text-red-500 text-sm mt-2">{modalError}</p>}
                    </div>
                    <div className="flex justify-center">
                      <button onClick={handleModalSubmit} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        Find My Perfect Matches
                      </button>
                    </div>
                  </div>
                )}
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </>
  );
}
// Helper functions
const getProductTitle = (product: any): string => {
  // Check all possible title fields and use the first one that exists
  const title = product.productTitle || product.name || '';
  
  // Check if title is "Product not found" or similar error messages
  if (!title || typeof title !== 'string' || title.trim() === '' || 
      title.toLowerCase().includes('not found') || 
      title.toLowerCase().includes('error') ||
      title.toLowerCase().includes('unavailable')) {
    return 'Product Title Not Available';
  }
  
  return capitalizeWords(title);
};
const capitalizeWords = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Product Title Not Available';
  }
  // Remove any HTML tags that might be in the title
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, '');
  return cleanText.split(' ').map(word => {
    if (word.length === 0) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};
const capitalizeFirstWord = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Description not available';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') return 'Text not available';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};