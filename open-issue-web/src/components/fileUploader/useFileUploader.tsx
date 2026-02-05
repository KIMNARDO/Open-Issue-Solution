import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

// fileUploader
import FileUploaderSrc from 'react-drag-drop-files/dist/src/FileUploader';
import { FileUploader } from 'react-drag-drop-files';
import { Box, Chip, CircularProgress, Typography, useTheme } from '@mui/material';
import { commonNotification } from 'api/common/notification';
import { CommonFile } from 'api/file/file.types';
import { v4 } from 'uuid';
import { downloadBlob } from 'utils/commonUtils';
import CustomChip from 'components/chip/CustomChip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import PdfViewer from 'components/viewer/PdfViewer';
import ImageViewer from 'components/viewer/ImageViewer';
import fileService from 'api/file/fileService';

interface FileUploaderProps {
  name: string;
  multiple?: boolean;
  types?: string[];
  msg?: string;
  dropMsg?: string;
  displayFiles?: boolean;
  defaultFiles?: CommonFile[];
  handleDelete?: (file: CommonFile) => void;
  disabled?: boolean;
  isAccessible?: boolean;
  isLoading?: boolean;
}

const FileUploaderTyped: typeof FileUploaderSrc = FileUploader;

const FileDisplay = ({
  values,
  uploadedFile,
  handleDelete,
  handlePreview,
  setSelectedFiles,
  setUploadedFile,
  disabled,
  isAccessible
}: {
  values: CommonFile[];
  uploadedFile: Array<File> | undefined;
  setSelectedFiles: Dispatch<SetStateAction<CommonFile[]>>;
  handleDelete?: (file: CommonFile) => void;
  handlePreview?: (file: CommonFile) => void;
  setUploadedFile?: Dispatch<SetStateAction<Array<File> | undefined>>;
  disabled?: boolean;
  isAccessible?: boolean;
}) => {
  const handleDownload = (file: CommonFile) => {
    fileService.downloadFile(file.fileOid).then((res) => {
      downloadBlob(res.data, file.orgNm);
    });
  };

  const getActions = (
    file: CommonFile
  ): Array<{
    icon: React.ReactNode;
    onClick: (file: CommonFile) => void;
    tooltip?: string;
    disabled?: boolean;
  }> => {
    const resultActions: Array<{
      icon: React.ReactNode;
      onClick: (file: CommonFile) => void;
      tooltip?: string;
      disabled?: boolean;
    }> = [];

    // if (disabled) return resultActions;

    if (!file.isNew) {
      resultActions.push({
        icon: <FontAwesomeIcon icon={faEye} />,
        onClick: () => {
          if (file.isNew) return;
          handlePreview?.(file);
        },
        tooltip: '미리보기'
      });

      if (!isAccessible) return resultActions;
      resultActions.push({
        icon: <FontAwesomeIcon icon={faDownload} />,
        onClick: () => {
          if (file.isNew) return;
          handleDownload(file);
        },
        tooltip: '다운로드'
      });
    }

    return resultActions;
  };

  return (
    <>
      {values.map((el) => (
        <CustomChip
          file={el}
          label={el.orgNm}
          onDelete={
            el.isNew
              ? () => {
                  setSelectedFiles((prev) => prev.filter((file) => file.convNm !== el.convNm));
                  setUploadedFile?.((prev) =>
                    prev?.filter((file) => file.name !== el.orgNm && file.lastModified !== (el.lastModified || -1))
                  );
                }
              : disabled || !handleDelete
                ? undefined
                : () => {
                    if (disabled) return;
                    if (!el.fileOid || el.fileOid < 1) {
                      setSelectedFiles((prev) => prev.filter((file) => file.convNm !== el.convNm));
                      setUploadedFile?.((prev) =>
                        prev?.filter((file) => file.name !== el.orgNm && file.lastModified !== (el.lastModified || -1))
                      );
                      return;
                    }
                    handleDelete && handleDelete(el);
                  }
          }
          actions={getActions(el)}
          status={[{ label: el.ext.replace('.', ''), color: 'primary' }]}
        />
        // <Chip
        //   key={`filechip-${v4()}`}
        //   disabled={disabled}
        //   sx={{ marginRight: 1, marginBottom: 1, borderRadius: 1, minHeight: 28 }}
        //   label={el.originalFileNm}

        // />
      ))}
    </>
  );
};

/**
 *
 * @param name 파일 input 속성명
 * @returns uploadedFile: 업로드된 파일 state, FileUploader: fileUploader 컴포넌트
 */
