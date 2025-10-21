import { 
  Box, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  InputBase,
  Tooltip
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";
import HelpIcon from "@mui/icons-material/Help";
import { useSearch } from "../../context/searchContext";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  const [searchValue, setSearchValue] = useState("");
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  
  const { handleSearch } = useSearch();

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      handleSearch(searchValue);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchValue.trim()) {
      handleSearch(searchValue);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchor(null);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    handleSearch("");
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: "New transaction completed", time: "5 min ago", type: "success" },
    { id: 2, text: "System update available", time: "1 hour ago", type: "info" },
    { id: 3, text: "Failed transaction alert", time: "2 hours ago", type: "error" },
    { id: 4, text: "New user registration", time: "3 hours ago", type: "info" },
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return colors.greenAccent[500];
      case 'error': return colors.redAccent[500];
      case 'info': return colors.blueAccent[500];
      default: return colors.grey[500];
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      p={isMobile ? 1.5 : 2}
      sx={{
        backgroundColor: colors.primary[400],
        borderBottom: `1px solid ${colors.primary[500]}`,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: isMobile ? '64px' : '72px',
        backdropFilter: 'blur(10px)',
        boxShadow: `0 2px 10px ${colors.primary[900]}`
      }}
    >
      {/* SEARCH BAR */}
      <Box
        display="flex"
        alignItems="center"
        backgroundColor={colors.primary[600]}
        borderRadius="12px"
        sx={{
          width: isMobile ? "auto" : isTablet ? "280px" : "400px",
          minWidth: isMobile ? "auto" : "200px",
          transition: "all 0.3s ease",
          '&:focus-within': {
            boxShadow: `0 0 0 2px ${colors.greenAccent[500]}33`,
            backgroundColor: colors.primary[500],
          },
          flex: isMobile ? 1 : 'none',
          mr: isMobile ? 1 : 0
        }}
      >
        <InputBase 
          sx={{ 
            ml: 2, 
            flex: 1,
            color: colors.grey[100],
            fontSize: isMobile ? '0.875rem' : '1rem',
            '&::placeholder': {
              color: colors.grey[400],
              opacity: 1,
            },
            py: 0.5
          }} 
          placeholder={isMobile ? "Search..." : "Search transactions, services, users..."}
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        {searchValue && (
          <IconButton 
            size="small"
            onClick={handleClearSearch}
            sx={{ 
              color: colors.grey[400],
              '&:hover': {
                color: colors.grey[100],
              }
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              ✕
            </Typography>
          </IconButton>
        )}
        <IconButton 
          type="button" 
          sx={{ 
            p: 1,
            color: searchValue ? colors.greenAccent[500] : colors.grey[400],
            '&:hover': {
              color: colors.greenAccent[500],
              backgroundColor: 'transparent',
            }
          }} 
          onClick={handleSearchClick}
          disabled={!searchValue.trim()}
        > 
          <SearchIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>

      {/* ICONS SECTION */}
      <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1.5}>
        {/* Theme Toggle */}
        <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton 
            onClick={colorMode.toggleColorMode}
            sx={{
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.primary[500],
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
              p: isMobile ? 0.75 : 1,
            }}
          >
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
            ) : (
              <DarkModeOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
            )}
          </IconButton>
        </Tooltip>

        {/* Messages - Hidden on mobile */}
        {!isMobile && (
          <Tooltip title="Messages">
            <IconButton
              sx={{
                color: colors.grey[100],
                '&:hover': {
                  backgroundColor: colors.primary[500],
                },
                p: isMobile ? 0.75 : 1,
              }}
            >
              <Badge 
                badgeContent={2} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: colors.redAccent[500],
                    color: colors.grey[100],
                    fontSize: '0.7rem',
                  }
                }}
              >
                <EmailIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton 
            onClick={handleNotificationsMenuOpen}
            sx={{
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.primary[500],
              },
              p: isMobile ? 0.75 : 1,
            }}
          >
            <Badge 
              badgeContent={4} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: colors.redAccent[500],
                  color: colors.grey[100],
                  fontSize: '0.7rem',
                }
              }}
            >
              <NotificationsOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              mt: 1,
              minWidth: '320px',
              maxWidth: '400px',
              maxHeight: '400px',
              overflow: 'auto',
              border: `1px solid ${colors.primary[500]}`,
              borderRadius: '12px',
              boxShadow: `0 8px 32px ${colors.primary[900]}`
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${colors.primary[500]}` }}>
            <Typography variant="h6" fontWeight="600">
              Notifications
            </Typography>
            <Typography variant="body2" color={colors.grey[400]}>
              4 new notifications
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleNotificationsMenuClose}
              sx={{
                borderBottom: `1px solid ${colors.primary[500]}`,
                '&:hover': {
                  backgroundColor: colors.primary[500],
                },
                py: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: getNotificationColor(notification.type),
                    mt: 0.5,
                    mr: 2 
                  }} 
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" color={colors.grey[400]}>
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
          <MenuItem 
            sx={{ 
              justifyContent: 'center',
              color: colors.greenAccent[400],
              '&:hover': {
                backgroundColor: colors.primary[500],
              }
            }}
          >
            <Typography variant="body2" fontWeight="500">
              View All Notifications
            </Typography>
          </MenuItem>
        </Menu>

        {/* Help - Hidden on mobile */}
        {!isMobile && (
          <Tooltip title="Help & Support">
            <IconButton
              sx={{
                color: colors.grey[100],
                '&:hover': {
                  backgroundColor: colors.primary[500],
                },
                p: isMobile ? 0.75 : 1,
              }}
            >
              <HelpIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        )}

        {/* Profile */}
        <Tooltip title="Account settings">
          <IconButton 
            onClick={handleProfileMenuOpen}
            sx={{
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.primary[500],
              },
              p: 0.5,
              ml: isMobile ? 0.5 : 1,
            }}
          >
            <Avatar 
              sx={{
                width: isMobile ? 32 : 36,
                height: isMobile ? 32 : 36,
                backgroundColor: colors.greenAccent[500],
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 'bold',
                border: `2px solid ${colors.primary[300]}`,
              }}
              src="../../assets/user-avatar.png"
            >
              A
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              mt: 1,
              minWidth: '200px',
              border: `1px solid ${colors.primary[500]}`,
              borderRadius: '12px',
              boxShadow: `0 8px 32px ${colors.primary[900]}`
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${colors.primary[500]}` }}>
            <Typography variant="subtitle1" fontWeight="600">
              Admin User
            </Typography>
            <Typography variant="body2" color={colors.greenAccent[400]}>
              admin@ddin.rw
            </Typography>
          </Box>
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{
              '&:hover': {
                backgroundColor: colors.primary[500],
              },
              py: 1.5,
            }}
          >
            <PersonOutlinedIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{
              '&:hover': {
                backgroundColor: colors.primary[500],
              },
              py: 1.5,
            }}
          >
            <SettingsOutlinedIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{
              '&:hover': {
                backgroundColor: colors.primary[500],
              },
              py: 1.5,
              borderTop: `1px solid ${colors.primary[500]}`,
              color: colors.redAccent[400],
            }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: '1.2rem' }} />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;