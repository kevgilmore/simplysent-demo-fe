import React, { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
export function AboutUsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -20,
            }}
            transition={{
                duration: 0.4,
            }}
            className="max-w-4xl mx-auto py-8 px-4"
        >
            <Link
                to="/"
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center mb-8"
            >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
            </Link>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    About SimplySent
                </h1>
                <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 mb-6">
                        Welcome to SimplySent, where finding the perfect gift
                        becomes a delightful experience rather than a stressful
                        task.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 mb-4">
                        At SimplySent, we believe that the perfect gift has the
                        power to strengthen relationships and create lasting
                        memories. Our mission is to help you discover
                        thoughtful, personalized gifts for every person in your
                        life, no matter the occasion.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Our Story
                    </h2>
                    <p className="text-gray-700 mb-4">
                        SimplySent was born from a simple frustration:
                        gift-giving should be joyful, not stressful. Our founder
                        spent countless hours searching for the perfect gifts
                        for friends and family, only to end up with generic,
                        uninspired options.
                    </p>
                    <p className="text-gray-700 mb-4">
                        That's when the idea struck—what if AI could help match
                        people's unique interests and personalities with truly
                        thoughtful gifts? After months of development,
                        SimplySent launched with a mission to revolutionize how
                        we discover and give gifts.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Our AI-powered recommendation engine analyzes thousands
                        of products and matches them with the recipient's
                        interests, age, occasion, and your budget. The result?
                        Personalized gift suggestions that feel thoughtful and
                        unique.
                    </p>
                    <p className="text-gray-700 mb-4">
                        We've carefully curated our product selection to include
                        items from independent creators, popular brands, and
                        everything in between. Each product is vetted for
                        quality, value, and gift-worthiness.
                    </p>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Our Values
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                        <li>
                            <strong>Thoughtfulness:</strong> We believe gifts
                            should reflect genuine care and consideration.
                        </li>
                        <li>
                            <strong>Simplicity:</strong> Finding the perfect
                            gift shouldn't be complicated or time-consuming.
                        </li>
                        <li>
                            <strong>Personalization:</strong> The best gifts are
                            tailored to the individual's unique personality and
                            interests.
                        </li>
                        <li>
                            <strong>Quality:</strong> We only recommend products
                            we'd be proud to give ourselves.
                        </li>
                    </ul>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                        Join Us
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Whether you're shopping for a birthday, holiday, or just
                        because, SimplySent is here to make gift-giving a joyful
                        experience. Try our AI Gift Finder today and discover
                        the perfect present for someone special.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Have questions or feedback? We'd love to hear from you!
                        Contact us at{" "}
                        <a
                            href="mailto:hello@simplysent.co"
                            className="text-purple-600 hover:text-purple-800"
                        >
                            hello@simplysent.co
                        </a>
                        .
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
