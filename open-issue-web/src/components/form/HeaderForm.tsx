import { useState } from 'react';
import { Box, IconButton, SxProps, Theme, Collapse } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface HeaderFormProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  collapse?: {
    defaultExpanded?: boolean;
    collapsible?: boolean;
    buttonPosition?: 'left' | 'center' | 'right';
  };
}

const COLLAPSE_BTN_SIZE = {
  height: 25,
  width: 60
};

const HeaderForm = ({ children, sx, collapse }: HeaderFormProps) => {
  const { defaultExpanded = true, collapsible = false, buttonPosition = 'center' } = collapse || {};

  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const getButtonPositionStyles = () => {
    const baseStyles = {
      bottom: expanded ? -COLLAPSE_BTN_SIZE.height : -(COLLAPSE_BTN_SIZE.height + 10),
      width: COLLAPSE_BTN_SIZE.width,
      height: COLLAPSE_BTN_SIZE.height
    };

    switch (buttonPosition) {
      case 'left':
        return {
          ...baseStyles,
          left: 16,
          transform: 'none'
        };
      case 'right':
        return {
          ...baseStyles,
          right: 16,
          transform: 'none'
        };
      case 'center':
      default:
        return {
          ...baseStyles,
          left: '50%',
          transform: 'translateX(-50%)'
        };
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: expanded ? 'auto' : 10,
        zIndex: 1000,
        ...sx
      }}
    >
      <Collapse in={expanded}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2
          }}
        >
          {children}
        </Box>
      </Collapse>

      {collapsible && (
        <Box
          sx={{
            position: 'relative',
            height: 0
          }}
        >
          <IconButton
            onClick={handleToggle}
            size="small"
            sx={{
              position: 'absolute',
              ...getButtonPositionStyles(),
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: '0 0 8px 8px',
              borderTop: 'none',

              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'grey.50'
              },
              transition: 'all 0.2s ease-in-out',
              zIndex: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                height: 2,
                backgroundColor: 'background.paper',
                zIndex: -1
              }
            }}
          >
            {expanded ? <FontAwesomeIcon icon={faChevronUp} size="lg" /> : <FontAwesomeIcon icon={faChevronDown} size="lg" />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default HeaderForm;
