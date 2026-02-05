import { faEnvelope, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, useTheme } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import IconButton from 'components/@extended/IconButton';
import { OpenIssueType } from 'pages/qms/open-issue';

interface OpenIssueEtcStatusRendererProps extends CustomCellRendererProps {
  onFileClick?: (data: OpenIssueType) => void;
  onCommentClick?: (data: OpenIssueType) => void;
}

const FONT_SIZE = '0.8rem';

export const OpenIssueEtcStatusRenderer = ({ data, onFileClick, onCommentClick }: OpenIssueEtcStatusRendererProps) => {
  const { palette } = useTheme();
  if (!data) return null;

  const fileHandler = () => {
    onFileClick?.(data);
  };

  const commentHandler = () => {
    onCommentClick?.(data);
  };

  return (
    <>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1} height={'100%'}>
        <IconButton
          sx={{
            width: 'fit-content',
            height: 'fit-content',
            p: 0,
            '&:hover': {
              '& > svg': {
                color: data.isFileYn === 'Y' ? palette.grey[600] : 'transparent'
              }
            }
          }}
          onClick={fileHandler}
        >
          <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color={data.isFileYn === 'Y' ? palette.grey[500] : 'transparent'} />
        </IconButton>
        <IconButton
          sx={{
            width: 'fit-content',
            height: 'fit-content',
            p: 0,
            '&:hover': {
              '& > svg': {
                color: data.isCommentYn === 'Y' ? palette.grey[600] : 'transparent'
              }
            }
          }}
          onClick={commentHandler}
        >
          <FontAwesomeIcon icon={faEnvelope} fontSize={FONT_SIZE} color={data.isCommentYn === 'Y' ? palette.grey[500] : 'transparent'} />
        </IconButton>
        {/* <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color="transparent" />
        <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color="transparent" /> */}
      </Box>
    </>
  );
};

export const OpenIssueEtcStatusHeader = () => {
  const { palette } = useTheme();
  return (
    <>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={1}>
        <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color={palette.grey[500]} />
        <FontAwesomeIcon icon={faEnvelope} fontSize={FONT_SIZE} color={palette.grey[500]} />
        {/* <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color={palette.grey[500]} />
        <FontAwesomeIcon icon={faFile} fontSize={FONT_SIZE} color={palette.grey[500]} /> */}
      </Box>
    </>
  );
};
