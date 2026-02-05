import { RouterProvider } from 'react-router-dom';

import router from 'routes';
import ThemeCustomization from 'themes';

// import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MountPoint } from 'components/confirm/CommonConfirm';
import Locales from 'components/Locales';
import { koKR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ko';

// AG Grid Enterprise 모듈 등록 (Open Issue는 Charts/SpreadJS 불필요)
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

LicenseManager.setLicenseKey(
  'Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-079077}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Papsnet}_is_granted_a_{Multiple_Applications}_Developer_License_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Charts_and_AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{12_March_2026}____[v3]_[0102]_MTc3MzI3MzYwMDAwMA==eb3e9520f285ca618152d5c8b7fea066'
);
// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchInterval: false,
      refetchOnWindowFocus: false
    },
    mutations: {}
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeCustomization>
        <Locales>
          <ScrollTop>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={'ko'}
              localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
            >
              <AuthProvider>
                <Notistack>
                  <MountPoint />
                  <RouterProvider router={router} future={{ v7_startTransition: true }} />
                  <Snackbar />
                </Notistack>
              </AuthProvider>
            </LocalizationProvider>
          </ScrollTop>
        </Locales>
      </ThemeCustomization>
    </QueryClientProvider>
  );
};

export default App;
