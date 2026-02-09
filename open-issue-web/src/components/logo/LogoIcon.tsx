// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO ICON - Papsnet ||============================== //

const BRAND_NAVY = '#0D2240';

const LogoIcon = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  const color = reverse ? '#ffffff' : BRAND_NAVY;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.8" fill="none" />
      {/* Globe cross lines */}
      <ellipse cx="20" cy="20" rx="10" ry="18" stroke={color} strokeWidth="1.2" fill="none" />
      <line x1="2" y1="20" x2="38" y2="20" stroke={color} strokeWidth="1.2" />
      <line x1="20" y1="2" x2="20" y2="38" stroke={color} strokeWidth="1.2" />
      {/* Network nodes */}
      <circle cx="20" cy="4" r="2.5" fill={color} />
      <circle cx="20" cy="36" r="2.5" fill={color} />
      <circle cx="4" cy="20" r="2.5" fill={color} />
      <circle cx="36" cy="20" r="2.5" fill={color} />
      <circle cx="10" cy="10" r="2" fill={color} />
      <circle cx="30" cy="10" r="2" fill={color} />
      <circle cx="10" cy="30" r="2" fill={color} />
      <circle cx="30" cy="30" r="2" fill={color} />
      {/* Center people */}
      <circle cx="16" cy="17" r="2.5" fill={color} />
      <circle cx="24" cy="17" r="2.5" fill={color} />
      <path
        d="M15 21.5c0 0 2-2 5-2s5 2 5 2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default LogoIcon;
