export interface ButtonTheme {
    id: string;
    name: string;
    colors: string[];
    label: string;
}

export const buttonThemes: ButtonTheme[] = [
    {
        id: "purple-to-pink",
        name: "Purple to Pink",
        colors: ["#5E57AC", "#8540de", "#ab569a"],
        label: "Purple to Pink",
    },
    {
        id: "deep-purple",
        name: "Deep Purple",
        colors: ["#8540de", "#7a589e", "#5E57AC"],
        label: "Deep Purple",
    },
    {
        id: "pink-to-purple",
        name: "Pink to Purple",
        colors: ["#ab569a", "#c55597", "#8540de"],
        label: "Pink to Purple",
    },
    {
        id: "full-spectrum",
        name: "Full Spectrum",
        colors: ["#8540de", "#7a589e", "#ab569a", "#c55597"],
        label: "Full Spectrum",
    },
    {
        id: "light-to-dark",
        name: "Light to Dark",
        colors: ["#E5E7EB", "#7a589e", "#5E57AC"],
        label: "Light to Dark",
    },
    {
        id: "purple-pink-blend",
        name: "Purple Pink Blend",
        colors: ["#5E57AC", "#ab569a", "#c55597"],
        label: "Purple Pink Blend",
    },
    {
        id: "vibrant-purple",
        name: "Vibrant Purple",
        colors: ["#8540de", "#5E57AC", "#7a589e"],
        label: "Vibrant Purple",
    },
    {
        id: "soft-pink",
        name: "Soft Pink",
        colors: ["#c55597", "#ab569a", "#8540de"],
        label: "Soft Pink",
    },
    {
        id: "royal-purple",
        name: "Royal Purple",
        colors: ["#5E57AC", "#8540de", "#7a589e", "#5E57AC"],
        label: "Royal Purple",
    },
    {
        id: "default",
        name: "Default",
        colors: ["#5E57AC"],
        label: "Default",
    },
    {
        id: "cool-purple",
        name: "Cool Purple",
        colors: ["#7a589e", "#5E57AC", "#8540de"],
        label: "Cool Purple",
    },
    {
        id: "warm-pink",
        name: "Warm Pink",
        colors: ["#c55597", "#ab569a", "#7a589e"],
        label: "Warm Pink",
    },
];

export const getThemeById = (id: string): ButtonTheme | undefined => {
    return buttonThemes.find(theme => theme.id === id);
};

