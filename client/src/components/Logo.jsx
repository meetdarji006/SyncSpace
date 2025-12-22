import React from 'react';

const Logo = ({ className = "", variant = "dark" }) => {
    // variant 'dark' is for light backgrounds (uses Brand Primary - Deep Navy)
    // variant 'light' is for dark/blue backgrounds (uses Brand Light - Light Gray)
    const fillColor = variant === 'light' ? '#e6e6e6' : '#122b40';

    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${className}`}
        >
            {/* Top-Right Bracket */}
            <path
                d="M55 20C74.33 20 90 35.67 90 55V75C90 77.76 87.76 80 85 80C82.24 80 80 77.76 80 75V55C80 41.19 68.81 30 55 30H45C42.24 30 40 27.76 40 25C40 22.24 42.24 20 45 20H55Z"
                fill={fillColor}
            />

            {/* Bottom-Left Bracket */}
            <path
                d="M45 80C25.67 80 10 64.33 10 45V25C10 22.24 12.24 20 15 20C17.76 20 20 22.24 20 25V45C20 58.81 31.19 70 45 70H55C57.76 70 60 72.24 60 75C60 77.76 57.76 80 55 80H45Z"
                fill={fillColor}
            />

            {/* Central "Spark" Node */}
            <circle cx="50" cy="50" r="6" fill={fillColor} />

            {/*
                Optional: Add a subtle glow filter if it's the light variant
                to make it pop on the dark background
            */}
            {/* {variant === 'light' && (
                <circle cx="50" cy="50" r="10" fill="white" filter="blur(4px)" opacity="0.3" />
            )} */}
        </svg>
    );
};

export default Logo;
