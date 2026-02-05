// material-ui
import { useTheme } from '@mui/material/styles';

const LogoIcon = ({ reverse, ...others }: { reverse?: boolean }) => {
  const theme = useTheme();
  return (
    <>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="44"
        height="44"
        viewBox="0 0 180 180"
        xmlSpace="preserve"
      >
        <path style={{ fill: theme.palette.error.main }} d="M62,132L62,132c-11.6,0-21-9.4-21-21V63h21V132z" />
        <path
          style={{ fill: theme.palette.grey.A800 }}
          d="M131.9,63v47.2c-0.4,1.8-1.9,4.9-7.3,4.9h-3.8h-2h-3.8c-7.4,0-7.5-8.2-7.5-8.2v2.3V109V63h-21v46v0.2V107
	c0,0-0.1,8.2-7.5,8.2h-5.9V132h5.9c0,0,2.6-0.1,5.9-0.9c7.4-1.7,12.2-5.9,12.2-5.9s5.2,4.3,12.2,5.9c3.3,0.8,5.9,0.9,5.9,0.9h3.8h2
	h11.1c11.6,0,21-9.4,21-21V63H131.9z"
        />
      </svg>
    </>
  );
};

export default LogoIcon;
