// types
import { DefaultConfigProps, MenuOrientation, ThemeMode } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 10;
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;

// ==============================|| THEME CONFIG ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Public Sans', sans-serif`,
  fontSize: 'md',
  i18n: 'ko',
  menuOrientation: MenuOrientation.HORIZONTAL,
  miniDrawer: false,
  container: false,
  mode: ThemeMode.LIGHT,
  presetColor: 'theme8'
};

export const defaultConfig: Omit<DefaultConfigProps, 'i18n'> = {
  fontFamily: `'Public Sans', sans-serif`,
  fontSize: 'md',
  menuOrientation: MenuOrientation.HORIZONTAL,
  miniDrawer: false,
  container: false,
  mode: ThemeMode.LIGHT,
  presetColor: 'theme5'
};

export default config;
