import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb={{ xs: "20px", sm: "25px", md: "30px" }}>
      {/* Title with responsive font sizes */}
      <Typography
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ 
          margin: "0 0 8px 0",
          // Responsive font sizes
          fontSize: {
            xs: "1.75rem",  // Mobile: ~28px
            sm: "2.125rem", // Small: ~34px  
            md: "2.5rem",   // Medium: ~40px
            lg: "2.75rem"   // Large: ~44px
          },
          // Responsive line height
          lineHeight: {
            xs: 1.2,
            sm: 1.3,
            md: 1.4
          },
          // Optional: letter spacing for better readability
          letterSpacing: {
            xs: "-0.5px",
            sm: "-0.25px",
            md: "normal"
          }
        }}
      >
        {title}
      </Typography>

      {/* Subtitle with responsive font sizes */}
      <Typography 
        color={colors.greenAccent[400]}
        sx={{
          // Responsive font sizes for subtitle
          fontSize: {
            xs: "0.875rem",  // Mobile: ~14px
            sm: "1rem",      // Small: ~16px
            md: "1.125rem",  // Medium: ~18px
            lg: "1.25rem"    // Large: ~20px
          },
          // Responsive line height
          lineHeight: {
            xs: 1.4,
            sm: 1.5,
            md: 1.6
          },
          // Optional: font weight variation
          fontWeight: {
            xs: 400,
            md: 500
          },
          // Optional: opacity for subtle effect
          opacity: 0.9
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;