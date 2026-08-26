import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OnboardingPage from './components/OnboardingPage';
import HeroSpotlight from './components/HeroSpotlight';
import RefineSearchPage from './components/RefineSearchPage';
import ExplorationFeed from './components/ExplorationFeed';
import ExploitationFeed from './components/ExploitationFeed';
import HowItWorks from './components/HowItWorks';
import CartDrawer from './components/CartDrawer';
import DishDetailModal from './components/DishDetailModal';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState(true); // Step 1: Onboarding Taste Picker
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'refine_search', 'how_it_works'
  const [mode, setMode] = useState('exploration'); // 'exploration', 'exploitation', 'hybrid'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activePersonaTitle, setActivePersonaTitle] = useState('');

  // Preserved hybrid seed recommendations state
  const [hybridItems, setHybridItems] = useState([]);
  const [savedHybridTitle, setSavedHybridTitle] = useState('');

  const [filters, setFilters] = useState({
    budget: 500,
    eta: 30,
    is_veg: false,
    is_high_protein: false,
    is_keto: false,
    is_gluten_free: false,
    cuisines: [],
    min_rating: 3.5,
    max_calories: 1000,
  });

  const [items, setItems] = useState([]);
  const [trendingBanner, setTrendingBanner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Detail Modal State
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (item) => {
    setCartItems((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    triggerToast(`Added "${item.name}" to cart!`);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prevCart) =>
      prevCart
        .map((ci) => {
          if (ci.id === id) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevCart) => prevCart.filter((ci) => ci.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Fetch Recommendations from FastAPI Backend
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'exploration') {
        const queryParams = new URLSearchParams({
          budget: filters.budget.toString(),
          eta: filters.eta.toString(),
          is_veg: filters.is_veg.toString(),
          is_high_protein: filters.is_high_protein.toString(),
          is_keto: filters.is_keto.toString(),
          is_gluten_free: filters.is_gluten_free.toString(),
          min_rating: filters.min_rating.toString(),
          max_calories: filters.max_calories.toString(),
        });

        if (filters.cuisines && filters.cuisines.length > 0) {
          queryParams.append('cuisines', filters.cuisines.join(','));
        }

        const res = await fetch(`http://127.0.0.1:8000/recommend/explore?${queryParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        setItems(data.items || []);
        setTrendingBanner(data.time_of_day_banner || '');
      } else if (mode === 'exploitation' && selectedCategory) {
        const bodyData = {
          category: selectedCategory,
          budget: filters.budget,
          eta: filters.eta,
          is_veg: filters.is_veg,
          is_high_protein: filters.is_high_protein,
          is_keto: filters.is_keto,
          is_gluten_free: filters.is_gluten_free,
        };

        const res = await fetch('http://127.0.0.1:8000/recommend/exploit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyData),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Unable to load food recommendations. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations on initial mount and whenever filters/mode change
  useEffect(() => {
    if (mode !== 'hybrid') {
      fetchRecommendations();
    }
  }, [filters, mode, selectedCategory]);

  // Handle Onboarding Hybrid Seed Recommendations (Step 1 -> Step 2 transition)
  const handleOnboardingGenerate = async ({ persona, selectedSeedIds }) => {
    setLoading(true);
    setError(null);

    try {
      const bodyData = {
        seed_ids: selectedSeedIds || [],
        persona: persona ? persona.title : null,
        budget: filters.budget,
        eta: filters.eta,
        is_veg: filters.is_veg,
        is_high_protein: filters.is_high_protein,
        is_keto: filters.is_keto,
        is_gluten_free: filters.is_gluten_free,
      };

      const res = await fetch('http://127.0.0.1:8000/recommend/hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const returnedItems = data.items || [];
      const count = selectedSeedIds ? selectedSeedIds.length : 5;
      const title = `YOUR ${count} PICKS`;

      // Save hybrid state so returning from category drilldown restores 5-pick recommendations!
      setHybridItems(returnedItems);
      setSavedHybridTitle(title);
      setItems(returnedItems);
      setActivePersonaTitle(title);
      setMode('hybrid');
      setIsOnboarding(false);
    } catch (err) {
      console.error('Failed to generate hybrid recommendations:', err);
      setError('Unable to analyze recommendations from selected seed dishes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setActivePersonaTitle(categoryName);
    setMode('exploitation');
    setActiveTab('browse');
    setIsOnboarding(false);
  };

  // Handle returning from category drilldown to main browse feed
  const handleBackToExploration = () => {
    setSelectedCategory(null);
    if (hybridItems.length > 0) {
      // Restore user's 5-pick hybrid seed recommendations!
      setItems(hybridItems);
      setActivePersonaTitle(savedHybridTitle || 'YOUR 5 PICKS');
      setMode('hybrid');
    } else {
      setActivePersonaTitle('');
      setMode('exploration');
    }
  };

  // Reset to exploration mode whenever returning to onboarding via "Edit my taste"
  const handleEditTaste = () => {
    setSelectedCategory(null);
    setActivePersonaTitle('');
    setHybridItems([]);
    setSavedHybridTitle('');
    setMode('exploration');
    setIsOnboarding(true);
    fetchRecommendations();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (mode === 'hybrid') {
      setMode('exploration');
      setActivePersonaTitle('');
    }
  };

  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  // Step 1: Onboarding Taste Picker View (No top Navbar on landing page)
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#0D0F12] text-gray-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        <OnboardingPage
          seedItems={items}
          onGenerateRecommendations={handleOnboardingGenerate}
        />
      </div>
    );
  }

  // Step 2: Recommendations Results Page
  return (
    <div className="min-h-screen bg-[#0D0F12] text-gray-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'browse') {
            handleBackToExploration();
          }
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* Tab 1: Dedicated Refine Search Page */}
        {activeTab === 'refine_search' && (
          <RefineSearchPage
            filters={filters}
            onFilterChange={handleFilterChange}
            items={items}
            loading={loading}
            onAddToCart={handleAddToCart}
            onExploreCategory={handleSelectCategory}
            onOpenDishDetail={setSelectedDishDetail}
          />
        )}

        {/* Tab 2: How It Works View */}
        {activeTab === 'how_it_works' && <HowItWorks />}

        {/* Tab 3: Browse View */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            
            {/* Top Hero Spotlight (#1 Best Food Picked + Description + Edit My Taste button) */}
            {items.length > 0 && !loading && (
              <HeroSpotlight
                item={items[0]}
                onAddToCart={handleAddToCart}
                filters={filters}
                onEditTaste={handleEditTaste}
                personaTitle={activePersonaTitle}
              />
            )}

            {/* Full-Width Food Feed Grid */}
            <div className="w-full">
              {error ? (
                <div className="p-8 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-center space-y-4">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <p className="font-bold text-sm">{error}</p>
                  <button
                    onClick={fetchRecommendations}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Connection</span>
                  </button>
                </div>
              ) : mode === 'exploitation' ? (
                <ExploitationFeed
                  category={selectedCategory}
                  items={items.slice(1)}
                  loading={loading}
                  onBack={handleBackToExploration}
                  onAddToCart={handleAddToCart}
                />
              ) : (
                <ExplorationFeed
                  trendingBanner={trendingBanner}
                  items={items.slice(1)}
                  loading={loading}
                  onSelectCategory={handleSelectCategory}
                  onAddToCart={handleAddToCart}
                  onOpenDishDetail={(dish) => setSelectedDishDetail(dish)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Recommendation Detail Modal */}
      <DishDetailModal
        item={selectedDishDetail}
        onClose={() => setSelectedDishDetail(null)}
        onAddToCart={handleAddToCart}
        onSelectDish={(sItem) => setSelectedDishDetail(sItem)}
        allItems={items}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
