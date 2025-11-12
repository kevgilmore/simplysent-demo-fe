export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                simplysent: {
                    purple: "#5f59a6",
                    "purple-light": "#7a75ba",
                    "purple-dark": "#4a4582",
                },
            },
            fontFamily: {
                sans: ['"Stack Sans"', "system-ui", "sans-serif"],
                headline: ['"Stack Sans Headline"', "system-ui", "sans-serif"],
                notch: ['"Stack Sans Notch"', "system-ui", "sans-serif"],
            },
        },
    },
};
