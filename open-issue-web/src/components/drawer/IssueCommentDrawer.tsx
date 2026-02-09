import React, { forwardRef, JSXElementConstructor, useImperativeHandle, useRef, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  useTheme,
  Stack,
  Tab,
  Tabs
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRotateBackward, faUser } from '@fortawesome/free-solid-svg-icons';
import { OpenIssueType } from 'pages/qms/qms/open-issue';
import { useOpenIssueCommentList, useRegistComment, useRemoveComment, useUpdateComment, useActivityLog } from 'api/qms/open-issue/useOpenIssueService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';
import dayjs from 'dayjs';
import { Edit, Edit2, Trash2, X } from 'lucide-react';
import { confirmation } from 'components/confirm/CommonConfirm';
import useAuth from 'hooks/useAuth';
import ActivityTimeline from 'components/timeline/ActivityTimeline';

interface IssueCommentDrawerProps {
  issue?: OpenIssueType;
  width?: number;
  refetchIssues: () => void;
  Actions?: JSXElementConstructor<any>;
}

export interface IssueCommentDrawerRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const IssueCommentDrawer = forwardRef<IssueCommentDrawerRef, IssueCommentDrawerProps>(
  ({ issue, width = 480, refetchIssues, Actions }, ref) => {
    // 상태 관리
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newOpinion, setNewOpinion] = useState<string>('');
    const [updatingCommentId, setUpdatingCommentId] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<number>(0);
    const updateInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    const { palette } = useTheme();

    // 유저 비교
    const isSameWithCurrentUser = (target: number) => {
      return user?.oid === target;
    };

    const { data: commentList, isFetching, refetch } = useOpenIssueCommentList(issue?.oid ?? -1);
    const { data: activityLogs } = useActivityLog(issue?.oid ?? -1);

    const { mutate: registComment, isPending } = useRegistComment();
    const { mutate: updateComment } = useUpdateComment();
    const { mutate: removeComment } = useRemoveComment();

    // ref를 통한 외부 접근 허용
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      isOpen
    }));

    // 의견 제출
    const handleSubmitOpinion = async () => {
      if (!newOpinion.trim()) {
        commonNotification.warn('의견을 입력해주세요.');
        return;
      }

      registComment(
        {
          openIssueOid: issue?.oid ?? -1,
          comment: newOpinion
        },
        {
          onSuccess: () => {
            commonNotification.success('의견이 등록되었습니다.');
            setNewOpinion('');
            refetch();
            refetchIssues();
          },
          onError: (error) => handleServerError(error)
        }
      );
    };

    const handleRemoveOpinion = async (commentId: number) => {
      const res = await confirmation({ title: '의견 삭제', msg: '해당 의견을 삭제하시겠습니까?' });
      if (!res) return;

      removeComment(commentId, {
        onSuccess: () => {
          commonNotification.success('삭제되었습니다');
          refetch();
        },
        onError: handleServerError
      });
    };

    const handleUpdateOpinion = () => {
      const newComment = updateInputRef.current?.value;
      if (!newComment) return;
      updateComment(
        { oid: updatingCommentId, comment: newComment },
        {
          onSuccess: () => {
            commonNotification.success('저장되었습니다');
            setUpdatingCommentId(0);
            refetch();
          },
          onError: handleServerError
        }
      );
    };

    return (
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setNewOpinion('');
          setUpdatingCommentId(0);
        }}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box',
            paddingTop: '60px'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* 헤더 */}
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" component="h2">
              의견 조회 및 입력
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={loadOpinions} disabled={isLoading} size="small">
                <FontAwesomeIcon icon={faRotateBackward} />
              </IconButton>
              <IconButton onClick={() => setIsOpen(false)} size="small">
                <FontAwesomeIcon icon={faClose} />
              </IconButton>
            </Stack>
          </Box> */}

          {/* 이슈 ID 표시 */}
          <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip label={`Issue No: ${issue?.issueNo ?? ''}`} variant="outlined" size="small" />
            <Stack flexDirection={'row'}>
              <IconButton
                onClick={() => {
                  refetch();
                }}
                disabled={isFetching}
                size="small"
              >
                <FontAwesomeIcon icon={faRotateBackward} />
              </IconButton>
              {Actions && <Actions />}
            </Stack>
          </Box>

          {/* 탭 헤더 */}
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{ px: 2, minHeight: 36, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`의견 (${commentList?.length ?? 0})`} sx={{ minHeight: 36, py: 0.5, fontSize: 13 }} />
            <Tab label={`활동이력 (${activityLogs?.length ?? 0})`} sx={{ minHeight: 36, py: 0.5, fontSize: 13 }} />
          </Tabs>

          {/* 탭 콘텐츠 */}
          {activeTab === 0 ? (
            <>
              {/* 스크롤 가능한 컨텐츠 영역 - 의견 탭 */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, pt: 1, display: 'flex', flexDirection: 'column' }}>
                {/* 기준 데이터 섹션 */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    오픈이슈 내용
                  </Typography>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      maxHeight: 200,
                      overflow: 'auto'
                    }}
                  >
                    {issue?.description || '데이터 없음'}
                  </Typography>
                </Paper>

                {/* 의견 목록 섹션 */}
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  의견 목록 ({commentList?.length ?? 0})
                </Typography>

                {isFetching ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    의견을 불러오는 중...
                  </Typography>
                ) : commentList?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    아직 등록된 의견이 없습니다.
                  </Typography>
                ) : (
                  <List sx={{ p: 0, overflow: 'auto' }}>
                    {commentList?.map((opinion, index) => (
                      <React.Fragment key={`oissue-comment-${opinion.oid}`}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, width: '100%' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              width: '100%'
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <FontAwesomeIcon icon={faUser} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {opinion.createUsNm}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {dayjs(opinion.createDt).format('YYYY-MM-DD HH:mm:ss')}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <>
                                  {opinion.oid === updatingCommentId ? (
                                    <Box sx={{ position: 'relative' }}>
                                      <TextField
                                        inputRef={updateInputRef}
                                        defaultValue={opinion.comment}
                                        multiline
                                        minRows={1}
                                        maxRows={5}
                                        InputProps={{
                                          sx: {
                                            width: '100%',
                                            height: '100%'
                                          }
                                        }}
                                        sx={{ width: '100%', height: 'auto' }}
                                      />
                                      <Box sx={{ position: 'absolute', bottom: 10, right: 25 }}>
                                        <IconButton onClick={handleUpdateOpinion}>
                                          <Edit2 color={palette.primary.main} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => {
                                            setUpdatingCommentId(0);
                                          }}
                                        >
                                          <X color={palette.primary.main} />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.5 }} whiteSpace="pre-line">
                                      {opinion.comment}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                          </Box>
                          {isSameWithCurrentUser(opinion.createUs ?? -1) && (
                            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                              <IconButton
                                onClick={() => {
                                  setUpdatingCommentId(opinion.oid);
                                }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleRemoveOpinion(opinion.oid);
                                }}
                              >
                                <Trash2 color={palette.error.main} />
                              </IconButton>
                            </Box>
                          )}
                        </ListItem>
                        {index < commentList.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>

              {/* 의견 입력란 (하단 고정) */}
              <Box
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="의견을 입력해주세요..."
                  value={newOpinion}
                  onChange={(e) => setNewOpinion(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2, whiteSpace: 'pre-line' }}
                  InputProps={{
                    sx: {
                      height: '100%'
                    }
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                  onClick={handleSubmitOpinion}
                  disabled={!newOpinion.trim() || isPending}
                >
                  {isPending ? '전송 중...' : '의견 등록'}
                </Button>
              </Box>
            </>
          ) : (
            /* 활동이력 탭 */
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <ActivityTimeline logs={activityLogs || []} />
            </Box>
          )}
        </Box>
      </Drawer>
    );
  }
);

IssueCommentDrawer.displayName = 'IssueCommentDrawer';

export default IssueCommentDrawer;
