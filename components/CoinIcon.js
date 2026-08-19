// Pure-SVG LeetCoin. `id` keeps gradient defs unique when several render at once.
const CoinIcon = ({ size = 24, className = "", id = "coin" }) => {
    const gid = `${id}-face`;
    const rid = `${id}-rim`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gid} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFE9A8" />
                    <stop offset="0.45" stopColor="#FFC24B" />
                    <stop offset="1" stopColor="#E8860F" />
                </linearGradient>
                <linearGradient id={rid} x1="10" y1="10" x2="38" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF6DC" />
                    <stop offset="1" stopColor="#C96D08" />
                </linearGradient>
            </defs>

            <circle cx="24" cy="24" r="21" fill={`url(#${rid})`} />
            <circle cx="24" cy="24" r="17.5" fill={`url(#${gid})`} />
            <circle cx="24" cy="24" r="17.5" stroke="#FFF3D0" strokeOpacity="0.5" strokeWidth="1" />

            {/* Stylised LeetCode mark */}
            <path
                d="M27.8 13.5 20 21.4a3.8 3.8 0 0 0 0 5.4l7.8 7.8"
                stroke="#5B3200"
                strokeWidth="3.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path d="M22.6 24.1h10.6" stroke="#5B3200" strokeWidth="3.1" strokeLinecap="round" />

            {/* Specular highlight */}
            <ellipse cx="17.5" cy="14.5" rx="6" ry="3.4" transform="rotate(-32 17.5 14.5)" fill="#FFFFFF" fillOpacity="0.45" />
        </svg>
    );
};

export default CoinIcon;
