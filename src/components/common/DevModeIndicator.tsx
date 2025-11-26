import { useState, useEffect, useRef } from 'react';
import { 
  isDevModeEnabled, 
  isLocalModeEnabled, 
  isSandboxHeaderEnabled, 
  isProdMode,
  isMockRecommendationsEnabled,
  isWelcomeTrainingEnabled,
  setLocalMode,
  setSandboxHeader,
  setProdMode,
  setMockRecommendations,
  setWelcomeTraining,
  setWelcomeTrainingCompleted,
  buildApiUrl,
  apiFetch,
  getApiHeaders,
  getCurrentMode
} from '../../utils/apiConfig';
import { womenInterests } from '../../components/sheets/formConstants';

interface DevModeIndicatorProps {
  className?: string;
}

export function DevModeIndicator({ className = "" }: DevModeIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRapidApiDialogOpen, setIsRapidApiDialogOpen] = useState(false);
  const [rapidApiJson, setRapidApiJson] = useState('');
  const [devModeEnabled, setDevModeEnabledState] = useState(false);
  const [localModeEnabled, setLocalModeEnabledState] = useState(false);
  const [sandboxHeaderEnabled, setSandboxHeaderEnabledState] = useState(false);
  const [mockRecommendationsEnabled, setMockRecommendationsEnabledState] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Update state when localStorage changes
  useEffect(() => {
    const updateState = () => {
      setDevModeEnabledState(isDevModeEnabled());
      setLocalModeEnabledState(isLocalModeEnabled());
      setSandboxHeaderEnabledState(isSandboxHeaderEnabled());
      setMockRecommendationsEnabledState(isMockRecommendationsEnabled());
    };

    updateState();
    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node) && isRapidApiDialogOpen) {
        // Don't close if clicking outside dialog - let user explicitly close
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isRapidApiDialogOpen]);

  if (!devModeEnabled) {
    return null; // Only show if dev mode is enabled
  }

  const prodModeActive = isProdMode();

  const getModeInfo = () => {
    if (localModeEnabled) {
      return { color: 'bg-yellow-500', text: 'Dev' };
    }
    if (sandboxHeaderEnabled) {
      return { color: 'bg-green-500', text: 'Dev' };
    }
    return { color: 'bg-red-500', text: 'Prod' };
  };

  const modeInfo = getModeInfo();

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear cache? This will clear recommendations and products but keep dev mode settings.')) {
      // Preserve dev mode settings
      const devModeSettings = {
        devMode: localStorage.getItem('ss_dev_mode'),
        sandboxHeader: localStorage.getItem('ss_sandbox_header'),
        localMode: localStorage.getItem('ss_local_mode'),
        mockRecommendations: localStorage.getItem('ss_mock_recommendations'),
        apiMode: localStorage.getItem('ss_api_mode'),
      };

      // Clear all localStorage
      localStorage.clear();

      // Restore dev mode settings
      if (devModeSettings.devMode) localStorage.setItem('ss_dev_mode', devModeSettings.devMode);
      if (devModeSettings.sandboxHeader) localStorage.setItem('ss_sandbox_header', devModeSettings.sandboxHeader);
      if (devModeSettings.localMode) localStorage.setItem('ss_local_mode', devModeSettings.localMode);
      if (devModeSettings.mockRecommendations) localStorage.setItem('ss_mock_recommendations', devModeSettings.mockRecommendations);
      if (devModeSettings.apiMode) localStorage.setItem('ss_api_mode', devModeSettings.apiMode);

      setIsOpen(false);
      window.location.reload();
    }
  };

  const handleLocalSelect = () => {
    setLocalMode(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleSandboxSelect = () => {
    setSandboxHeader(true);
    setIsOpen(false);
    window.location.reload();
  };

  const handleProdSelect = () => {
    setProdMode();
    setIsOpen(false);
    window.location.reload();
  };

  const handleMockRecommendationsToggle = (enabled: boolean) => {
    setMockRecommendations(enabled);
  };

  const handleResetTraining = () => {
    // Reset training state: clear completion flag and enable training
    setWelcomeTrainingCompleted(false);
    setWelcomeTraining(true);
    setIsOpen(false);
    // Small delay to ensure localStorage is updated
    setTimeout(() => {
      // Dispatch event to notify PersonPage to reset training state
      window.dispatchEvent(new CustomEvent('reset-welcome-training'));
    }, 50);
  };

  const handleRapidApiImport = () => {
    setIsOpen(false);
    setIsRapidApiDialogOpen(true);
  };

  const handleRapidApiSubmit = () => {
    try {
      const parsed = JSON.parse(rapidApiJson);
      
      // Validate structure
      if (!parsed.data || !parsed.data.products || !Array.isArray(parsed.data.products)) {
        alert('Invalid JSON format. Expected structure: { data: { products: [...] } }');
        return;
      }

      // Transform products to match PersonPage format
      const transformedProducts = parsed.data.products.map((product: any) => {
        // Extract price - remove currency symbols
        let price = 0;
        if (product.product_price) {
          const priceStr = product.product_price.toString().replace(/[£$€,]/g, '');
          price = parseFloat(priceStr) || 0;
        }

        return {
          id: product.asin || `rapidapi-${Math.random().toString(36).substr(2, 9)}`,
          image: product.product_photo || '',
          name: product.product_title || 'Unknown Product',
          price: price,
          rating: product.product_star_rating ? parseFloat(product.product_star_rating.toString()) : undefined,
          numRatings: product.product_num_ratings || 0,
        };
      });

      // Store in localStorage
      localStorage.setItem('rapidapi_products', JSON.stringify({
        products: transformedProducts,
        timestamp: Date.now(),
      }));

      // Dispatch custom event to notify PersonPage
      window.dispatchEvent(new CustomEvent('rapidapi-products-updated'));

      setIsRapidApiDialogOpen(false);
      setRapidApiJson('');
      alert(`Successfully imported ${transformedProducts.length} products!`);
    } catch (error) {
      alert(`Error parsing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddRandomPerson = async () => {
    setIsOpen(false);
    
    // Get random interests from womenInterests (max 2)
    const shuffled = [...womenInterests].sort(() => 0.5 - Math.random());
    const selectedInterests = shuffled.slice(0, 2).map(i => i.value);
    
    const personData = {
      name: "Mum",
      relationship: "mother",
      gender: "female",
      dob: "15/03/1975",
      interests: selectedInterests,
      budget_min: 10,
      budget_max: 200,
      other: {
        clothing_size: "L",
        favourite_drink: "other"
      }
    };

    try {
      // Call /recommend API
      const requestData = {
        context: {
          name: personData.name,
          relationship: personData.relationship.charAt(0).toUpperCase() + personData.relationship.slice(1).toLowerCase(),
          gender: personData.gender.toLowerCase(),
          dob: personData.dob,
          interests: personData.interests,
          budget_min: personData.budget_min,
          budget_max: personData.budget_max,
          other: personData.other,
        },
      };

      const queryParams = new URLSearchParams();
      const mode = getCurrentMode();
      const apiUrl = buildApiUrl("/recommend", queryParams);
      const headers = getApiHeaders(mode || undefined);

      const response = await apiFetch(
        apiUrl,
        {
          method: "POST",
          headers,
          body: JSON.stringify(requestData),
        },
        "POST /recommend",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      // Create person data with recommendation ID
      const savedPersonData = {
        id: apiResponse.recommendation_id || `person-${Date.now()}`,
        name: personData.name,
        relationship: personData.relationship,
        gender: personData.gender,
        interests: personData.interests,
        minBudget: personData.budget_min,
        maxBudget: personData.budget_max,
        createdAt: Date.now(),
      };

      // Save person to localStorage
      const storedPersons = localStorage.getItem('saved_persons');
      const persons = storedPersons ? JSON.parse(storedPersons) : [];
      persons.push(savedPersonData);
      localStorage.setItem('saved_persons', JSON.stringify(persons));

      // Dispatch event to notify PersonPage
      window.dispatchEvent(new CustomEvent('person-added', { detail: savedPersonData }));

      alert(`Added "${personData.name}" with interests: ${selectedInterests.join(', ')}`);
    } catch (error) {
      console.error("Error adding random person:", error);
      alert(`Failed to add person: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        title="Dev Mode Settings"
      >
        <div className={`w-2 h-2 rounded-full ${modeInfo.color}`}></div>
        <span className="text-sm font-medium text-gray-700">{modeInfo.text}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={handleAddRandomPerson}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Add Person</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLocalSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Local</span>
              {localModeEnabled && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={handleSandboxSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Sandbox</span>
              {sandboxHeaderEnabled && <span className="text-green-600">✓</span>}
            </button>
            <button
              onClick={handleProdSelect}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Prod</span>
              {prodModeActive && <span className="text-green-600">✓</span>}
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleResetTraining}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Reset Training</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <label className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between cursor-pointer">
              <span>Mock Recommender</span>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={mockRecommendationsEnabled}
                  onChange={(e) => handleMockRecommendationsToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                    mockRecommendationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform transform shadow-sm ${
                      mockRecommendationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  ></div>
                </div>
              </div>
            </label>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleRapidApiImport}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
            >
              <span>Import RapidAPI JSON</span>
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center justify-between"
            >
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      )}

      {/* RapidAPI JSON Import Dialog */}
      {isRapidApiDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div 
            ref={dialogRef}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Import RapidAPI JSON</h3>
              <p className="text-sm text-gray-500 mt-1">Paste the JSON response from RapidAPI</p>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <textarea
                value={rapidApiJson}
                onChange={(e) => setRapidApiJson(e.target.value)}
                placeholder="Paste JSON here..."
                className="flex-1 w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ minHeight: '300px' }}
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRapidApiDialogOpen(false);
                  setRapidApiJson('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRapidApiSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

