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

// Mock product data - in a real app, this would come from an API
const mockProducts: Record<string, ProductDetail> = {
    "ai-1": {
        id: "ai-1",
        name: "Top-Rated Wireless Headphones",
        price: 189.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=800&auto=format&fit=crop",
        ],
        description:
            "Experience premium sound quality with these top-rated wireless headphones. Featuring advanced noise cancellation, comfortable over-ear design, and up to 30 hours of battery life. Perfect for music lovers, professionals, and travelers who demand the best audio experience.",
        rating: 4.8,
        reviews: 1243,
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
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558089687-e1d617c0ca85?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1602874801006-5e97b52c9635?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608452964553-9b4d97b2752f?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1587049352846-4a222e784587?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1615485500665-c3e6e7e49c3f?q=80&w=800&auto=format&fit=crop",
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

export const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [thumbsUp, setThumbsUp] = useState(false);
    const [thumbsDown, setThumbsDown] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Results
                </motion.button>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Title Section - Order 1 on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="order-1 lg:col-start-2"
                    >
                        {/* Product Title */}
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex-1">
                                    {product.name}
                                </h1>
                                {/* Share Button - Discrete placement */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-105"
                                    aria-label="Share product"
                                >
                                    <Share2 size={16} />
                                    <span className="hidden sm:inline">
                                        Share
                                    </span>
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1">
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
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl font-bold text-simplysent-purple">
                                    £{product.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Image Carousel - Order 2 on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="order-2 lg:row-start-1 lg:col-start-1 lg:row-span-2 -mt-4 lg:mt-0"
                    >
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div
                                className="aspect-square relative"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Main Carousel Image */}
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={product.images[currentImageIndex]}
                                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-20"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft
                                        size={24}
                                        className="text-gray-800"
                                    />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all z-20"
                                    aria-label="Next image"
                                >
                                    <ChevronRight
                                        size={24}
                                        className="text-gray-800"
                                    />
                                </button>

                                {/* Favorite Button Overlay */}
                                <button
                                    onClick={handleFavorite}
                                    className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform z-10"
                                >
                                    <Heart
                                        size={24}
                                        className={`transition-colors ${
                                            isFavorite
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                </button>

                                {/* In Stock Badge */}
                                {product.inStock && (
                                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
                                        <CheckCircle size={16} />
                                        In Stock
                                    </div>
                                )}

                                {/* SimplySent Verified Badge */}
                                <div className="absolute bottom-4 left-4 bg-simplysent-purple text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg z-10">
                                    <Award size={16} />
                                    SimplySent Verified
                                </div>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                    {currentImageIndex + 1} /{" "}
                                    {product.images.length}
                                </div>
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="flex gap-2 p-3 overflow-x-auto">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentImageIndex(index)
                                        }
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            index === currentImageIndex
                                                ? "border-simplysent-purple ring-2 ring-simplysent-purple/30"
                                                : "border-gray-200 hover:border-simplysent-purple-light"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gift Wrap - Simple text */}
                        <p className="flex items-center justify-center gap-2 text-gray-600 mt-4 text-sm">
                            <span className="text-base">🎁</span>
                            <span className="font-medium">
                                Gift wrap available at checkout
                            </span>
                        </p>
                    </motion.div>

                    {/* Product Info & Actions - Order 3 on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6 order-3 lg:col-start-2"
                    >
                        {/* Thumbs Up/Down Feedback */}
                        <div className="bg-white rounded-2xl p-4 shadow-md">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                How do you feel about this gift?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleThumbsUp}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                                        thumbsUp
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    <ThumbsUp
                                        size={20}
                                        className={thumbsUp ? "fill-white" : ""}
                                    />
                                    Love it
                                </button>
                                <button
                                    onClick={handleThumbsDown}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all hover:scale-105 ${
                                        thumbsDown
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    <ThumbsDown
                                        size={20}
                                        className={
                                            thumbsDown ? "fill-white" : ""
                                        }
                                    />
                                    Not for me
                                </button>
                            </div>
                        </div>

                        {/* Amazon Button */}
                        <div className="space-y-3">
                            {/* Shipping Badge - Above Button */}
                            <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 rounded-lg px-4 py-2 w-fit mx-auto">
                                <Truck size={18} />
                                <span className="font-semibold text-sm">
                                    {product.shipping}
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    alert(
                                        "Opening Amazon App... (Demo feature)",
                                    )
                                }
                                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <ExternalLink size={24} />
                                Purchase with Amazon
                            </button>
                            <p className="text-center text-sm text-gray-500">
                                Opens in Amazon app
                            </p>
                        </div>

                        {/* Why SimplySent Section */}
                        <div className="bg-gradient-to-br from-simplysent-purple/10 to-pink-50 rounded-2xl p-6 border-2 border-simplysent-purple/30 shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Award
                                    className="text-simplysent-purple"
                                    size={24}
                                />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Why SimplySent?
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-simplysent-purple/20 rounded-full p-1.5 mt-0.5">
                                        <CheckCircle
                                            className="text-simplysent-purple"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            AI-Powered Recommendations
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            Personalized gifts matched to their
                                            interests and style
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-simplysent-purple/20 rounded-full p-1.5 mt-0.5">
                                        <CheckCircle
                                            className="text-simplysent-purple"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            Expert Gift Curation
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            Every product is carefully vetted
                                            for gift-worthiness
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-simplysent-purple/20 rounded-full p-1.5 mt-0.5">
                                        <Shield
                                            className="text-simplysent-purple"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            Amazon's Trust & Security
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            Purchase with confidence through
                                            Amazon's secure platform
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-simplysent-purple/20 rounded-full p-1.5 mt-0.5">
                                        <CheckCircle
                                            className="text-simplysent-purple"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            Trusted by Thousands
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">
                                            Join thousands of happy gift-givers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white" />
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            2,500+ Happy Customers
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            This month
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className="fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">
                                "SimplySent helped me find the perfect gift in
                                minutes. My friend absolutely loved it!"
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                - Sarah M., verified customer
                            </p>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Key Features
                            </h2>
                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-1 bg-simplysent-purple/20 rounded-full p-1">
                                            <div className="w-2 h-2 bg-simplysent-purple rounded-full" />
                                        </div>
                                        <span className="text-gray-700">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Specifications */}
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Specifications
                            </h2>
                            <div className="space-y-3">
                                {product.specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <span className="text-gray-600 font-medium">
                                            {spec.label}
                                        </span>
                                        <span className="text-gray-900 font-semibold">
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SimplySent Promise */}
                        <div className="bg-gradient-to-r from-simplysent-purple/10 to-pink-50 rounded-2xl p-6 border-2 border-simplysent-purple/30 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="bg-simplysent-purple rounded-full p-3 flex-shrink-0">
                                    <Award className="text-white" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        The SimplySent Promise
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        We carefully curate every gift
                                        recommendation to ensure it's perfect
                                        for your recipient. Purchase confidently
                                        through Amazon's trusted platform with
                                        their excellent customer service and
                                        return policies.
                                    </p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle
                                                size={16}
                                                className="text-simplysent-purple"
                                            />
                                            <span className="text-xs font-semibold text-simplysent-purple">
                                                Expert Curation
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield
                                                size={16}
                                                className="text-simplysent-purple"
                                            />
                                            <span className="text-xs font-semibold text-simplysent-purple">
                                                Amazon Backed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Badges - Order 4 on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4 order-4 lg:col-start-1"
                    >
                        {/* Amazon Purchase Benefits */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-200">
                            <p className="text-xs font-bold text-orange-800 text-center mb-3 uppercase tracking-wide">
                                🛡️ Amazon Purchase Benefits
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center text-center">
                                    <Truck
                                        size={28}
                                        className="text-orange-600 mb-2"
                                    />
                                    <p className="text-xs font-bold text-gray-800">
                                        Prime Shipping
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        Fast & free
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center text-center">
                                    <Shield
                                        size={28}
                                        className="text-orange-600 mb-2"
                                    />
                                    <p className="text-xs font-bold text-gray-800">
                                        Amazon Secure
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        Trusted checkout
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col items-center text-center">
                                    <Package
                                        size={28}
                                        className="text-orange-600 mb-2"
                                    />
                                    <p className="text-xs font-bold text-gray-800">
                                        Easy Returns
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">
                                        Amazon policy
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* SimplySent Recommendation Badge */}
                        <div className="bg-gradient-to-r from-simplysent-purple to-pink-600 rounded-2xl p-4 text-white text-center shadow-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Award size={24} />
                                <p className="font-bold text-lg">
                                    SimplySent Recommended
                                </p>
                            </div>
                            <p className="text-sm opacity-90">
                                AI-powered matching + expert curation for the
                                perfect gift
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Trust Banner - Full Width */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            🎁 How SimplySent Works
                        </h3>
                        <p className="text-gray-600">
                            We find the perfect gifts, Amazon handles the rest
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-simplysent-purple/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <Award
                                    className="text-simplysent-purple"
                                    size={32}
                                />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">
                                Smart Recommendations
                            </h4>
                            <p className="text-sm text-gray-600">
                                AI-powered matching finds the perfect gift
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle
                                    className="text-blue-600"
                                    size={32}
                                />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">
                                Curated Quality
                            </h4>
                            <p className="text-sm text-gray-600">
                                Only top-rated, gift-worthy products
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <ShoppingCart
                                    className="text-orange-600"
                                    size={32}
                                />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">
                                Amazon Purchase
                            </h4>
                            <p className="text-sm text-gray-600">
                                Buy securely through Amazon's trusted platform
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                <Package className="text-green-600" size={32} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">
                                Amazon Delivery
                            </h4>
                            <p className="text-sm text-gray-600">
                                Fast shipping with gift wrap options
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <footer className="mt-16 pt-8 pb-6 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-sm text-gray-600 mb-3">
                            © {new Date().getFullYear()} SimplySent.co - All
                            rights reserved
                        </p>
                        <div className="flex justify-center gap-6 text-sm">
                            <a
                                href="/terms"
                                className="text-gray-600 hover:text-simplysent-purple transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="/privacy"
                                className="text-gray-600 hover:text-simplysent-purple transition-colors"
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
