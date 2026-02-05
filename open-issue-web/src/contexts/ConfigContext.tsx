import { createContext, ReactNode } from 'react';

// project import
import config from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { CustomizationProps, FontFamily, FontSizeMode, I18n, MenuOrientation, PresetColor, ThemeMode } from 'types/config';

// initial state
const initialState: CustomizationProps = {
  ...config,
  onChangeContainer: () => {},
  onChangeLocalization: (lang: I18n) => {},
  onChangeMode: (mode: ThemeMode) => {},
  onChangePresetColor: (theme: PresetColor) => {},
  onChangeMiniDrawer: (miniDrawer: boolean) => {},
  onChangeMenuOrientation: (menuOrientation: MenuOrientation) => {},
  onChangeFontFamily: (fontFamily: FontFamily) => {},
  onChangeFontSize: () => {},
  resetConfig: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useLocalStorage('wooryplm-config', initialState);

  const onChangeContainer = () => {
    setConfig({
      ...config,
      container: !config.container
    });
  };

  const onChangeLocalization = (lang: I18n) => {
    setConfig({
      ...config,
      i18n: lang
    });
  };

  const onChangeMode = (mode: ThemeMode) => {
    setConfig({
      ...config,
      mode
    });
  };

  const onChangePresetColor = (theme: PresetColor) => {
    setConfig({
      ...config,
      presetColor: theme
    });
  };

  const onChangeMiniDrawer = (miniDrawer: boolean) => {
    setConfig({
      ...config,
      miniDrawer
    });
  };

  const onChangeMenuOrientation = (layout: MenuOrientation) => {
    setConfig({
      ...config,
      menuOrientation: layout
    });
  };

  const onChangeFontFamily = (fontFamily: FontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  };

  const onChangeFontSize = (fontSize: FontSizeMode) => {
    setConfig({
      ...config,
      fontSize
    });
  };

  const resetConfig = () => {
    setConfig(initialState);
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeContainer,
        onChangeLocalization,
        onChangeMode,
        onChangePresetColor,
        onChangeMiniDrawer,
        onChangeMenuOrientation,
        onChangeFontFamily,
        onChangeFontSize,
        resetConfig
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };
