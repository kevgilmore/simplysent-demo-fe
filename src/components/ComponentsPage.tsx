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
    const [minBudget, setMinBudget] = useState(50);
    const [maxBudget, setMaxBudget] = useState(300);
    const [activeTab, setActiveTab] = useState("components");

    const dropdownOptions = [
        { value: "option1", label: "Electronics" },
        { value: "option2", label: "Fashion" },
        { value: "option3", label: "Home & Garden" },
        { value: "option4", label: "Sports & Outdoors" },
        { value: "option5", label: "Books & Media" },
    ];

    const tabs = [
        { id: "components", label: "Components" },
        { id: "design", label: "Design System" },
        { id: "documentation", label: "Documentation" },
    ];

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
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                        <p className="text-gray-700 font-medium">
                            Active Tab:{" "}
                            <span className="text-[#5E57AC] font-semibold">
                                {tabs.find((t) => t.id === activeTab)?.label}
                            </span>
                        </p>
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

                {/* Product Cards Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <Heading level={2} className="mb-6">
                        Product Cards
                    </Heading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProductCard
                            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                            name="Wireless Headphones"
                            price={129.99}
                        />
                        <ProductCard
                            image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
                            name="Elegant Watch Collection"
                            price={249.99}
                        />
                        <ProductCard
                            image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop"
                            name="Premium Sunglasses"
                            price={89.99}
                        />
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
                        label="Select your budget range"
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
