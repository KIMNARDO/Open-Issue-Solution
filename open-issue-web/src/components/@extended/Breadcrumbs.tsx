import { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Tooltip, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project import
import MainCard from 'components/MainCard';

// assets
import { ApartmentOutlined, HomeOutlined, HomeFilled } from '@ant-design/icons';

// types
import { OverrideIcon } from 'types/root';
import { NavItemType, NavType } from 'types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faDiagramProject, faHome } from '@fortawesome/free-solid-svg-icons';
import { useMenuList } from 'api/system/menu/useMenuService';
import { parseMenuItems } from 'api/system/menu/utils';
import useAuth from 'hooks/useAuth';

interface BreadcrumbLinkProps {
  title: string;
  to?: string;
  icon?: string | OverrideIcon;
}

// ==============================|| BREADCRUMBS ||============================== //

export interface BreadCrumbSxProps extends CSSProperties {
  mb?: string;
  bgcolor?: string;
}

interface Props {
  card?: boolean;
  custom?: boolean;
  divider?: boolean;
  heading?: string;
  icon?: boolean;
  icons?: boolean;
  links?: BreadcrumbLinkProps[];
  maxItems?: number;
  rightAlign?: boolean;
  separator?: OverrideIcon;
  title?: boolean;
  titleBottom?: boolean;
  sx?: BreadCrumbSxProps;
}

const Breadcrumbs = ({
  card = false,
  custom = false,
  divider = false,
  heading,
  icon,
  icons,
  links,
  maxItems,
  rightAlign,
  separator,
  title = true,
  titleBottom = true,
  sx,
  ...others
}: Props) => {
  const theme = useTheme();
  const location = useLocation();
  const [main, setMain] = useState<NavItemType | undefined>();
  const [item, setItem] = useState<NavItemType>();
  const [menuItems, setMenuItems] = useState<NavItemType[]>([]);

  const iconSX = {
    marginRight: theme.spacing(0.75),
    marginLeft: 0,
    width: '1rem',
    height: '1rem',
    color: theme.palette.secondary.main
  };

  let customLocation = location.pathname;

  const { data: menuList } = useMenuList();
  const { user } = useAuth();

  useEffect(() => {
    if (menuList && user) {
      setMenuItems(parseMenuItems(menuList, user).items);
    }
  }, [menuList, user]);

  useEffect(() => {
    menuItems.map((menu: NavItemType) => {
      if (menu.type && menu.type === 'group') {
        if (menu?.url && menu.url === customLocation) {
          setMain(menu);
          setItem(menu);
        } else {
          getCollapse(menu as { children: NavItemType[]; type?: NavType });
        }
      }
      return false;
    });
  });

  // set active item state
  const getCollapse = (menu: NavItemType) => {
    if (!custom && menu.children) {
      menu.children.filter((collapse: NavItemType) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse as { children: NavItemType[]; type?: NavType });
          if (collapse.url === customLocation) {
            setMain(collapse);
            setItem(collapse);
          }
        } else if (collapse.type && collapse.type === 'item') {
          // pathVar 처리 >> includes
          if (customLocation.includes(collapse.url as string)) {
            setMain(menu);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  // item separator
  const SeparatorIcon = separator!;
  const separatorIcon = separator ? <SeparatorIcon style={{ fontSize: '0.75rem', marginTop: 2 }} /> : '/';

  let mainContent;
  let itemContent;
  let breadcrumbContent: ReactElement = <Typography />;
  let itemTitle: NavItemType['title'] = '';
  let CollapseIcon;
  let ItemIcon;

  // collapse item
  if (!custom && main && main.type === 'collapse' && main.breadcrumbs === true) {
    CollapseIcon = main.icon ? <FontAwesomeIcon icon={main.icon} /> : <FontAwesomeIcon icon={faDiagramProject} />; //main.icon : ApartmentOutlined;
    mainContent = (
      <Typography
        component={Link}
        to={main.url as string}
        variant={window.location.pathname === main.url ? 'subtitle1' : 'h6'}
        sx={{ textDecoration: 'none' }}
        color={window.location.pathname === main.url ? 'text.primary' : 'text.secondary'}
      >
        {icons && CollapseIcon /*<CollapseIcon style={iconSX} /> */}
        {main.title}
      </Typography>
    );
    breadcrumbContent = (
      <MainCard
        border={card}
        sx={card === false ? { mb: 3, bgcolor: 'transparent', ...sx } : { mb: 3, ...sx }}
        {...others}
        content={card}
        shadow="none"
      >
        <Grid
          container
          direction={rightAlign ? 'row' : 'column'}
          justifyContent={rightAlign ? 'space-between' : 'flex-start'}
          alignItems={rightAlign ? 'center' : 'flex-start'}
          spacing={1}
        >
          <Grid item>
            <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
              <Typography component={Link} to="/dashboard" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                {icons && <HomeOutlined style={iconSX} />}
                {icon && !icons && <HomeFilled style={{ ...iconSX, marginRight: 0 }} />}
                {(!icon || icons) && 'Home'}
              </Typography>
              {mainContent}
            </MuiBreadcrumbs>
          </Grid>
          {title && titleBottom && (
            <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
              <Typography variant="h2">{main.title}</Typography>
            </Grid>
          )}
        </Grid>
        {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
      </MainCard>
    );
  }

  // items
  if ((item && item.type === 'item') || (item?.type === 'group' && item?.url) || custom) {
    let group;
    switch (JSON.stringify(item?.url).substring(2, 5)) {
      case 'pro':
        group = '프로젝트 원가 관리';
        break;
      case 'mas':
        group = '기준정보 관리';
        break;
      case 'sys':
        group = '시스템 관리';
        break;
      default:
        group = '';
    }
    itemTitle = item?.title;

    ItemIcon = item?.icon ? <FontAwesomeIcon icon={item.icon} /> : <FontAwesomeIcon icon={faDiagramProject} />; //item.icon : ApartmentOutlined;
    let groupContent = (
      <Typography variant="subtitle1" color="textSecondary" sx={{ textDecoration: 'none' }}>
        {group}
      </Typography>
    );
    itemContent = (
      <Typography variant="h6" color="textPrimary" fontWeight={600}>
        {icons && ItemIcon /*<ItemIcon style={iconSX} />*/}
        {itemTitle}
      </Typography>
    );
    let id = JSON.stringify(item?.id);
    let tempContent = (
      <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
        <Typography component={Link} to="/project/list" color="textSecondary" variant="subtitle1" sx={{ textDecoration: 'none' }}>
          {icons && <HomeOutlined style={iconSX} />}
          {icon && !icons && <HomeFilled style={{ ...iconSX, marginRight: 0 }} />}
          {(!icon || icons) && <FontAwesomeIcon icon={faHome} /> /*'Home'*/}
        </Typography>
        {mainContent}
        {id === '"list"' || id === '"profile"' ? null : groupContent}
        {itemContent}
      </MuiBreadcrumbs>
    );

    if (custom && links && links?.length > 0) {
      tempContent = (
        <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
          {links?.map((link: BreadcrumbLinkProps, index: number) => {
            CollapseIcon = link.icon ? link.icon : ApartmentOutlined;

            return (
              <Typography
                key={index}
                {...(link.to && { component: Link, to: link.to })}
                variant={!link.to ? 'subtitle1' : 'h6'}
                sx={{ textDecoration: 'none' }}
                color={!link.to ? 'text.primary' : 'text.secondary'}
              >
                {link.icon && <CollapseIcon style={iconSX} />}
                {link.title}
              </Typography>
            );
          })}
        </MuiBreadcrumbs>
      );
    }

    // main
    if (item?.breadcrumbs !== false || custom) {
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={
            card === false ? { pl: 1, mt: 2, mb: 1.5 /*mb: 3*/, bgcolor: 'transparent', ...sx } : { pl: 1, mt: 2, mb: 1.5 /*mb: 3*/, ...sx }
          }
          {...others}
          content={card}
          shadow="none"
        >
          <Grid
            container
            direction={'row'} //rightAlign ? 'row' : 'column'}
            justifyContent={'space-between'} //rightAlign ? 'space-between' : 'flex-start'}
            alignItems={rightAlign ? 'center' : 'flex-start'}
            spacing={1}
          >
            {/* {title && !titleBottom && (
              <Grid item>
                <Typography variant="h2">{custom ? heading : item?.title}</Typography>
              </Grid>
            )} */}
            <Grid item>{tempContent}</Grid>
            {/* {title && titleBottom && (
              <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
                <Typography variant="h2">{custom ? heading : item?.title}</Typography>
              </Grid>
            )} */}
            <Grid item sx={{ fontSize: '1.25rem', lineHeight: 0, color: theme.palette.primary.main, mr: 1 }}>
              <Tooltip title={`${itemTitle} 매뉴얼 준비중`}>
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Tooltip>
            </Grid>
          </Grid>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
