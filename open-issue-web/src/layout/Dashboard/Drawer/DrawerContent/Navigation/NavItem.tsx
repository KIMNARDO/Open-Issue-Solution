import { Link, matchPath, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, ListItem, ListItemIcon, ListItemText, Tooltip, Typography, useMediaQuery } from '@mui/material';

// project import
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';

import useConfig from 'hooks/useConfig';
import { useGetMenuMaster } from 'api/common/menu'; // handlerDrawerOpen,

// types
import { MenuOrientation, ThemeMode } from 'types/config';
import { NavActionType, NavItemType } from 'types/menu';
import { File } from 'lucide-react';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
  item: NavItemType;
  level: number;
  isParents?: boolean;
}

const NavItem = ({ item, level, isParents = false }: Props) => {
  const theme = useTheme();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  // let itemTarget: LinkTarget = '_self';
  // if (item.target) {
  //   itemTarget = '_blank';
  // }

  const Icon = (item.icon as any)?.render(); //item.icon!;
  const itemIcon = item.icon ? (
    Icon
  ) : (
    <>
      <File size={16} />
    </>
    /*<Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem',
        ...(menuOrientation === MenuOrientation.HORIZONTAL && isParents && { fontSize: 20, stroke: '1.5' })
      }}
    />*/
  );

  // const { getActiveMenu } = useStackBar();
  const currentUrl = window.location.pathname;
  const match = matchPath({ path: item?.link ? item.link : item.url!, end: false }, currentUrl);
  const isSelected = !!match;
  const navigate = useNavigate();

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === ThemeMode.DARK ? 'text.primary' : 'primary.main';

  const handleListItemClick = () => {
    if (item.external) {
      window.open(item.url, '_blank');
      return;
    }

    if (item.url) {
      navigate(item.url);
    }

    // Tab handle
    // const findExistMenu = stackbarMenu.find((menu) => menu.id === item.id);

    // if (findExistMenu) {
    //   setActiveMenuId(item.id);
    // } else {
    //   setStackBarMenu([...stackbarMenu, { ...item, idx: stackbarMenu.length }]);
    //   setActiveMenuId(item.id);
    // }
  };

  return (
    <>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <Box sx={{ position: 'relative' }}>
          <ListItem
            onClick={handleListItemClick}
            sx={{
              cursor: 'pointer',
              zIndex: 1201,
              //pl: drawerOpen ? `${level * 21}px` : 1.5,
              py: 1, //!drawerOpen && level === 1 ? 1.25 : 1,
              px: 1.5,
              ...(!isParents && {
                '&:hover': {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter'
                },
                '&.Mui-selected': {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
                  borderRight: `2px solid ${theme.palette.primary.main}`,
                  color: iconSelectedColor,
                  '&:hover': {
                    color: iconSelectedColor,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter'
                  }
                }
              })
              /*...(!drawerOpen && {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                '&.Mui-selected': {
                  '&:hover': {
                    bgcolor: 'transparent'
                  },
                  bgcolor: 'transparent'
                }
              })*/
            }}
            /*{...(downLG && {
              onClick: () => handlerDrawerOpen(false)
            })}*/
          >
            {itemIcon && (
              <Tooltip title={item.title}>
                <ListItemIcon
                  sx={{
                    minWidth: 28,
                    color: isSelected ? iconSelectedColor : textColor,
                    ...(!drawerOpen && {
                      borderRadius: 1.5,
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'primary.lighter'
                      }
                    }),
                    ...(!drawerOpen &&
                      isSelected && {
                        color: 'primary.main',
                        bgcolor: isParents ? (theme.palette.mode === ThemeMode.DARK ? 'primary.900' : 'primary.lighter') : 'transparent',
                        '&:hover': {
                          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.darker' : 'primary.lighter'
                        }
                      })
                  }}
                >
                  {itemIcon}
                </ListItemIcon>
              </Tooltip>
            )}
            {!isParents && (
              //(drawerOpen || (!drawerOpen && level !== 1))
              <ListItemText
                primary={
                  <Typography
                    variant="h4"
                    sx={{
                      color: isSelected ? iconSelectedColor : textColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.title}
                  </Typography>
                }
              />
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
              <Chip
                color={item.chip.color}
                variant={item.chip.variant}
                size={item.chip.size}
                label={item.chip.label}
                avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
              />
            )}
          </ListItem>
          {(drawerOpen || (!drawerOpen && level !== 1)) &&
            item?.actions &&
            item?.actions.map((action, index) => {
              const ActionIcon = (action.icon as any)?.render(); //action.icon!;
              const callAction = action?.function;
              return (
                <IconButton
                  key={index}
                  {...(action.type === NavActionType.FUNCTION && {
                    onClick: (event) => {
                      event.stopPropagation();
                      callAction();
                    }
                  })}
                  {...(action.type === NavActionType.LINK && {
                    component: Link,
                    to: action.url,
                    target: action.target ? '_blank' : '_self'
                  })}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 20,
                    zIndex: 1202,
                    width: 20,
                    height: 20,
                    mr: -1,
                    ml: 1,
                    color: 'secondary.dark',
                    borderColor: isSelected ? 'primary.light' : 'secondary.light',
                    '&:hover': { borderColor: isSelected ? 'primary.main' : 'secondary.main' }
                  }}
                >
                  {ActionIcon}
                  {/*<ActionIcon style={{ fontSize: '0.625rem' }} />*/}
                </IconButton>
              );
            })}
        </Box>
      ) : (
        <ListItem
          onClick={handleListItemClick}
          sx={{
            cursor: 'pointer',
            zIndex: 1201,
            color: theme.palette.text.primary,
            '&:hover': {
              color: 'primary.main',
              bgcolor: 'primary.lighter'
            },
            ...(isParents && {
              p: 1,
              pr: 1, //2,
              mr: 0 //1
            }),
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              '&:hover': {
                bgcolor: 'primary.lighter'
              }
            }
          }}
        >
          {itemIcon && (
            <Tooltip title={item.title} placement="right-start">
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  ...(!drawerOpen && {
                    borderRadius: 1.5,
                    width: 28,
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    '&:hover': {
                      bgcolor: 'transparent'
                    }
                  }),
                  ...(!drawerOpen &&
                    isSelected && {
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'transparent'
                      }
                    })
                }}
              >
                {itemIcon}
              </ListItemIcon>
            </Tooltip>
          )}
          {!itemIcon && (
            <ListItemIcon
              sx={{
                color: isSelected ? 'primary.main' : 'secondary.dark',
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: 'primary.lighter',
                    '&:hover': {
                      bgcolor: 'primary.lighter'
                    }
                  })
              }}
            >
              <Dot size={4} color={isSelected ? 'primary' : 'secondary'} />
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level === 1)) && (
            <ListItemText
              primary={
                <Typography
                  variant="h4"
                  color={isSelected ? 'primary.main' : 'inherit'}
                  sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItem>
      )}
    </>
  );
};

export default NavItem;
