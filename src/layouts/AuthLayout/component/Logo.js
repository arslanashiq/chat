import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src={`https://builder-templates-bucket.s3.amazonaws.com/618917807157da27fe740d98/assets/menu-logo.png`} sx={{ width: 80, ...sx }} />;
}
