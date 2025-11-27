import React, { useState, useRef, useEffect } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Heading } from "../components/ui/Heading";
import { ProductCard } from "../components/ui/ProductCard";
import { TextInput } from "../components/ui/TextInput";
import { Dropdown } from "../components/ui/Dropdown";
import { RangeSlider } from "../components/ui/RangeSlider";
import { Button } from "../components/ui/Button";
import { TabMenu } from "../components/ui/TabMenu";
import { MultiSelectList } from "../components/ui/MultiSelectList";
import { buttonThemes, ButtonTheme } from "../config/buttonTheme";

export const UIKitPage: React.FC = () => {
    // State for interactive components
    const [textValue, setTextValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [dropdownValue, setDropdownValue] = useState("");
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [activeTab, setActiveTab] = useState("ai-picks");
    const [horizontalCarouselIsAiPick, setHorizontalCarouselIsAiPick] = useState(true);
    const [verticalCarouselIsAiPick, setVerticalCarouselIsAiPick] = useState(false);
    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
    const productSheetRef = useRef<SheetRef>(null);
    const [selectedButtonTheme, setSelectedButtonTheme] = useState<ButtonTheme | null>(null);
    
    // Manage body overflow when sheet is open
    useEffect(() => {
        if (isProductSheetOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.body.classList.add("sheet-open");
            return () => {
                document.body.style.overflow = prev;
                document.body.classList.remove("sheet-open");
            };
        }
    }, [isProductSheetOpen]);
    
    // Typography state
    const [selectedFont, setSelectedFont] = useState<"StackSansText" | "StackSansHeadline" | "StackSansNotch">("StackSansText");
    const [selectedWeight, setSelectedWeight] = useState<"200" | "300" | "400" | "500" | "600" | "700">("400");

    const dropdownOptions = [
        { value: "option1", label: "Electronics" },
        { value: "option2", label: "Fashion" },
        { value: "option3", label: "Home & Garden" },
        { value: "option4", label: "Sports & Outdoors" },
        { value: "option5", label: "Books & Media" },
    ];

    const tabs = [
        { id: "ai-picks", label: "AI Picks" },
        { id: "tech", label: "Tech" },
        { id: "golf", label: "Golf" },
    ];

    // Hardcoded products for carousel and tabs - using images from public/img/products
    const carouselProducts = [
        {
            id: "1",
            image: "/img/products/fitbit.png",
            name: "Fitbit Fitness Tracker",
            price: 199.99,
            rating: 4.5,
            numRatings: 1234,
        },
        {
            id: "2",
            image: "/img/products/ninaj2.png",
            name: "Ninja Air Fryer Pro",
            price: 149.99,
            rating: 4.7,
            numRatings: 856,
        },
        {
            id: "3",
            image: "/img/products/ninja.png",
            name: "Ninja Blender System",
            price: 179.99,
            rating: 4.6,
            numRatings: 642,
        },
        {
            id: "4",
            image: "/img/products/pop.png",
            name: "Pop Culture Collectible",
            price: 29.99,
            rating: 4.3,
            numRatings: 423,
        },
        {
            id: "5",
            image: "/img/products/sony.png",
            name: "Sony Wireless Headphones",
            price: 249.99,
            rating: 4.8,
            numRatings: 1523,
        },
        {
            id: "6",
            image: "/img/products/controller.png",
            name: "Gaming Controller Pro",
            price: 79.99,
            rating: 4.4,
            numRatings: 987,
        },
    ];

    const productsByTab: Record<
        string,
        Array<{ image: string; name: string; price: number }>
    > = {
        "ai-picks": [
            {
                image: "/img/products/fitbit.png",
                name: "Top-Rated Wireless Headphones",
                price: 189.99,
            },
            {
                image: "/img/products/ninaj2.png",
                name: "Smart Home Starter Kit",
                price: 139.99,
            },
            {
                image: "/img/products/ninja.png",
                name: "Cosy Deluxe Candle",
                price: 18.99,
            },
        ],
        tech: [
            {
                image: "/img/products/sony.png",
                name: "Wireless Headphones Pro Max",
                price: 199.99,
            },
            {
                image: "/img/products/controller.png",
                name: "Smart Home Hub",
                price: 129.99,
            },
            {
                image: "/img/products/fitbit.png",
                name: "Portable Bluetooth Speaker",
                price: 59.99,
            },
        ],
        golf: [
            {
                image: "/img/products/pop.png",
                name: "Premium Golf Balls (12 pack)",
                price: 34.99,
            },
            {
                image: "/img/products/ninaj2.png",
                name: "Golf Swing Trainer Aid",
                price: 44.99,
            },
            {
                image: "/img/products/ninja.png",
                name: "Golf Glove Leather",
                price: 19.99,
            },
        ],
    };

    // Multi-select options for interests
    const interestOptions = [
        { value: "tech", label: "Tech", emoji: "📱" },
        { value: "golf", label: "Golf", emoji: "⛳" },
        { value: "outdoors", label: "Outdoors", emoji: "🏕️" },
        { value: "home", label: "Home", emoji: "🏡" },
        { value: "books", label: "Books", emoji: "📚" },
        { value: "fashion", label: "Fashion", emoji: "👗" },
        { value: "beauty", label: "Beauty", emoji: "💄" },
        { value: "toys", label: "Toys", emoji: "🧸" },
    ];

    // Hardcoded products for the product sheet vertical carousel
    const sheetProducts = [
        {
            id: "sheet-1",
            image: "/img/products/fitbit.png",
            name: "Fitbit Fitness Tracker Pro",
            price: 199.99,
            rating: 4.5,
            numRatings: 1234,
        },
        {
            id: "sheet-2",
            image: "/img/products/ninaj2.png",
            name: "Ninja Air Fryer Deluxe",
            price: 149.99,
            rating: 4.7,
            numRatings: 856,
        },
        {
            id: "sheet-3",
            image: "/img/products/sony.png",
            name: "Sony Wireless Headphones",
            price: 249.99,
            rating: 4.8,
            numRatings: 1523,
        },
        {
            id: "sheet-4",
            image: "/img/products/controller.png",
            name: "Gaming Controller Elite",
            price: 79.99,
            rating: 4.4,
            numRatings: 987,
        },
        {
            id: "sheet-5",
            image: "/img/products/pop.png",
            name: "Pop Culture Collectible Set",
            price: 29.99,
            rating: 4.3,
            numRatings: 423,
        },
    ];

    // toggleLabel is now handled by MultiSelectList component

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <Heading level={1} className="mb-4">
                        UI Kit Showcase
                    </Heading>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-4">
                        A comprehensive collection of reusable components built
                        with modern design principles
                    </p>
                    <Button
                        onClick={() => setIsProductSheetOpen(true)}
                        variant="primary"
                        className="!font-normal"
                    >
                        Person Sheet
                    </Button>
                </div>

                {/* Product Carousel Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Heading level={3}>
                            Product Carousel (Horizontal)
                        </Heading>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={horizontalCarouselIsAiPick}
                                onChange={(e) => setHorizontalCarouselIsAiPick(e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                AI Pick Styling
                            </span>
                        </label>
                    </div>
                    <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-3 pb-12">
                        <div className="flex gap-4 transition-all duration-700 ease-out">
                            {carouselProducts.map((p, index) => (
                                <div
                                    key={p.id}
                                    className="flex-shrink-0 w-[300px] transition-all duration-700 ease-out"
                                    style={{
                                        animation: `fadeInSlide 0.6s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    <ProductCard
                                        id={p.id}
                                        image={p.image}
                                        name={p.name}
                                        price={p.price}
                                        rating={p.rating}
                                        numRatings={p.numRatings}
                                        compact
                                        isAiPick={horizontalCarouselIsAiPick}
                                        className={!horizontalCarouselIsAiPick ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 bg-white" : ""}
                                        customWidth="300px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vertical Carousel Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Heading level={3}>
                            Product Carousel (Vertical)
                        </Heading>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={verticalCarouselIsAiPick}
                                onChange={(e) => setVerticalCarouselIsAiPick(e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                AI Pick Styling
                            </span>
                        </label>
                    </div>
                    <div className="overflow-y-auto no-scrollbar max-h-[600px] pr-2 pt-2">
                        <div className="flex flex-col gap-6">
                            {carouselProducts.map((p, index) => (
                                <div
                                    key={p.id}
                                    className="flex-shrink-0 transition-all duration-300 ease-out"
                                    style={{
                                        animation: `fadeInSlide 0.6s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    <ProductCard
                                        id={p.id}
                                        image={p.image}
                                        name={p.name}
                                        price={p.price}
                                        rating={p.rating}
                                        numRatings={p.numRatings}
                                        compact
                                        isAiPick={verticalCarouselIsAiPick}
                                        className={!verticalCarouselIsAiPick ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 bg-white" : ""}
                                        customWidth="300px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Menu Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={3} className="mb-6">
                        Tab Menu
                    </Heading>
                    <TabMenu
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    <div className="mt-8">
                        {activeTab === "ai-picks" && (
                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                        AI Picks Content
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        This tab showcases AI-powered recommendations. The system analyzes user preferences, 
                                        browsing history, and product ratings to suggest the most relevant items.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-purple-600">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 2l2.39 5.26L20 8.27l-4 3.89L17.18 18 12 15.45 6.82 18 8 12.16 4 8.27l5.61-1.01L12 2z" />
                                        </svg>
                                        <span className="font-medium">AI-powered recommendations</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        Features
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>Personalized product suggestions based on user behavior</li>
                                        <li>Machine learning algorithms for better accuracy</li>
                                        <li>Real-time updates as preferences change</li>
                                        <li>Integration with product ratings and reviews</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeTab === "tech" && (
                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                        Tech Products
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Explore the latest in technology - from cutting-edge gadgets to smart home devices. 
                                        Find everything you need to stay connected and productive.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                        <span className="text-2xl">📱</span>
                                        <span className="font-medium">Latest tech innovations</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        Categories
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>Smartphones and accessories</li>
                                        <li>Laptops and computers</li>
                                        <li>Smart home devices</li>
                                        <li>Wearable technology</li>
                                        <li>Audio equipment</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {activeTab === "golf" && (
                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                        Golf Equipment
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Everything you need for the perfect round. From clubs to accessories, 
                                        find premium golf equipment for players of all skill levels.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <span className="text-2xl">⛳</span>
                                        <span className="font-medium">Professional golf gear</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                        Product Range
                                    </h4>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                                        <li>Golf clubs and sets</li>
                                        <li>Golf balls and accessories</li>
                                        <li>Golf apparel and footwear</li>
                                        <li>Training aids and equipment</li>
                                        <li>Golf bags and carts</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Headings Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Headings
                    </Heading>
                    <div className="space-y-4">
                        <Heading level={1}>Heading Level 1</Heading>
                        <Heading level={2}>Heading Level 2</Heading>
                        <Heading level={3}>Heading Level 3</Heading>
                        <Heading level={4}>Heading Level 4</Heading>
                        <Heading level={5}>Heading Level 5</Heading>
                        <Heading level={6}>Heading Level 6</Heading>
                    </div>
                </div>

                {/* Form Inputs Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Form Inputs
                    </Heading>

                    <div className="space-y-6">
                        {/* Text Inputs */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Text Inputs
                            </Heading>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextInput
                                    label="Name"
                                    placeholder="Enter your name"
                                    value={textValue}
                                    onChange={setTextValue}
                                />
                                <TextInput
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={emailValue}
                                    onChange={setEmailValue}
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Text Input with Error */}
                        <div>
                            <TextInput
                                label="With Error State"
                                placeholder="This field has an error"
                                value=""
                                onChange={() => {
                                    /* Demo only */
                                }}
                                error="This field is required"
                            />
                        </div>

                        {/* Disabled Text Input */}
                        <div>
                            <TextInput
                                label="Disabled Input"
                                placeholder="This input is disabled"
                                value="Disabled content"
                                onChange={() => {
                                    /* Demo only */
                                }}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Dropdown Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Dropdowns
                    </Heading>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Dropdown
                                label="Category"
                                placeholder="Select a category"
                                value={dropdownValue}
                                options={dropdownOptions}
                                onChange={setDropdownValue}
                            />
                            <Dropdown
                                label="Disabled Dropdown"
                                placeholder="This dropdown is disabled"
                                value=""
                                options={dropdownOptions}
                                onChange={() => {
                                    /* Demo only */
                                }}
                                disabled
                            />
                        </div>

                        <Dropdown
                            label="With Error State"
                            placeholder="Select an option"
                            value=""
                            options={dropdownOptions}
                            onChange={() => {
                                /* Demo only */
                            }}
                            error="Please select a valid option"
                        />
                    </div>
                </div>

                {/* Multi Select Buttons (below dropdowns) */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Heading level={2}>Multi Select Buttons</Heading>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setSelectedLabels([])}
                            disabled={selectedLabels.length === 0}
                            className="text-[#5E57AC] !font-normal"
                        >
                            Deselect all
                        </Button>
                    </div>
                    <div className="flex flex-col gap-6">
                        <MultiSelectList
                            options={interestOptions}
                            selectedValues={selectedLabels}
                            onChange={setSelectedLabels}
                        />
                    </div>
                </div>

                {/* Range Slider Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Budget Range Slider
                    </Heading>
                    <RangeSlider
                        min={10}
                        max={500}
                        minValue={minBudget}
                        maxValue={maxBudget}
                        onChange={(min, max) => {
                            setMinBudget(min);
                            setMaxBudget(max);
                        }}
                        label="Select your budget range (£5 steps)"
                    />
                </div>

                {/* Buttons Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Buttons
                    </Heading>

                    <div className="space-y-8">
                        {/* Animated Gradient Buttons - Theme Selectors */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Animated Gradient Buttons (Click to Apply Theme)
                            </Heading>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {buttonThemes.map((theme) => (
                                    <AnimatedGradientButton
                                        key={theme.id}
                                        theme={theme}
                                        isSelected={selectedButtonTheme?.id === theme.id}
                                        onClick={() => setSelectedButtonTheme(theme)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Button Variants */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button Variants
                            </Heading>
                            <div className="flex flex-wrap gap-4">
                                <ThemedButton variant="primary" className="!font-normal" theme={selectedButtonTheme}>
                                    Primary Button
                                </ThemedButton>
                                <ThemedButton variant="secondary" className="!font-normal" theme={selectedButtonTheme}>
                                    Secondary Button
                                </ThemedButton>
                                <ThemedButton variant="outline" className="!font-normal" theme={selectedButtonTheme}>
                                    Outline Button
                                </ThemedButton>
                                <ThemedButton variant="ghost" className="!font-normal" theme={selectedButtonTheme}>Ghost Button</ThemedButton>
                            </div>
                        </div>

                        {/* Button Sizes */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button Sizes
                            </Heading>
                            <div className="flex flex-wrap items-center gap-4">
                                <ThemedButton size="small" className="!font-normal" theme={selectedButtonTheme}>Small</ThemedButton>
                                <ThemedButton size="medium" className="!font-normal" theme={selectedButtonTheme}>Medium</ThemedButton>
                                <ThemedButton size="large" className="!font-normal" theme={selectedButtonTheme}>Large</ThemedButton>
                            </div>
                        </div>

                        {/* Button States */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button States
                            </Heading>
                            <div className="flex flex-wrap gap-4">
                                <ThemedButton className="!font-normal" theme={selectedButtonTheme}>Normal</ThemedButton>
                                <ThemedButton disabled className="!font-normal" theme={selectedButtonTheme}>Disabled</ThemedButton>
                            </div>
                        </div>

                        {/* Full Width Button */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Full Width Button
                            </Heading>
                            <ThemedButton fullWidth className="!font-normal" theme={selectedButtonTheme}>Full Width Button</ThemedButton>
                        </div>

                    </div>
                </div>

                {/* Color Palette Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Color Palette
                    </Heading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-full h-32 bg-[#5E57AC] rounded-2xl shadow-md mb-3"></div>
                            <p className="font-semibold text-gray-800">
                                Primary
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
                                #5E57AC
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-full h-32 bg-gray-800 rounded-2xl shadow-md mb-3"></div>
                            <p className="font-semibold text-gray-800">Dark</p>
                            <p className="text-sm text-gray-500 font-medium">
                                #1F2937
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-full h-32 bg-gray-200 rounded-2xl shadow-md mb-3"></div>
                            <p className="font-semibold text-gray-800">Light</p>
                            <p className="text-sm text-gray-500 font-medium">
                                #E5E7EB
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-full h-32 bg-white border-2 border-gray-200 rounded-2xl shadow-md mb-3"></div>
                            <p className="font-semibold text-gray-800">White</p>
                            <p className="text-sm text-gray-500 font-medium">
                                #FFFFFF
                            </p>
                        </div>
                    </div>
                </div>

                {/* Typography Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <Heading level={2} className="mb-6">
                        Typography
                    </Heading>
                    
                    {/* Font and Weight Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Font Family
                            </label>
                            <Dropdown
                                placeholder="Select font"
                                value={selectedFont}
                                options={[
                                    { value: "StackSansText", label: "StackSansText" },
                                    { value: "StackSansHeadline", label: "StackSansHeadline" },
                                    { value: "StackSansNotch", label: "StackSansNotch (Logo only)" },
                                ]}
                                onChange={(value) => setSelectedFont(value as typeof selectedFont)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Font Weight
                            </label>
                            <Dropdown
                                placeholder="Select weight"
                                value={selectedWeight}
                                options={[
                                    { value: "200", label: "ExtraLight (200)" },
                                    { value: "300", label: "Light (300)" },
                                    { value: "400", label: "Regular (400)" },
                                    { value: "500", label: "Medium (500)" },
                                    { value: "600", label: "SemiBold (600)" },
                                    { value: "700", label: "Bold (700)" },
                                ]}
                                onChange={(value) => setSelectedWeight(value as typeof selectedWeight)}
                            />
                        </div>
                    </div>

                    {/* Typography Preview */}
                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                            <p className="text-sm text-gray-500 mb-4 font-medium">
                                Preview: {selectedFont} - Weight {selectedWeight}
                            </p>
                            <div 
                                style={{ 
                                    fontFamily: selectedFont,
                                    fontWeight: parseInt(selectedWeight),
                                }}
                                className="text-4xl text-gray-900"
                            >
                                The quick brown fox jumps over the lazy dog
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                StackSansText (Body Text)
                            </p>
                            <p className="text-lg text-gray-700" style={{ fontFamily: 'StackSansText', fontWeight: 400 }}>
                                The quick brown fox jumps over the lazy dog.
                                This is a sample paragraph text using StackSansText
                                with regular weight for optimal readability.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                StackSansHeadline (Headings)
                            </p>
                            <Heading level={2} style={{ fontFamily: 'StackSansHeadline', fontWeight: 500 }}>
                                The quick brown fox jumps over the lazy dog
                            </Heading>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                StackSansNotch (Logo Only)
                            </p>
                            <div className="font-notch font-bold text-3xl bg-gradient-to-r from-purple-600 via-simplysent-purple to-pink-500 bg-clip-text text-transparent">
                                SimplySent
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                Buttons (StackSansText)
                            </p>
                            <Button className="!font-normal">Button Text Example</Button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 font-medium">
                        All components are mobile-friendly and follow modern
                        design principles
                    </p>
                </div>
            </div>

            {/* Product Sheet */}
            <>
                <Sheet
                    ref={productSheetRef}
                    isOpen={isProductSheetOpen}
                    onClose={() => setIsProductSheetOpen(false)}
                    snapPoints={[0, 1]}
                    initialSnap={1}
                    disableDrag={true}
                >
                    <Sheet.Container
                        style={{
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                            background: "#ffffff",
                        }}
                    >
                        <Sheet.Header>
                            <div
                                className="flex items-center justify-center px-6"
                                style={{
                                    minHeight: "64px",
                                    paddingTop: "calc(env(safe-area-inset-top) + 16px)",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        left: 0,
                                        right: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Sheet.DragIndicator
                                        style={{ display: "none" }}
                                    />
                                </div>
                                <h2 className="m-0 text-xl font-headline font-medium text-gray-800 select-none">
                                    Products
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setIsProductSheetOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors absolute right-6"
                                    aria-label="Close"
                                >
                                    <X size={24} className="text-gray-600" />
                                </button>
                            </div>
                        </Sheet.Header>
                        <Sheet.Content
                            style={{
                                padding: "24px",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                overflow: "hidden",
                            }}
                        >
                            {/* Vertical Carousel */}
                            <div 
                                className="flex-1 w-full pt-2"
                                style={{
                                    overflow: "hidden",
                                    position: "relative",
                                    marginRight: "-20px",
                                    paddingRight: "20px",
                                }}
                            >
                                <div 
                                    className="h-full overflow-y-scroll w-full sheet-scroll-hide"
                                    style={{
                                        WebkitOverflowScrolling: "touch",
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        paddingRight: "50px",
                                        marginRight: "-50px",
                                        width: "calc(100% + 50px)",
                                    }}
                                >
                                    <style>{`
                                        .sheet-scroll-hide::-webkit-scrollbar,
                                        [class*="overflow-y-scroll"]::-webkit-scrollbar {
                                            display: block !important;
                                            width: 20px !important;
                                            height: 20px !important;
                                            -webkit-appearance: none !important;
                                            background: red !important;
                                        }
                                        .sheet-scroll-hide::-webkit-scrollbar-track,
                                        [class*="overflow-y-scroll"]::-webkit-scrollbar-track {
                                            background: red !important;
                                        }
                                        .sheet-scroll-hide::-webkit-scrollbar-thumb,
                                        [class*="overflow-y-scroll"]::-webkit-scrollbar-thumb {
                                            background: darkred !important;
                                            border-radius: 10px !important;
                                        }
                                        .sheet-scroll-container::-webkit-scrollbar {
                                            display: block !important;
                                            width: 20px !important;
                                            background: red !important;
                                        }
                                        .sheet-scroll-container::-webkit-scrollbar-track {
                                            background: red !important;
                                        }
                                        .sheet-scroll-container::-webkit-scrollbar-thumb {
                                            background: darkred !important;
                                        }
                                    `}</style>
                                    <div className="flex flex-col gap-6 w-full items-center px-0 sheet-scroll-container" style={{ paddingRight: "50px" }}>
                                        {sheetProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex-shrink-0 flex justify-center w-full"
                                                style={{
                                                    contain: "layout style",
                                                    isolation: "isolate",
                                                }}
                                            >
                                                <div 
                                                    style={{ 
                                                        width: "100%", 
                                                        maxWidth: "300px",
                                                        contain: "layout style",
                                                    }}
                                                >
                                                    <ProductCard
                                                        id={p.id}
                                                        image={p.image}
                                                        name={p.name}
                                                        price={p.price}
                                                        rating={p.rating}
                                                        numRatings={p.numRatings}
                                                        compact
                                                        simpleThumbsButtons={true}
                                                        customWidth="300px"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop onTap={() => setIsProductSheetOpen(false)} />
                </Sheet>
            </>
        </div>
    );
};

// Animated Gradient Button Component - Theme Selector
interface AnimatedGradientButtonProps {
    theme: ButtonTheme;
    isSelected?: boolean;
    onClick?: () => void;
}

const AnimatedGradientButton: React.FC<AnimatedGradientButtonProps> = ({ theme, isSelected = false, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // Create gradient string from colors
    const gradientString = theme.colors.join(", ");
    
    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className="relative px-6 py-3 rounded-full font-medium text-white overflow-hidden transition-all duration-200 cursor-pointer"
            style={{
                boxShadow: isPressed 
                    ? "inset 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(94, 87, 172, 0.2)"
                    : "0 4px 15px rgba(94, 87, 172, 0.3)",
                transform: isPressed ? "translateY(1px)" : "translateY(0)",
                filter: isPressed ? "brightness(0.85)" : "brightness(1)",
            }}
        >
            {/* Slow gradient animation background */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                    background: [
                        `linear-gradient(135deg, ${gradientString})`,
                        `linear-gradient(225deg, ${gradientString})`,
                        `linear-gradient(315deg, ${gradientString})`,
                        `linear-gradient(45deg, ${gradientString})`,
                        `linear-gradient(135deg, ${gradientString})`,
                    ],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: "200% 200%",
                }}
            />
            
            {/* Fast flash/shimmer on hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                    }}
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                        transform: "skewX(-20deg)",
                    }}
                />
            )}
            
            {/* Button text */}
            <span className="relative z-10">{theme.label}</span>
            {/* Selected indicator */}
            {isSelected && (
                <span className="absolute top-1 right-1 z-20 text-white text-xs bg-white/30 rounded-full px-2 py-0.5">
                    ✓
                </span>
            )}
        </motion.button>
    );
};

// ThemedButton Component - Wraps Button with theme styling
interface ThemedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "cta";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    theme: ButtonTheme | null;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper function to get primary color from theme (first color)
const getPrimaryColor = (theme: ButtonTheme): string => {
    return theme.colors[0];
};

const ThemedButton: React.FC<ThemedButtonProps> = ({ 
    children, 
    theme,
    onClick,
    variant = "primary",
    size = "medium",
    disabled = false,
    fullWidth = false,
    className = "",
    type = "button",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // If no theme selected, render normal Button
    if (!theme) {
        return (
            <Button
                onClick={onClick}
                variant={variant}
                size={size}
                disabled={disabled}
                fullWidth={fullWidth}
                className={className}
                type={type}
            >
                {children}
            </Button>
        );
    }
    
    // Create gradient string from colors
    const gradientString = theme.colors.join(", ");
    const primaryColor = getPrimaryColor(theme);
    
    // Get size classes to match Button component
    const sizeClasses = {
        small: "px-5 py-2 text-sm",
        medium: "px-7 py-3.5 text-base",
        large: "px-9 py-4 text-lg",
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    // Variant-specific styling
    let textColorStyle: React.CSSProperties = { color: "white" };
    let borderStyle: React.CSSProperties = {};
    
    if (variant === "secondary") {
        // Secondary: Light background with theme colors at reduced opacity
        textColorStyle = { color: primaryColor };
    } else if (variant === "outline") {
        // Outline: Transparent background with theme color border
        borderStyle = {
            border: `2px solid ${primaryColor}`,
            background: "transparent",
        };
        textColorStyle = { color: primaryColor };
    } else if (variant === "ghost") {
        // Ghost: Transparent background, theme color text
        borderStyle = {
            background: "transparent",
        };
        textColorStyle = { color: primaryColor };
    }
    
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`font-medium rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation relative overflow-hidden ${sizeClasses[size]} ${widthClass} ${className}`}
            style={{
                ...borderStyle,
                ...textColorStyle,
                boxShadow: isPressed 
                    ? variant === "outline" || variant === "ghost"
                        ? "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                        : variant === "secondary"
                        ? `inset 0 4px 12px ${hexToRgba(primaryColor, 0.4)}, inset 0 2px 4px ${hexToRgba(primaryColor, 0.5)}, 0 2px 8px ${hexToRgba(primaryColor, 0.4)}`
                        : "inset 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(94, 87, 172, 0.2)"
                    : variant === "outline" || variant === "ghost"
                    ? "none"
                    : variant === "secondary"
                    ? `0 2px 8px ${hexToRgba(primaryColor, 0.2)}`
                    : "0 4px 15px rgba(94, 87, 172, 0.3)",
                transform: isPressed ? "translateY(1px)" : "translateY(0)",
                filter: isPressed ? (variant === "secondary" ? "brightness(0.95)" : "brightness(0.85)") : "brightness(1)",
            }}
        >
            {/* Animated gradient background - only for primary variant */}
            {variant === "primary" && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={{
                        background: [
                            `linear-gradient(135deg, ${gradientString})`,
                            `linear-gradient(225deg, ${gradientString})`,
                            `linear-gradient(315deg, ${gradientString})`,
                            `linear-gradient(45deg, ${gradientString})`,
                            `linear-gradient(135deg, ${gradientString})`,
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        backgroundSize: "200% 200%",
                        zIndex: 0,
                    }}
                />
            )}
            
            {/* Animated background for secondary */}
            {variant === "secondary" && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={{
                        background: isPressed
                            ? [
                                `linear-gradient(135deg, ${theme.colors.map(c => hexToRgba(c, 0.5)).join(", ")})`,
                                `linear-gradient(225deg, ${theme.colors.map(c => hexToRgba(c, 0.5)).join(", ")})`,
                                `linear-gradient(315deg, ${theme.colors.map(c => hexToRgba(c, 0.5)).join(", ")})`,
                                `linear-gradient(45deg, ${theme.colors.map(c => hexToRgba(c, 0.5)).join(", ")})`,
                                `linear-gradient(135deg, ${theme.colors.map(c => hexToRgba(c, 0.5)).join(", ")})`,
                            ]
                            : [
                                `linear-gradient(135deg, ${theme.colors.map(c => hexToRgba(c, 0.3)).join(", ")})`,
                                `linear-gradient(225deg, ${theme.colors.map(c => hexToRgba(c, 0.3)).join(", ")})`,
                                `linear-gradient(315deg, ${theme.colors.map(c => hexToRgba(c, 0.3)).join(", ")})`,
                                `linear-gradient(45deg, ${theme.colors.map(c => hexToRgba(c, 0.3)).join(", ")})`,
                                `linear-gradient(135deg, ${theme.colors.map(c => hexToRgba(c, 0.3)).join(", ")})`,
                            ],
                    }}
                    transition={{
                        duration: isPressed ? 6 : 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        backgroundSize: "200% 200%",
                        zIndex: 0,
                    }}
                />
            )}
            
            {/* Hover background for outline */}
            {variant === "outline" && isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background: `linear-gradient(135deg, ${gradientString})`,
                        zIndex: 0,
                    }}
                />
            )}
            
            {/* Hover background for ghost */}
            {variant === "ghost" && isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background: hexToRgba(primaryColor, 0.2),
                        zIndex: 0,
                    }}
                />
            )}
            
            {/* Fast flash/shimmer on hover - only for primary and secondary */}
            {(variant === "primary" || variant === "secondary") && isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                    }}
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                        transform: "skewX(-20deg)",
                        zIndex: 1,
                    }}
                />
            )}
            
            {/* Button text */}
            <span className="relative z-10" style={variant === "outline" && isHovered ? { color: "white" } : textColorStyle}>
                {children}
            </span>
        </motion.button>
    );
};
