import React, { Fragment, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';

// project import
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import SimpleBar from 'components/third-party/SimpleBar';
import Transitions from 'components/@extended/Transitions';

//import useConfig from 'hooks/useConfig';

// assets
import { DownOutlined, GroupOutlined, UpOutlined } from '@ant-design/icons';

// types
import { NavItemType } from 'types/menu';
import { File } from 'lucide-react';
//import { MenuOrientation } from 'types/config';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface Props {
  item: NavItemType;
  lastItem: number;
  remItems: NavItemType[];
  lastItemId: string;
  setSelectedID: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedID: string | undefined;
  setSelectedItems: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedItems: string | undefined;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
  selectedLevel: number;
}

type VirtualElement = {
  getBoundingClientRect: () => ClientRect | DOMRect;
  contextElement?: Element;
};

const PopperStyled = styled(Popper)(({ theme }) => ({
  overflow: 'visible',
  zIndex: 1202,
  minWidth: 180,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 5,
    left: 'calc(50% - 6px)',
    width: 12,
    height: 12,
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 120,
    borderWidth: '6px',
    borderStyle: 'solid',
    borderColor: `${theme.palette.background.paper}  transparent transparent ${theme.palette.background.paper}`
  }
}));

const NavGroup = ({
  item,
  lastItem,
  remItems,
  lastItemId,
  selectedID,
  setSelectedID,
  setSelectedItems,
  selectedItems,
  setSelectedLevel,
  selectedLevel
}: Props) => {
  const theme = useTheme();
  const { pathname } = useLocation();

  //const { menuOrientation } = useConfig();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const [anchorEl, setAnchorEl] = useState<VirtualElement | (() => VirtualElement) | null | undefined>(null);
  const [currentItem, setCurrentItem] = useState(item);

  const openMini = Boolean(anchorEl);

  useEffect(() => {
    if (lastItem) {
      if (item.id === lastItemId) {
        const localItem: any = { ...item };
        const elements = remItems.map((ele: NavItemType) => ele.elements);
        localItem.children = elements.flat(1);
        setCurrentItem(localItem);
      } else {
        setCurrentItem(item);
      }
    }
  }, [item, lastItem, downLG]);

  const checkOpenForParent = (child: NavItemType[], id: string) => {
    child.forEach((ele: NavItemType) => {
      if (ele.children?.length) {
        checkOpenForParent(ele.children, currentItem.id!);
      }

      if (ele.url && !!matchPath({ path: ele?.link ? ele.link : ele.url, end: true }, pathname)) {
        setSelectedID(id);
      }
    });
  };

  const checkSelectedOnload = (data: NavItemType) => {
    const childrens = data.children ? data.children : [];
    childrens
      .filter((el) => !!el)
      .forEach((itemCheck: NavItemType) => {
        if (itemCheck?.children?.length) {
          checkOpenForParent(itemCheck.children, currentItem.id!);
        }

        if (itemCheck.url && !!matchPath({ path: itemCheck?.link ? itemCheck.link : itemCheck.url, end: true }, pathname)) {
          setSelectedID(currentItem.id!);
        }
      });
  };

  useEffect(() => {
    checkSelectedOnload(currentItem);
    if (openMini) setAnchorEl(null);
  }, [pathname, currentItem]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
    if (!openMini) {
      setAnchorEl(event?.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSelected = selectedID === currentItem.id;

  // const Icon = <FontAwesomeIcon icon={currentItem?.icon!} />; //currentItem?.icon!;
  const Icon = (currentItem?.icon as any)?.render();
  const itemIcon = currentItem?.icon ? Icon : <File size={16} />;

  /*<Icon
  style={{
    fontSize: 20,
    stroke: '1.5',
    color: isSelected ? theme.palette.primary.main : theme.palette.secondary.dark
  }}
/>

  const navCollapse = item.children?.map((menuItem, index) => {
    switch (menuItem.type) {
      case 'collapse':
      case 'D':
        return (
          <NavCollapse
            key={menuItem.id}
            menu={menuItem}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            level={1}
            parentId={currentItem.id!}
          />
        );
      case 'item':
      case 'M':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  }); */

  const moreItems = remItems.map((itemRem: NavItemType, i) => (
    <Fragment key={i}>
      {itemRem.url ? (
        <NavItem item={itemRem} level={1} />
      ) : (
        itemRem.title && (
          <Typography variant="caption" sx={{ pl: 2 }}>
            {itemRem.title} {itemRem.url}
          </Typography>
        )
      )}

      {itemRem?.elements?.map((menu) => {
        switch (menu.type) {
          case 'collapse':
          case 'D':
            return (
              <NavCollapse
                key={menu.id}
                menu={menu}
                level={1}
                parentId={currentItem.id!}
                setSelectedItems={setSelectedItems}
                setSelectedLevel={setSelectedLevel}
                selectedLevel={selectedLevel}
                selectedItems={selectedItems}
              />
            );
          case 'item':
          case 'M':
            return <NavItem key={menu.id} item={menu} level={1} />;
          default:
            return (
              <Typography key={menu.id} variant="h6" color="error" align="center">
                Menu Items Error
              </Typography>
            );
        }
      })}
    </Fragment>
  ));

  // menu list collapse & items
  const items = currentItem.children?.map((menu) => {
    switch (menu?.type) {
      case 'collapse':
      case 'D':
        return (
          <NavCollapse
            key={menu.id}
            menu={menu}
            level={1}
            parentId={currentItem.id!}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
          />
        );
      case 'item':
      case 'M':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu?.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const popperId = openMini ? `group-pop-${item.id}` : undefined;

  return (
    <>
      {/*menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <List subheader={<Divider sx={{ my: 0 }} />} sx={{ mt: 0, py: 0, zIndex: 0 }}>
          {navCollapse}
        </List>
      ) : (*/}
      <List>
        <ListItemButton
          selected={isSelected}
          sx={{
            py: 1,
            px: 1.5,
            my: 0, //0.5,
            ml: 0, //1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'inherit',
            color: 'text.primary',
            '&.Mui-selected': {
              bgcolor: downLG ? 'transparent' : 'primary.lighter'
            },
            '&:hover': {
              color: downLG ? 'transparent' : 'primary.main',
              bgcolor: downLG ? 'transparent' : 'primary.lighter'
            }
          }}
          onMouseEnter={handleClick}
          onClick={handleClick}
          onMouseLeave={handleClose}
          aria-describedby={popperId}
        >
          {itemIcon && (
            <Tooltip title={item.title} placement="right-start">
              <ListItemIcon
                sx={{
                  minWidth: downLG ? 'unset !important' : 28,
                  borderRadius: downLG ? 1.5 : undefined,
                  width: downLG ? 36 : undefined,
                  height: downLG ? 36 : undefined,
                  justifyContent: downLG ? 'center' : undefined,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter'
                  },
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                  }
                }}
              >
                {currentItem.id === lastItemId ? <GroupOutlined style={{ fontSize: 20, stroke: '1.5' }} /> : itemIcon}
              </ListItemIcon>
            </Tooltip>
          )}
          {!downLG &&
            (openMini ? (
              <>
                <ListItemText
                  sx={{ mr: 1 }}
                  primary={
                    <Typography
                      variant="h4"
                      color={isSelected ? theme.palette.primary.main : 'inherit'}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {currentItem.id === lastItemId ? <FormattedMessage id="more-items" /> : currentItem.title}
                    </Typography>
                  }
                />
                <DownOutlined style={{ fontSize: 12, stroke: '1.5' }} />
              </>
            ) : (
              <>
                <ListItemText
                  sx={{ mr: 1 }}
                  primary={
                    <Typography
                      variant="h4"
                      color={isSelected ? theme.palette.primary.main : 'inherit'}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {currentItem.id === lastItemId ? <FormattedMessage id="more-items" /> : currentItem.title}
                    </Typography>
                  }
                />
                <UpOutlined style={{ fontSize: 12, stroke: '1.5' }} />
              </>
            ))}
          {/*openMini ? <DownOutlined style={{ fontSize: 12, stroke: '1.5' }} /> : <UpOutlined style={{ fontSize: 12, stroke: '1.5' }} />*/}
          {anchorEl && (
            <PopperStyled
              id={popperId}
              open={openMini}
              anchorEl={anchorEl}
              placement="bottom"
              style={{
                zIndex: 2001
              }}
            >
              {({ TransitionProps }) => (
                <Transitions in={openMini} {...TransitionProps}>
                  <Paper
                    sx={{
                      mt: 0.5,
                      py: 1.25,
                      boxShadow: theme.shadows[8],
                      backgroundImage: 'none'
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <>
                        <SimpleBar
                          sx={{
                            minWidth: 200,
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 170px)'
                          }}
                        >
                          {currentItem.id !== lastItemId ? items : moreItems}
                        </SimpleBar>
                      </>
                    </ClickAwayListener>
                  </Paper>
                </Transitions>
              )}
            </PopperStyled>
          )}
        </ListItemButton>
      </List>
    </>
  );
};

export default NavGroup;