const useFileUploader = ({
  name,
  multiple = false,
  types,
  msg = '클릭 또는 Drag&Drop으로 파일 등록',
  dropMsg = '드롭하여 업로드',
  displayFiles = false,
  defaultFiles,
  handleDelete,
  disabled = false,
  isAccessible = true,
  isLoading = false
}: FileUploaderProps) => {
  const [uploadedFile, setUploadedFile] = useState<Array<File> | undefined>();
  const [selectedFiles, setSelectedFiles] = useState<CommonFile[]>([]);
  const [previewFile, setPreviewFile] = useState<CommonFile | undefined>();
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { palette } = useTheme();

  const pdfExtension = ['.pdf'];
  const imageExtension = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

  const handlePreview = (file: CommonFile) => {
    setPreviewFile(file);
    setOpenPreviewDialog(true);
  };

  const handleChange = (file: File | Array<File> | File) => {
    if (!file) return;
    let currentFile: Array<File> = [];
    if (!('length' in file)) {
      currentFile = [file];
    } else {
      currentFile = Array.from(file);
    }
    const existArr: string[] = [];

    currentFile.forEach((el) => {
      if (uploadedFile?.find((targetEl) => targetEl.name === el.name)) {
        existArr.push(el.name);
      }
    });

    const selected = currentFile.filter((el) => !existArr.includes(el.name));
    const inputFiles: CommonFile[] = selected.map((file) => ({
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
    }));
    setSelectedFiles((prev) => [...prev, ...inputFiles]);
    setUploadedFile((prev) => [...(prev ?? []), ...selected]);
  };

  const onTypeError = (_arg: string) => {
    commonNotification.error('지원하지 않는 형식의 파일입니다');
  };

  const onSizeError = (_arg: string) => {
    commonNotification.error('파일 최대 크기를 초과하였습니다');
  };

  const reset = (files?: File[]) => {
    setUploadedFile(files);
    setSelectedFiles([]);
  };

  useEffect(() => {
    if (uploadedFile?.length === 1 && imageExtension.includes(`.${uploadedFile[0].name.split('.').pop()?.toLowerCase() ?? ''}`)) {
      setImagePreview(URL.createObjectURL(uploadedFile[0]));
    } else {
      setImagePreview(null);
    }
  }, [uploadedFile]);

  const FileUploader = useMemo(() => {
    const currentFiles = (defaultFiles ?? []).concat(selectedFiles);
    return (
      <>
        <FileUploaderTyped
          handleChange={handleChange}
          name={name}
          multiple={multiple}
          onTypeError={onTypeError}
          onSizeError={onSizeError}
          types={types}
          //dropMessageStyle={{
          //  backgroundColor: palette.primary.lighter,
          //  borderColor: palette.primary.dark,
          //  borderStyle: 'solid',
          //  borderWidth: '1px',
          //  color: palette.primary.main,
          //  flex: '1 1 300px'
          //}}
          hoverTitle={dropMsg}
          classes="fileUploaderLabel"
          disabled={disabled}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: disabled ? palette.grey[50] : palette.primary.lighter,
              borderColor: disabled ? palette.grey[400] : palette.primary.main,
              borderStyle: 'dashed',
              borderWidth: '1px',
              borderRadius: '4px',
              rowGap: 5,
              padding: '0px 5px'
            }}
          >
            <FontAwesomeIcon
              size="3x"
              color={disabled ? palette.grey[400] : palette.primary.main}
              icon={faCloudUpload}
              style={{ opacity: 0.7, padding: 10 }}
            />
            <Typography variant="button" sx={{ color: disabled ? palette.grey[400] : palette.primary.main, pb: 1 }}>
              {msg}
            </Typography>
          </div>
        </FileUploaderTyped>
        {displayFiles && currentFiles.length > 0 && (
          <Box
            flex={1}
            justifyContent="start"
            display="flex"
            flexBasis="50%"
            flexGrow={0}
            flexShrink={2}
            ml={1}
            rowGap={0}
            flexDirection="column"
            overflow={'auto'}
            height={'100%'}
            padding={1}
          >
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <FileDisplay
                values={currentFiles}
                uploadedFile={uploadedFile}
                handleDelete={handleDelete}
                handlePreview={handlePreview}
                setSelectedFiles={setSelectedFiles}
                setUploadedFile={setUploadedFile}
                disabled={disabled}
                isAccessible={isAccessible}
              />
            )}
          </Box>
        )}
        {previewFile && (
          <>
            {pdfExtension.includes(previewFile.ext?.toLowerCase() ?? '') && (
              <PdfViewer selectedFile={previewFile} open={openPreviewDialog} setOpen={setOpenPreviewDialog} />
            )}
            {imageExtension.includes(previewFile.ext?.toLowerCase() ?? '') && (
              <ImageViewer src={previewFile} open={openPreviewDialog} setOpen={setOpenPreviewDialog} />
            )}
          </>
        )}
      </>
    );
  }, [uploadedFile, selectedFiles, defaultFiles, openPreviewDialog, previewFile, setOpenPreviewDialog]);

  return { FileUploader, uploadedFile, reset, imagePreview };
};

export default useFileUploader;
