import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Heart,
    ThumbsUp,
    ThumbsDown,
    Star,
    ExternalLink,
    Package,
    Truck,
    Shield,
    Share2,
    Award,
    CheckCircle,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface ProductDetail {
    id: string;
    name: string;
    price: number;
    image: string;
    images: string[];
    description: string;
    rating: number;
    reviews: number;
    features: string[];
    specifications: { label: string; value: string }[];
    inStock: boolean;
    shipping: string;
}

// Available product images (transparent PNGs like person page)
const PRODUCT_IMAGES = [
    "/img/products/fitbit.png",
    "/img/products/ninaj2.png",
    "/img/products/ninja.png",
    "/img/products/pop.png",
    "/img/products/sony.png",
    "/img/products/controller.png",
];

// Mock product data - in a real app, this would come from an API
const mockProducts: Record<string, ProductDetail> = {
    "ai-1": {
        id: "ai-1",
        name: "Playstation Controller",
        price: 59.96,
        image: "/img/products/controller.png",
        images: [
            "/img/products/controller.png",
            "/img/products/controller.png",
            "/img/products/controller.png",
        ],
        description:
            "Take total control of every game with the most intelligently designed controller we've ever created, with responsive triggers, refined sticks, textured grips and a host of innovative features that bring you closer to your games.",
        rating: 5.0,
        reviews: 25,
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Premium sound quality",
            "Comfortable over-ear design",
            "Bluetooth 5.0 connectivity",
            "Built-in microphone for calls",
        ],
        specifications: [
            { label: "Brand", value: "AudioTech Pro" },
            { label: "Color", value: "Midnight Black" },
            { label: "Weight", value: "250g" },
            { label: "Bluetooth Version", value: "5.0" },
            { label: "Battery Life", value: "30 hours" },
            { label: "Warranty", value: "2 years" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "ai-2": {
        id: "ai-2",
        name: "Smart Home Starter Kit",
        price: 139.99,
        image: PRODUCT_IMAGES[0], // fitbit.png
        images: [
            PRODUCT_IMAGES[0],
            PRODUCT_IMAGES[1],
            PRODUCT_IMAGES[2],
        ],
        description:
            "Transform your house into a smart home with this comprehensive starter kit. Includes smart plugs, light bulbs, and a central hub that works with all major voice assistants. Easy to set up and control everything from your smartphone.",
        rating: 4.6,
        reviews: 892,
        features: [
            "Compatible with Alexa, Google Home, and Siri",
            "Includes 3 smart plugs and 2 smart bulbs",
            "Central hub for easy control",
            "Schedule and automate your devices",
            "Energy monitoring",
            "Simple app control",
        ],
        specifications: [
            { label: "Brand", value: "SmartLife" },
            { label: "Items Included", value: "Hub, 3 Plugs, 2 Bulbs" },
            { label: "Connectivity", value: "Wi-Fi 2.4GHz" },
            { label: "Voice Control", value: "Alexa, Google, Siri" },
            { label: "App", value: "iOS & Android" },
            { label: "Warranty", value: "1 year" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "ai-3": {
        id: "ai-3",
        name: "Cosy Deluxe Candle",
        price: 18.99,
        image: PRODUCT_IMAGES[3], // pop.png
        images: [
            PRODUCT_IMAGES[3],
            PRODUCT_IMAGES[0],
            PRODUCT_IMAGES[1],
        ],
        description:
            "Indulge in the warm, inviting aroma of our handcrafted deluxe candle. Made with premium soy wax and natural essential oils, this candle creates the perfect ambiance for relaxation. With a burn time of up to 50 hours, it's the perfect gift for creating a cozy atmosphere.",
        rating: 4.9,
        reviews: 2156,
        features: [
            "100% natural soy wax",
            "Essential oil blend",
            "50-hour burn time",
            "Lead-free cotton wick",
            "Eco-friendly packaging",
            "Hand-poured with care",
        ],
        specifications: [
            { label: "Brand", value: "Cosy Home" },
            { label: "Scent", value: "Vanilla & Sandalwood" },
            { label: "Weight", value: "300g" },
            { label: "Burn Time", value: "50 hours" },
            { label: "Wax Type", value: "Natural Soy" },
            { label: "Container", value: "Amber Glass" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "ai-4": {
        id: "ai-4",
        name: "Premium Noise-Cancelling Earbuds",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Elevate your listening experience with these premium wireless earbuds featuring industry-leading noise cancellation. Perfect for commuting, working out, or just enjoying your favorite music. IPX4 water-resistant and equipped with adaptive sound technology.",
        rating: 4.7,
        reviews: 1567,
        features: [
            "Industry-leading noise cancellation",
            "8-hour battery per charge",
            "IPX4 water-resistant",
            "Wireless charging case",
            "Adaptive sound technology",
            "Touch controls",
        ],
        specifications: [
            { label: "Brand", value: "SonicPro" },
            { label: "Color", value: "Pearl White" },
            { label: "Battery Life", value: "8 hours (32 with case)" },
            { label: "Water Resistance", value: "IPX4" },
            { label: "Bluetooth", value: "5.2" },
            { label: "Warranty", value: "1 year" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "ai-5": {
        id: "ai-5",
        name: "Designer Watch Collection",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Make a statement with this elegant designer watch featuring a minimalist design and premium materials. Swiss-inspired movement ensures precision timekeeping, while the sapphire crystal glass and stainless steel construction guarantee durability. Water-resistant up to 50 meters.",
        rating: 4.8,
        reviews: 743,
        features: [
            "Swiss-inspired quartz movement",
            "Sapphire crystal glass",
            "Stainless steel case and band",
            "Water-resistant to 50m",
            "Scratch-resistant",
            "Date display",
        ],
        specifications: [
            { label: "Brand", value: "LuxTime" },
            { label: "Case Material", value: "Stainless Steel" },
            { label: "Case Diameter", value: "42mm" },
            { label: "Band Material", value: "Stainless Steel" },
            { label: "Movement", value: "Quartz" },
            { label: "Warranty", value: "3 years" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "tech-1": {
        id: "tech-1",
        name: "Wireless Headphones Pro Max",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1577174881658-0f30157e8d4c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Professional-grade wireless headphones designed for audiophiles and professionals. Features Hi-Res audio certification, spatial audio support, and premium materials for ultimate comfort during extended use. Perfect for studio work, gaming, or critical listening.",
        rating: 4.9,
        reviews: 2341,
        features: [
            "Hi-Res audio certified",
            "Spatial audio support",
            "40mm drivers",
            "35-hour battery life",
            "Premium memory foam cushions",
            "Multi-device connectivity",
        ],
        specifications: [
            { label: "Brand", value: "AudioPro Max" },
            { label: "Driver Size", value: "40mm" },
            { label: "Frequency Response", value: "20Hz-40kHz" },
            { label: "Impedance", value: "32Ω" },
            { label: "Battery", value: "35 hours" },
            { label: "Warranty", value: "2 years" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "tech-2": {
        id: "tech-2",
        name: "Smart Home Hub",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558089687-e1d617c0ca85?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "The ultimate smart home control center. This hub connects and manages all your smart devices in one place. Features a beautiful touchscreen display, voice control, and automation capabilities. Works seamlessly with all major smart home ecosystems.",
        rating: 4.7,
        reviews: 1456,
        features: [
            "7-inch HD touchscreen",
            "Voice control enabled",
            "Supports 100+ devices",
            "Built-in security features",
            "Automation and scheduling",
            "Works with all major brands",
        ],
        specifications: [
            { label: "Brand", value: "HomeSmart Pro" },
            { label: "Screen Size", value: "7 inches" },
            { label: "Connectivity", value: "Wi-Fi, Zigbee, Z-Wave" },
            { label: "Voice Assistants", value: "All major platforms" },
            { label: "Processor", value: "Quad-core 1.5GHz" },
            { label: "Warranty", value: "1 year" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "tech-3": {
        id: "tech-3",
        name: "Portable Bluetooth Speaker",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1585908390952-a7448d7d0d1f?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Take your music anywhere with this compact yet powerful Bluetooth speaker. Waterproof design makes it perfect for pool parties, beach trips, or outdoor adventures. 360-degree sound ensures everyone enjoys the music, and the 12-hour battery keeps the party going.",
        rating: 4.6,
        reviews: 3421,
        features: [
            "360-degree sound",
            "IPX7 waterproof",
            "12-hour battery life",
            "Compact and portable",
            "Deep bass enhancement",
            "USB-C charging",
        ],
        specifications: [
            { label: "Brand", value: "SoundWave" },
            { label: "Water Resistance", value: "IPX7" },
            { label: "Battery Life", value: "12 hours" },
            { label: "Weight", value: "450g" },
            { label: "Bluetooth Range", value: "30 meters" },
            { label: "Warranty", value: "1 year" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
    "golf-1": {
        id: "golf-1",
        name: "Premium Golf Balls (12 pack)",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1593111774240-d529f12a7f5e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1530028828-25e8270a2eae?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Professional-grade golf balls designed for maximum distance and control. The advanced dimple pattern provides exceptional aerodynamics, while the soft feel cover ensures great greenside control. Perfect for serious golfers looking to improve their game.",
        rating: 4.8,
        reviews: 892,
        features: [
            "Advanced dimple pattern",
            "Soft feel cover",
            "Maximum distance",
            "Enhanced greenside control",
            "Tour-level performance",
            "High visibility design",
        ],
        specifications: [
            { label: "Brand", value: "ProGolf Elite" },
            { label: "Pack Size", value: "12 balls" },
            { label: "Cover Material", value: "Urethane" },
            { label: "Compression", value: "90" },
            { label: "Color", value: "White" },
            { label: "Dimples", value: "332" },
        ],
        inStock: true,
        shipping: "Will arrive in time for James's Birthday",
    },
};

export const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [thumbsUp, setThumbsUp] = useState(false);
    const [thumbsDown, setThumbsDown] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Set html background to purple for safe area (same approach as PersonPage but with purple)
    useEffect(() => {
        const html = document.documentElement;
        html.style.setProperty('background', '#d1ccfb', 'important');
        return () => {
            html.style.removeProperty('background');
        };
    }, []);

    useEffect(() => {
        if (productId && mockProducts[productId]) {
            setProduct(mockProducts[productId]);
        } else {
            // If product not found, redirect back
            navigate("/recommendations");
        }
    }, [productId, navigate]);

    const handleThumbsUp = () => {
        setThumbsUp(!thumbsUp);
        if (thumbsDown) setThumbsDown(false);
    };

    const handleThumbsDown = () => {
        setThumbsDown(!thumbsDown);
        if (thumbsUp) setThumbsUp(false);
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleShare = () => {
        // In a real app, this would open share dialog
        alert("Share feature (Demo)");
    };

    const handlePrevImage = () => {
        if (product) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1,
            );
        }
    };

    const handleNextImage = () => {
        if (product) {
            setCurrentImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1,
            );
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNextImage();
        }
        if (isRightSwipe) {
            handlePrevImage();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white overflow-x-hidden" style={{ marginTop: "-16px", backgroundColor: "white", minHeight: "100vh", position: "relative", zIndex: 1 }}>
            {/* Desktop: Two Column Layout */}
            <div className="hidden md:block relative" style={{ height: "50vh", minHeight: "400px", overflow: "visible" }}>
                <div className="flex h-full max-w-6xl mx-auto" style={{ overflow: "visible" }}>
                    {/* Left Column - Purple Section with Image */}
                    <div className="flex-1 bg-simplysent-purple-alt h-full relative overflow-hidden" style={{ marginTop: "calc(-1 * env(safe-area-inset-top))" }}>
                        {/* Header buttons */}
                        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-8 pb-4" style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}>
                            <div className="flex items-center justify-between">
                                {/* Back Button */}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                                >
                                    <ArrowLeft size={20} className="text-gray-800" />
                                </button>
                                
                                {/* Share Button */}
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                                >
                                    <Share2 size={20} className="text-gray-800" />
                                </button>
                            </div>
                        </div>

                        {/* Product Image Section */}
                        <div className="absolute inset-0 top-[10%] bottom-0 flex flex-col items-center justify-start px-4 pb-20">
                            <div className="w-full max-w-sm">
                                <div
                                    className="aspect-square relative bg-transparent"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {/* Product Image - Transparent PNG like person page */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImageIndex}
                                            className="absolute inset-0 flex items-center justify-center p-8 bg-transparent"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={product.images[currentImageIndex]}
                                                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                                className="w-full h-full object-contain scale-110"
                                                style={{ mixBlendMode: "normal" }}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                
                                {/* Carousel Dots - Inside purple area below image */}
                                <div className="flex items-center justify-center gap-2 mt-2 relative z-30">
                                    {product.images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`h-3 rounded-full transition-all ${
                                                index === currentImageIndex
                                                    ? "bg-simplysent-purple w-10"
                                                    : "bg-purple-300 w-3"
                                            }`}
                                            style={{ minWidth: index === currentImageIndex ? "40px" : "12px" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - White Section with Content */}
                    <div className="flex-1 bg-white flex flex-col justify-center px-8 pt-16 relative">
                        {/* Curved overlay on left edge - creates smooth transition from purple */}
                        <div 
                            className="absolute left-0 top-0 bottom-0 pointer-events-none z-0"
                            style={{ 
                                width: "120px",
                                left: "-2px"
                            }}
                        >
                            <svg
                                viewBox="0 0 240 1000"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 0C40 100 80 300 120 500C160 700 200 900 240 1000L240 1000L0 1000Z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        <div className="relative z-10 space-y-4">
                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={`${
                                                i < Math.floor(product.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div>
                                <span className="text-4xl font-bold text-simplysent-purple">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            {/* About this item */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2">
                                    About this item
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Favorite and Add to Cart Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 md:items-center w-[95%]">
                                {/* Favorite Button */}
                                <button
                                    onClick={handleFavorite}
                                    className="flex items-center justify-center rounded-2xl focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] bg-white hover:bg-gray-50"
                                    style={{ 
                                        width: "56px", 
                                        height: "56px", 
                                        padding: "16px", 
                                        flexShrink: 0,
                                        position: "relative"
                                    }}
                                    aria-label="Favorite"
                                >
                                    <Heart
                                        size={22}
                                        className={isFavorite ? "fill-simplysent-purple text-simplysent-purple" : "text-simplysent-purple"}
                                        fill={isFavorite ? "currentColor" : "none"}
                                        style={{ 
                                            width: "22px", 
                                            height: "22px", 
                                            flexShrink: 0,
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            pointerEvents: "none"
                                        }}
                                    />
                                </button>

                                {/* Add to cart button */}
                                <button
                                    onClick={() =>
                                        alert("Add to cart (Demo feature)")
                                    }
                                    className="bg-[#5E57AC] text-white hover:bg-[#4e47a0] active:bg-[#463f8f] active:opacity-95 focus:ring-[#5E57AC]/30 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:shadow-[0_8px_30px_rgba(0,0,0,0.2)] font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 px-9 py-4 text-lg hover:scale-105 active:scale-95 w-full md:flex-1"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Purple Section - Full Width */}
            <div className="md:hidden relative" style={{ height: "50vh", minHeight: "400px", marginTop: "calc(-1 * env(safe-area-inset-top))" }}>
                <div className="bg-simplysent-purple-alt h-full relative overflow-hidden">
                    {/* Header buttons */}
                    <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-8 pb-4" style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}>
                        <div className="flex items-center justify-between">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                            >
                                <ArrowLeft size={20} className="text-gray-800" />
                            </button>
                            
                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                            >
                                <Share2 size={20} className="text-gray-800" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile: Single Column Layout */}
                    <div className="md:hidden absolute inset-0 top-[10%] bottom-0 flex flex-col items-center justify-start px-4 pb-20">
                        <div className="w-full max-w-md">
                            <div
                                className="aspect-square relative bg-transparent"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Product Image - Transparent PNG like person page */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        className="absolute inset-0 flex items-center justify-center p-8 bg-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={product.images[currentImageIndex]}
                                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-contain scale-110"
                                            style={{ mixBlendMode: "normal" }}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            
                            {/* Carousel Dots - Inside purple area below image */}
                            <div className="flex items-center justify-center gap-2 relative z-30" style={{ marginTop: "-60px" }}>
                                {product.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`h-3 w-3 rounded-full transition-all ${
                                            index === currentImageIndex
                                                ? "bg-simplysent-purple"
                                                : "bg-white"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Simple Curved Transition to White - Upside down curve */}
                    <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: "80px" }}>
                        <svg
                            viewBox="0 0 1440 160"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 0Q720 160 1440 0L1440 160L0 160Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Product Details Section - White Background (Mobile Only) */}
            <div className="md:hidden w-full pt-4 pb-8 bg-white relative overflow-visible" style={{ marginTop: "-1px", marginBottom: "50px" }}>
                <div className="px-4 space-y-6" style={{ marginTop: "-20px" }}>
                    {/* Product Name */}
                    <div className="flex items-start justify-between gap-4 relative px-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex-1">
                            {product.name}
                        </h1>
                        {/* Favorite Button */}
                        <button
                            onClick={handleFavorite}
                            className="flex items-center justify-center rounded-2xl focus:outline-none shadow-[0_4px_12px_rgba(100,100,100,0.15)] bg-white hover:bg-gray-50 flex-shrink-0"
                            style={{ 
                                width: "56px", 
                                height: "56px", 
                                padding: "0",
                                marginTop: "-32px",
                                minWidth: "56px",
                                minHeight: "56px",
                                position: "relative",
                                zIndex: 10
                            }}
                            aria-label="Favorite"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <Heart
                                size={22}
                                className={isFavorite ? "fill-simplysent-purple text-simplysent-purple" : "text-simplysent-purple"}
                                fill={isFavorite ? "currentColor" : "none"}
                                style={{ width: "22px", height: "22px", flexShrink: 0 }}
                            />
                        </button>
                    </div>

                    {/* Rating and Price */}
                    <div className="flex items-start justify-between px-4">
                        <div className="flex flex-col gap-1" style={{ marginTop: "-16px" }}>
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${
                                            i < Math.floor(product.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({product.reviews} reviews)
                            </span>
                        </div>
                        <span className="text-3xl font-bold text-simplysent-purple">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    {/* About this item */}
                    <div className="px-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                            About this item
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Add to cart button */}
                    <button
                        onClick={() =>
                            alert("Add to cart (Demo feature)")
                        }
                        className="w-[95%] mx-auto block bg-[#5E57AC] text-white hover:bg-[#4e47a0] active:bg-[#463f8f] active:opacity-95 focus:ring-[#5E57AC]/30 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:shadow-[0_8px_30px_rgba(0,0,0,0.2)] font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 px-9 py-4 text-lg hover:scale-105 active:scale-95"
                    >
                        Add to cart
                    </button>

                </div>
            </div>
        </div>
    );
};
