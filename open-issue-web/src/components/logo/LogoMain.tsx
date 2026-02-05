// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const LogoMain = ({ reverse, width, height, ...others }: { reverse?: boolean; width?: number; height?: number }) => {
  const theme = useTheme();
  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Mantis" width="100" />
     *
     */
    <>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        width={width || 196}
        height={height || 48}
        viewBox="0 10 850 180"
        xmlSpace="preserve"
      >
        <g>
          <path style={{ fill: theme.palette.error.main }} d="M62,132L62,132c-11.6,0-21-9.4-21-21V63h21V132z" />
          <path style={{ fill: theme.palette.error.main }} d="M403.5,132L403.5,132c-11.6,0-21-9.4-21-21V63h21V132z" />
          <path style={{ fill: theme.palette.error.main }} d="M502.5,114L502.5,114c-11.6,0-21-9.4-21-21V63h21V114z" />
          <path style={{ fill: theme.palette.error.main }} d="M188.5,132L188.5,132c-11.6,0-21-9.4-21-21V84c0-11.6,9.4-21,21-21h0V132z" />
          <path style={{ fill: theme.palette.error.main }} d="M296,132L296,132c-11.6,0-21-9.4-21-21V84c0-11.6,9.4-21,21-21h0V132z" />
        </g>
        <g>
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M131.9,63v47.2c-0.4,1.8-1.9,4.9-7.3,4.9h-3.8h-2h-3.8c-7.4,0-7.5-8.2-7.5-8.2v2.3V109V63h-21v46v0.2V107
		c0,0-0.1,8.2-7.5,8.2h-5.9V132h5.9c0,0,2.6-0.1,5.9-0.9c7.4-1.7,12.2-5.9,12.2-5.9s5.2,4.3,12.2,5.9c3.3,0.8,5.9,0.9,5.9,0.9h3.8h2
		h11.1c11.6,0,21-9.4,21-21V63H131.9z"
          />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M252.2,68.7c-5.3-3.9-13.3-5.7-19.1-5.7h0h-33.5v17h29.4c1.9,0.1,5.5,0.5,7.8,2.5c1.9,1.7,2.3,6.4,2.3,8.6v4.3
		v4.1v4.3c0,2.3-0.4,7-2.3,8.6c-2.3,2-5.9,2.5-7.8,2.5h-29.4v17H233h0c5.9,0,13.8-1.8,19.1-5.7c5.2-3.8,7.9-9.6,7.9-15.3V99.5v-4.1
		V84C260,78.3,257.4,72.5,252.2,68.7z"
          />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M359.7,68.7c-5.3-3.9-13.3-5.7-19.1-5.7h0H307v17h29.4c1.9,0.1,5.5,0.5,7.8,2.5c1.9,1.7,2.3,6.4,2.3,8.6v4.3
		v4.1v4.3c0,2.3-0.4,7-2.3,8.6c-2.3,2-5.9,2.5-7.8,2.5H307v17h33.5h0c5.9,0,13.8-1.8,19.1-5.7c5.2-3.8,7.9-9.6,7.9-15.3V99.5v-4.1
		V84C367.5,78.3,364.9,72.5,359.7,68.7z"
          />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M466.5,89.1c0,0,0.1-9.6-0.7-12.6h0C464.6,68.9,458,63,450,63h-36v17h25.6c1.9,0.1,7,0.6,7,5.1V90
		c0,0,0.4,3.3-1.4,5.1c0,0-1.8,1.4-5.4,1.9H414v17h26.5c1.4,0.1,5.1,1,5.1,7.7V132H466v-15.5c0,0,0-4.6-4-8.4c0,0-2.9-2.6-6.9-3.4
		c0,0,2.7-0.6,4.4-1.8l0,0C462.6,101.2,466.5,97.4,466.5,89.1z"
          />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M545,63v26.9c0,1.5-0.6,7.1-6.6,7.1H534h-0.3H513v35h21v-17.9c1.9,0.1,13.2,0.3,17.9-1.7l0,0
		c8.2-2.8,14.1-10.6,14.1-19.8V63H545z"
          />
          <path style={{ fill: theme.palette.grey.A800 }} d="M737.7,115.1V132h-48.6V63h21.3v52.1H737.7z" />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M820.5,63v69h-19.8V82.7L787.9,132h-13.5L761,82.7V132h-15.9V63h27.8L783,99.6l9.6-36.6H820.5z"
          />
          <path
            style={{ fill: theme.palette.grey.A800 }}
            d="M677.8,73.3c-2.3-3.5-5.3-6-9.1-7.7c-3.8-1.7-9.5-2.5-16.8-2.5h-7.5v15.8h7c5.8,0,8.7,2.2,8.7,6.5
		c0,4.6-3.1,6.9-9.4,6.9h-6.3v14.8h11.5c7.7,0,13.8-2,18.4-6.1c4.6-4,6.9-9.3,6.9-15.9C681.2,80.6,680,76.7,677.8,73.3z"
          />
          <polygon
            style={{ fill: theme.palette.grey.A800 }}
            points="634.2,104.1 634.2,89.4 634.2,77.8 634.2,63 613.9,63 613.9,132 634.2,132 634.2,116.6 	"
          />
        </g>
      </svg>
    </>
  );
};

export default LogoMain;
