import { faDownload, faEye, faFileAlt, faPrint, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { commonNotification } from 'api/common/notification';
import { CommonFile } from 'api/file/file.types';
import fileService from 'api/file/fileService';
import CommonButton from 'components/buttons/CommonButton';
import { Dispatch, SetStateAction } from 'react';
import { downloadBlob, printPDFBlob } from 'utils/commonUtils';
import { v4 } from 'uuid';

interface FileListProps {
  files: CommonFile[];
  selectedFile: CommonFile | undefined;
  addedFile?: File[];
  setAddedFile?: (file: File[]) => void;
  setSelectedFile: Dispatch<SetStateAction<CommonFile | undefined>>;
  openHistoryDialog?: () => void;
  openPdfDialog?: () => void;
  openImageDialog?: () => void;
  handleDeleteFile?: (file: CommonFile) => void;
  isAccessible?: boolean;
  isDeleteable?: boolean;
}

const FileDisplay = ({
  file,
  handleDownload,
  handleSelect,
  handleViewHistory,
  handleViewPdf,
  handleViewImage,
  handleDeleteFile,
  addedFile,
  setAddedFile,
  isSelected,
  isAccessible,
  isDeleteable
}: {
  file: CommonFile;
  handleDownload: (file: CommonFile) => void;
  handleSelect: () => void;
  handleViewHistory?: () => void;
  handleViewPdf?: () => void;
  handleViewImage?: () => void;
  handleDeleteFile?: (file: CommonFile) => void;
  addedFile?: File[];
  setAddedFile?: (file: File[]) => void;
  isSelected: boolean;
  isAccessible?: boolean;
  isDeleteable?: boolean;
}) => {
  const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

  return (
    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isSelected ? theme.palette.grey[300] : 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.grey[200]
        },
        oveflow: 'hidden',
        width: '100%'
      })}
      onClick={handleSelect}
    >
      <Tooltip title={file.orgNm}>
        <Typography
          variant="body1"
          color={file.isNew ? 'primary' : 'inherit'}
          sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 5 }} />
          {file.orgNm}
        </Typography>
      </Tooltip>
      <Stack flexDirection="row" gap={1} sx={{ flex: '0 1 fit-content' }}>
        {(file.isNew || (handleDeleteFile && isDeleteable)) && (
          <IconButton
            aria-label="delete"
            title="Delete"
            color="error"
            onClick={() => {
              if (file.isNew) {
                const targetIdx = addedFile?.findIndex((el) => el.name === file.orgNm && el.lastModified === file.lastModified);
                if (targetIdx !== undefined) {
                  setAddedFile?.((addedFile ?? []).filter((_, idx) => idx !== targetIdx));
                }
                return;
              }
              handleDeleteFile?.(file);
            }}
          >
            <FontAwesomeIcon icon={faX} />
          </IconButton>
        )}
        {!file.isNew && (
          <>
            {isAccessible && (
              <IconButton aria-label="download" title="Download" color="primary" onClick={() => handleDownload(file)}>
                <FontAwesomeIcon icon={faDownload} />
              </IconButton>
            )}
            {file.ext?.toLowerCase().replaceAll('.', '') === 'pdf' && (
              <>
                {isAccessible && (
                  <IconButton
                    aria-label="print"
                    title="Print"
                    color="primary"
                    onClick={() => {
                      fileService
                        .downloadFile(file.fileOid)
                        .then((res) => {
                          printPDFBlob(res.data);
                        })
                        .catch((_err) => {
                          commonNotification.error('파일을 찾을 수 없습니다');
                        });
                    }}
                  >
                    <FontAwesomeIcon icon={faPrint} />
                  </IconButton>
                )}
                {handleViewPdf && (
                  <IconButton aria-label="preview" title="View" color="primary" onClick={handleViewPdf}>
                    <FontAwesomeIcon icon={faEye} />
                  </IconButton>
                )}
              </>
            )}
            {IMAGE_EXT.includes(file.ext?.toLowerCase().replaceAll('.', '')) && handleViewImage && (
              <IconButton aria-label="preview" title="View" color="primary" onClick={handleViewImage}>
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            )}
            {handleViewHistory && <CommonButton title="이력 확인" variant="standard" onClick={handleViewHistory} size="small" />}
          </>
        )}
      </Stack>
    </Box>
  );
};

const FileList = ({
  files,
  selectedFile,
  addedFile,
  setAddedFile,
  setSelectedFile,
  openHistoryDialog,
  openPdfDialog,
  openImageDialog,
  isAccessible = true,
  isDeleteable = false,
  handleDeleteFile
}: FileListProps) => {
  const handleDownload = (file: CommonFile) => {
    fileService.downloadFile(file.fileOid).then((res) => {
      downloadBlob(res.data, file.orgNm);
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {files
        .concat(
          addedFile?.map((file) => ({
            oid: -1,
            fileOid: -1,
            ext: file.name.split('.').pop() ?? '',
            fileSize: file.size,
            type: '',
            orgNm: file.name,
            convNm: v4(),
            useAt: 'Y',
            lastModified: file.lastModified,
            isNew: true
          })) ?? []
        )
        .map((file) => (
          <FileDisplay
            key={`${file.fileOid}`}
            file={file}
            isSelected={selectedFile === file}
            addedFile={addedFile}
            setAddedFile={setAddedFile}
            handleDownload={handleDownload}
            handleSelect={() => setSelectedFile(file)}
            handleViewHistory={openHistoryDialog}
            handleViewPdf={openPdfDialog}
            handleViewImage={openImageDialog}
            isAccessible={isAccessible}
            isDeleteable={isDeleteable}
            handleDeleteFile={handleDeleteFile}
          />
        ))}
      {!files ||
        (files.length < 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="textSecondary">
              파일이 없습니다
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default FileList;
