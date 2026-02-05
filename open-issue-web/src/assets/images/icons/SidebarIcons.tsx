// 브랜드 컬러 기반 그라데이션 아이콘 컴포넌트들

export const InfoIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#121770" />
        <stop offset="100%" stopColor="#4A90E2" />
      </linearGradient>
      <filter id="infoGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#infoGrad)" opacity="0.2" />
    <path
      d="M12 16v-4M12 8h.01"
      stroke="url(#infoGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#infoGlow)"
    />
    <circle cx="12" cy="12" r="9" stroke="url(#infoGrad)" strokeWidth="2" opacity="0.5" />
  </svg>
);

export const WBSIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wbsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B46C1" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="url(#wbsGrad)" opacity="0.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="url(#wbsGrad)" opacity="0.6" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="url(#wbsGrad)" opacity="0.6" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="url(#wbsGrad)" opacity="0.4" />
    <line x1="6.5" y1="10" x2="6.5" y2="14" stroke="#4A90E2" strokeWidth="2" />
    <line x1="10" y1="6.5" x2="14" y2="6.5" stroke="#4A90E2" strokeWidth="2" />
  </svg>
);

export const MembersIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="membersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#121770" />
        <stop offset="100%" stopColor="#6B46C1" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="3.5" fill="url(#membersGrad)" opacity="0.7" />
    <circle cx="15" cy="7" r="3.5" fill="url(#membersGrad)" opacity="0.5" />
    <path d="M3 19c0-2.8 2.2-5 5-5h2c2.8 0 5 2.2 5 5" stroke="url(#membersGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M13 19c0-2.2 1.3-4 3-4.5h2c1.7.5 3 2.3 3 4.5"
      stroke="url(#membersGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

export const OutputIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="outputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" fill="url(#outputGrad)" opacity="0.3" />
    <path d="M13 2v7h7" fill="url(#outputGrad)" opacity="0.6" />
    <line x1="8" y1="13" x2="16" y2="13" stroke="url(#outputGrad)" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="17" x2="13" y2="17" stroke="url(#outputGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <circle cx="16.5" cy="16.5" r="1.5" fill="#F59E0B" />
  </svg>
);

export const IssueIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="issueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
      <filter id="issueGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#issueGrad)" strokeWidth="2.5" opacity="0.3" />
    <path d="M12 8v4M12 16h.01" stroke="url(#issueGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#issueGlow)" />
    <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="3 3">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="10s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const GateIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#gateGrad)" opacity="0.2" />
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#gateGrad)" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="6" r="2" fill="#10B981">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const BaselineIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="baselineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="4" rx="1" fill="url(#baselineGrad)" opacity="0.7" />
    <rect x="3" y="10" width="18" height="4" rx="1" fill="url(#baselineGrad)" opacity="0.5" />
    <rect x="3" y="16" width="18" height="4" rx="1" fill="url(#baselineGrad)" opacity="0.3" />
    <circle cx="19" cy="6" r="1.5" fill="#3B82F6" />
    <circle cx="19" cy="12" r="1.5" fill="#3B82F6" opacity="0.7" />
    <circle cx="19" cy="18" r="1.5" fill="#3B82F6" opacity="0.5" />
  </svg>
);

export const ContentIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="contentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <circle cx="8" cy="8" r="3" fill="url(#contentGrad)" opacity="0.6" />
    <circle cx="16" cy="8" r="3" fill="url(#contentGrad)" opacity="0.4" />
    <circle cx="8" cy="16" r="3" fill="url(#contentGrad)" opacity="0.4" />
    <circle cx="16" cy="16" r="3" fill="url(#contentGrad)" opacity="0.6" />
    <line x1="10" y1="9" x2="14" y2="15" stroke="url(#contentGrad)" strokeWidth="2" />
    <line x1="9" y1="11" x2="15" y2="14" stroke="url(#contentGrad)" strokeWidth="2" opacity="0.5" />
    <line x1="10" y1="15" x2="14" y2="9" stroke="url(#contentGrad)" strokeWidth="2" opacity="0.5" />
  </svg>
);

export const HistoryIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="historyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" stroke="url(#historyGrad)" strokeWidth="2.5" opacity="0.3" />
    <path d="M12 6v6l4 2" stroke="url(#historyGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 12 L2 10 L4 8" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 10 C4 7 6 4 12 4" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <circle cx="12" cy="12" r="2" fill="url(#historyGrad)" />
  </svg>
);

export const DesignChangeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="designGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <path d="M3 12 a9 9 0 0 1 18 0" stroke="url(#designGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M3 12 a9 9 0 0 0 18 0" stroke="url(#designGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
    <circle cx="12" cy="12" r="9" stroke="url(#designGrad)" strokeWidth="2" opacity="0.2" />
    <path d="M8 9 L12 12 L16 9" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 15 L12 12 L16 15" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

export const DocumentIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <rect x="5" y="3" width="14" height="18" rx="2" fill="url(#docGrad)" opacity="0.2" />
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="url(#docGrad)" strokeWidth="2" />
    <line x1="9" y1="9" x2="15" y2="9" stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="13" x2="15" y2="13" stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <line x1="9" y1="17" x2="12" y2="17" stroke="url(#docGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const BOMIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#bomGrad)" opacity="0.2" />
    <rect x="7" y="7" width="5" height="5" rx="1" fill="url(#bomGrad)" opacity="0.7" />
    <rect x="14" y="7" width="3" height="3" rx="0.5" fill="url(#bomGrad)" opacity="0.5" />
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill="url(#bomGrad)" opacity="0.5" />
    <rect x="12" y="14" width="5" height="5" rx="1" fill="url(#bomGrad)" opacity="0.7" />
    <path d="M9.5 12 L9.5 14 M15.5 10 L15.5 14 M12 14 L7 14" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SecurityIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#121770" />
      </linearGradient>
      <filter id="securityGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2 L4 6 L4 12 C4 16.5 7 20.5 12 22 C17 20.5 20 16.5 20 12 L20 6 L12 2Z" fill="url(#securityGrad)" opacity="0.3" />
    <path
      d="M12 2 L4 6 L4 12 C4 16.5 7 20.5 12 22 C17 20.5 20 16.5 20 12 L20 6 L12 2Z"
      stroke="url(#securityGrad)"
      strokeWidth="2"
      filter="url(#securityGlow)"
    />
    <path d="M9 12 L11 14 L15 10" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
