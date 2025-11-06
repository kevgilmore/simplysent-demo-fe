export const relationshipOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "friend", label: "Friend" },
    { value: "partner", label: "Partner" },
    { value: "sibling", label: "Sibling" },
    { value: "colleague", label: "Colleague" },
    { value: "other", label: "Other" },
];

export const occasionOptions = [
    { value: "birthday", label: "Birthday" },
    { value: "christmas", label: "Christmas" },
    { value: "anniversary", label: "Anniversary" },
    { value: "graduation", label: "Graduation" },
    { value: "wedding", label: "Wedding" },
    { value: "thank-you", label: "Thank You" },
    { value: "just-because", label: "Just Because" },
    { value: "other", label: "Other" },
];

export const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const clothingSizeOptions = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
    { value: "not-sure", label: "Not sure" },
];

export const favouriteDrinkOptions = [
    { value: "coffee", label: "Coffee" },
    { value: "tea", label: "Tea" },
    { value: "wine", label: "Wine" },
    { value: "beer", label: "Beer" },
    { value: "cocktails", label: "Cocktails" },
    { value: "whiskey", label: "Whiskey" },
    { value: "soft-drinks", label: "Soft Drinks" },
    { value: "other", label: "Other" },
];

export const interestOptions = [
    { value: "sports", label: "Sports", emoji: "⚽" },
    { value: "gaming", label: "Gaming", emoji: "🎮" },
    { value: "reading", label: "Reading", emoji: "📚" },
    { value: "cooking", label: "Cooking", emoji: "👨‍🍳" },
    { value: "music", label: "Music", emoji: "🎵" },
    { value: "movies", label: "Movies", emoji: "🎬" },
    { value: "travel", label: "Travel", emoji: "✈️" },
    { value: "fitness", label: "Fitness", emoji: "💪" },
    { value: "art", label: "Art & Crafts", emoji: "🎨" },
    { value: "tech", label: "Technology", emoji: "💻" },
    { value: "fashion", label: "Fashion", emoji: "👗" },
    { value: "gardening", label: "Gardening", emoji: "🌱" },
    { value: "photography", label: "Photography", emoji: "📸" },
    { value: "pets", label: "Pets & Animals", emoji: "🐾" },
];

export const sentimentOptions = [
    { value: "funny", label: "Funny" },
    { value: "thoughtful", label: "Thoughtful" },
    { value: "practical", label: "Practical" },
    { value: "romantic", label: "Romantic" },
    { value: "unique", label: "Unique" },
    { value: "luxury", label: "Luxury" },
];

export const ageOptions = Array.from({ length: 100 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));
