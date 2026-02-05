import React from 'react';
import { Box, Chip, ChipOwnProps, IconButton, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CommonFile } from 'api/file/file.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faX } from '@fortawesome/free-solid-svg-icons';

interface CustomChipProps {
  label: string;
  disabled?: boolean;
  file: CommonFile;
  onDelete?: (file: CommonFile) => void;
  onClick?: (file: CommonFile) => void;
  onView?: (file: CommonFile) => void;
  status?: Array<ChipOwnProps>;
  actions?: Array<{
    icon: React.ReactNode;
    onClick: (file: CommonFile) => void;
    tooltip?: string;
    disabled?: boolean;
  }>;
  sx?: object;
}

const ChipContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled'
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: disabled ? alpha(theme.palette.action.disabled, 0.12) : alpha(theme.palette.primary.main, 0.08),
  border: `1px solid ${disabled ? alpha(theme.palette.action.disabled, 0.26) : alpha(theme.palette.primary.main, 0.23)}`,
  borderRadius: theme.spacing(1),
  minHeight: 28,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  cursor: disabled ? 'default' : 'pointer',
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short
  }),
  '&:hover': {
    backgroundColor: disabled ? alpha(theme.palette.action.disabled, 0.12) : alpha(theme.palette.primary.main, 0.12),
    boxShadow: disabled ? 'none' : theme.shadows[1]
  },
  '&:focus-within': {
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    outlineOffset: 2
  }
}));

const LabelContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(1),
  overflow: 'hidden'
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25)
}));

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25)
}));

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'chipDisabled'
})<{ chipDisabled?: boolean }>(({ theme, chipDisabled }) => ({
  padding: theme.spacing(0.25),
  color: chipDisabled ? theme.palette.action.disabled : alpha(theme.palette.text.primary, 0.7),
  '&:hover': {
    backgroundColor: chipDisabled ? 'transparent' : alpha(theme.palette.action.hover, 0.08),
    color: chipDisabled ? theme.palette.action.disabled : theme.palette.text.primary
  }
  // '&:focus': {
  //   outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  //   outlineOffset: 1
  // }
}));

const CustomChip: React.FC<CustomChipProps> = ({
  label,
  disabled = false,
  file,
  onDelete,
  onClick,
  onView,
  actions = [],
  sx = {},
  status = []
}) => {
  const theme = useTheme();

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || file.isNew) return;
    onClick?.(file);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onDelete?.(file);
  };

  const handleActionClick = (e: React.MouseEvent, actionFn: (file: CommonFile) => void) => {
    e.stopPropagation();
    if (disabled) return;
    actionFn(file);
  };

  // Default actions based on props
  const defaultActions = [
    ...(onView
      ? [
          {
            icon: <FontAwesomeIcon icon={faEye} />,
            onClick: onView,
            tooltip: 'View',
            disabled: disabled || file.isNew
          }
        ]
      : []),
    ...actions
  ];

  return (
    <ChipContainer
      disabled={disabled}
      onClick={handleMainClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      sx={sx}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleMainClick(e as any);
        }
      }}
    >
      <LabelContainer>
        <Tooltip title={label}>
          <Typography
            variant="body2"
            sx={{
              color: disabled ? theme.palette.action.disabled : theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '0.8125rem',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
              // maxWidth: '200px'
            }}
            title={label}
          >
            {label}
          </Typography>
        </Tooltip>
      </LabelContainer>

      <StatusContainer>
        {status.map((el, index) => (
          <Chip key={`CustomChip-status-${index}`} label={el.label} color={el.color} size="small" />
        ))}
      </StatusContainer>

      <ActionsContainer>
        {defaultActions.map((action, index) => (
          <ActionButton
            key={index}
            size="small"
            chipDisabled={disabled || action.disabled}
            disabled={disabled || action.disabled}
            onClick={(e) => handleActionClick(e, action.onClick)}
            title={action.tooltip}
          >
            {action.icon}
          </ActionButton>
        ))}

        {onDelete && (
          <ActionButton size="small" chipDisabled={disabled} disabled={disabled} onClick={handleDelete} title="Delete">
            <FontAwesomeIcon icon={faX} />
          </ActionButton>
        )}
      </ActionsContainer>
    </ChipContainer>
  );
};

export default CustomChip;
