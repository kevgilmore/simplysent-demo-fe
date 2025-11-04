import React, { useState } from "react";
import { Heading } from "./ui/Heading";
import { ProductCard } from "./ui/ProductCard";
import { TextInput } from "./ui/TextInput";
import { Dropdown } from "./ui/Dropdown";
import { RangeSlider } from "./ui/RangeSlider";
import { Button } from "./ui/Button";
import { TabMenu } from "./ui/TabMenu";

export const ComponentsPage: React.FC = () => {
    // State for interactive components
    const [textValue, setTextValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [dropdownValue, setDropdownValue] = useState("");
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [activeTab, setActiveTab] = useState("ai-picks");

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

    const productsByTab: Record<string, Array<{ image: string; name: string; price: number }>> = {
        "ai-picks": [
            {
                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
                name: "Top-Rated Wireless Headphones",
                price: 189.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
                name: "Smart Home Starter Kit",
                price: 139.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
                name: "Cosy Deluxe Candle",
                price: 18.99,
            },
        ],
        tech: [
            {
                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
                name: "Wireless Headphones Pro Max",
                price: 199.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
                name: "Smart Home Hub",
                price: 129.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
                name: "Portable Bluetooth Speaker",
                price: 59.99,
            },
        ],
        golf: [
            {
                image:
                    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop",
                name: "Premium Golf Balls (12 pack)",
                price: 34.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1535139262971-d2d102b0fb12?q=80&w=800&auto=format&fit=crop",
                name: "Golf Swing Trainer Aid",
                price: 44.99,
            },
            {
                image:
                    "https://images.unsplash.com/photo-1521417531060-7c277f2cc6a3?q=80&w=800&auto=format&fit=crop",
                name: "Golf Glove Leather",
                price: 19.99,
            },
        ],
    };

    const toggleLabel = (label: string) => {
        setSelectedLabels(prev => (
            prev.includes(label)
                ? prev.filter(l => l !== label)
                : [...prev, label]
        ));
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <Heading level={1} className="mb-4">
                        UI Kit Showcase
                    </Heading>
                    <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                        A comprehensive collection of reusable components built
                        with modern design principles
                    </p>
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
                        {activeTab === "ai-picks" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productsByTab[activeTab]?.map((p, idx) => (
                                    <ProductCard
                                        key={`${activeTab}-${idx}`}
                                        image={p.image}
                                        name={p.name}
                                        price={p.price}
                                        className="border-2 border-purple-300 ring-1 ring-purple-200/60 hover:ring-purple-300/70 transition-shadow"
                                        badge={
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l2.39 5.26L20 8.27l-4 3.89L17.18 18 12 15.45 6.82 18 8 12.16 4 8.27l5.61-1.01L12 2z" />
                                                </svg>
                                                AI pick
                                            </span>
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productsByTab[activeTab]?.map((p, idx) => (
                                    <ProductCard
                                        key={`${activeTab}-${idx}`}
                                        image={p.image}
                                        name={p.name}
                                        price={p.price}
                                    />
                                ))}
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
                        <Heading level={2}>
                            Multi Select Buttons
                        </Heading>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => setSelectedLabels([])}
                            disabled={selectedLabels.length === 0}
                            className="text-[#5E57AC]"
                        >
                            Deselect all
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {["Tech", "Golf", "Outdoors", "Home", "Books", "Fashion", "Beauty", "Toys"].map((label) => (
                            <label
                                key={label}
                                className={`group flex items-center justify-center px-7 py-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                                    selectedLabels.includes(label)
                                        ? "bg-[#5E57AC] text-white border-2 border-[#5E57AC] shadow-md"
                                        : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedLabels.includes(label)}
                                    onChange={() => toggleLabel(label)}
                                    className="sr-only"
                                />
                                <span className="text-sm font-semibold text-center leading-tight">
                                    {label}
                                </span>
                            </label>
                        ))}
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
                        {/* Button Variants */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button Variants
                            </Heading>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="primary">
                                    Primary Button
                                </Button>
                                <Button variant="secondary">
                                    Secondary Button
                                </Button>
                                <Button variant="outline">
                                    Outline Button
                                </Button>
                                <Button variant="ghost">Ghost Button</Button>
                            </div>
                        </div>

                        {/* Button Sizes */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button Sizes
                            </Heading>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="small">Small</Button>
                                <Button size="medium">Medium</Button>
                                <Button size="large">Large</Button>
                            </div>
                        </div>

                        {/* Button States */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Button States
                            </Heading>
                            <div className="flex flex-wrap gap-4">
                                <Button>Normal</Button>
                                <Button disabled>Disabled</Button>
                            </div>
                        </div>

                        {/* Full Width Button */}
                        <div>
                            <Heading level={4} className="mb-4">
                                Full Width Button
                            </Heading>
                            <Button fullWidth>Full Width Button</Button>
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
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                HEADINGS - Baloo 2 (Semi-bold)
                            </p>
                            <Heading level={2}>
                                The quick brown fox jumps over the lazy dog
                            </Heading>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                BODY TEXT - Comfortaa (Medium)
                            </p>
                            <p className="text-lg text-gray-700">
                                The quick brown fox jumps over the lazy dog.
                                This is a sample paragraph text using the
                                Comfortaa font family with medium weight for
                                optimal readability.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                BUTTONS - Outfit (Semi-bold)
                            </p>
                            <Button>Button Text Example</Button>
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
        </div>
    );
};
