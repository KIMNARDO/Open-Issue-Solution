// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG - Papsnet ||============================== //

const BRAND_NAVY = '#0D2240';

const LogoMain = ({ reverse, width, height, ...others }: { reverse?: boolean; width?: number; height?: number }) => {
  const theme = useTheme();
  const textColor = reverse ? '#ffffff' : BRAND_NAVY;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || 180}
      height={height || 44}
      viewBox="0 0 180 44"
      fill="none"
    >
      {/* Network Globe Icon */}
      <g transform="translate(2, 2)">
        {/* Outer circle */}
        <circle cx="20" cy="20" r="18" stroke={textColor} strokeWidth="1.8" fill="none" />
        {/* Globe cross lines */}
        <ellipse cx="20" cy="20" rx="10" ry="18" stroke={textColor} strokeWidth="1.2" fill="none" />
        <line x1="2" y1="20" x2="38" y2="20" stroke={textColor} strokeWidth="1.2" />
        <line x1="20" y1="2" x2="20" y2="38" stroke={textColor} strokeWidth="1.2" />
        {/* Network nodes */}
        <circle cx="20" cy="4" r="2.5" fill={textColor} />
        <circle cx="20" cy="36" r="2.5" fill={textColor} />
        <circle cx="4" cy="20" r="2.5" fill={textColor} />
        <circle cx="36" cy="20" r="2.5" fill={textColor} />
        <circle cx="10" cy="10" r="2" fill={textColor} />
        <circle cx="30" cy="10" r="2" fill={textColor} />
        <circle cx="10" cy="30" r="2" fill={textColor} />
        <circle cx="30" cy="30" r="2" fill={textColor} />
        {/* Center handshake simplified */}
        <path
          d="M15 21.5c0 0 2-2 5-2s5 2 5 2"
          stroke={textColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="17" r="2.5" fill={textColor} />
        <circle cx="24" cy="17" r="2.5" fill={textColor} />
      </g>

      {/* "Papsnet" text */}
      <text
        x="48"
        y="28"
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={textColor}
        letterSpacing="-0.5"
      >
        Papsnet
      </text>

      {/* Tagline */}
      <text
        x="48"
        y="39"
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        fontSize="6.5"
        fontWeight="400"
        fill={textColor}
        opacity="0.6"
        letterSpacing="0.3"
      >
        People &amp; People Solution Networks
      </text>
    </svg>
  );
};

export default LogoMain;
