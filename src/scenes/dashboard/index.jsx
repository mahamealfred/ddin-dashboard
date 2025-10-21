import { 
  Box, 
  Button, 
  Grid, 
  IconButton, 
  Typography, 
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Tooltip
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TrafficIcon from "@mui/icons-material/Traffic";
import RefreshIcon from "@mui/icons-material/Refresh";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import { getAllLogs } from "../../apis/dataController";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Professional API handling with error management
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllLogs();
      
      if (response.responseCode === 200) {
        const dataWithIds = response.data.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        setTransactionData(dataWithIds);
        setLastUpdated(new Date());
      } else {
        throw new Error(response.message || 'Failed to fetch transaction data');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Data processing functions
  const processTransactionData = () => {
    if (!transactionData.length) return {};

    // CORRECTED LOGIC FOR STATUS FILTERING
    const totalCompleteTransactions = transactionData.filter(transaction => 
      transaction.status === 'Complete' || transaction.status === 'successful'
    ).length;

    const totalIncompleteTransactions = transactionData.filter(transaction => 
      transaction.status === 'Incomplete' || transaction.status === 'failed'
    ).length;

    // Total transactions for the current date
    const currentDate = new Date();
    const totalCurrentDateTransactions = transactionData.filter(transaction => {
      try {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === currentDate.toDateString();
      } catch {
        return false;
      }
    }).length;

    // Total completed transactions for the current date
    const totalCurrentDateCompletedTransactions = transactionData.filter(transaction => {
      try {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === currentDate.toDateString() && 
               (transaction.status === "Complete" || transaction.status === "successful");
      } catch {
        return false;
      }
    }).length;

    // Total failed transactions for the current date
    const totalFailedDateCompletedTransactions = transactionData.filter(transaction => {
      try {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === currentDate.toDateString() && 
               (transaction.status === "Incomplete" || transaction.status === "failed");
      } catch {
        return false;
      }
    }).length;

    // Calculate success rate
    const progressValue = totalCompleteTransactions > 0 ? 
      ((totalCompleteTransactions * 100) / (totalCompleteTransactions + totalIncompleteTransactions)).toFixed(2) : 
      "0";

    // Sort transactions by date in descending order and get recent transactions
    const sortedTransactions = [...transactionData].sort((a, b) => {
      try {
        return new Date(b.date) - new Date(a.date);
      } catch {
        return 0;
      }
    });
    const recentTransactions = sortedTransactions.slice(0, 5);

    return {
      totalCompleteTransactions,
      totalIncompleteTransactions,
      totalCurrentDateTransactions,
      totalCurrentDateCompletedTransactions,
      totalFailedDateCompletedTransactions,
      progressValue,
      recentTransactions,
      totalTransactions: totalCompleteTransactions + totalIncompleteTransactions
    };
  };

  const {
    totalCompleteTransactions = 0,
    totalIncompleteTransactions = 0,
    totalCurrentDateTransactions = 0,
    totalCurrentDateCompletedTransactions = 0,
    totalFailedDateCompletedTransactions = 0,
    progressValue = "0",
    recentTransactions = [],
    totalTransactions = 0
  } = processTransactionData();

  // Responsive grid configuration
  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 3;
  };

  const getChartGridColumns = () => {
    if (isMobile) return 12;
    return 8;
  };

  const getSidebarGridColumns = () => {
    if (isMobile) return 12;
    return 4;
  };

  const handleDownloadReports = () => {
    // Implement download functionality
    console.log('Downloading reports...');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'successful':
        return colors.greenAccent[500];
      case 'incomplete':
      case 'failed':
        return colors.redAccent[500];
      default:
        return colors.grey[500];
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="80vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[500] }} />
        <Typography variant="h6" color={colors.grey[100]}>
          Loading Dashboard Data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={isMobile ? "10px" : "20px"}>
        <Header title="DASHBOARD" subtitle="Transaction Overview" />
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchLogs}>
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box m={isMobile ? "10px" : "20px"}>
      {/* HEADER SECTION */}
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"} 
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"}
        gap={isMobile ? 2 : 0}
        mb={3}
      >
        <Box>
          <Header title="DASHBOARD" subtitle="Transaction Overview" />
          {lastUpdated && (
            <Typography variant="caption" color={colors.grey[400]}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        
        <Box display="flex" gap={1} width={isMobile ? "100%" : "auto"}>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchLogs}
              sx={{
                backgroundColor: colors.primary[600],
                color: colors.grey[100],
                '&:hover': {
                  backgroundColor: colors.primary[500],
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            onClick={handleDownloadReports}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              minWidth: isMobile ? "calc(100% - 50px)" : "auto",
              '&:hover': {
                backgroundColor: colors.blueAccent[600],
              }
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Export Report
          </Button>
        </Box>
      </Box>

      {/* STATS CARDS SECTION */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={getGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: "100%",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <StatBox
                title={totalCurrentDateTransactions.toLocaleString()}
                subtitle="Today's Transactions"
                progress={totalCurrentDateTransactions > 0 ? totalCurrentDateCompletedTransactions / totalCurrentDateTransactions : 0}
                increase="+12%"
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[500], fontSize: "28px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={getGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: "100%",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <StatBox
                title={totalCurrentDateCompletedTransactions.toLocaleString()}
                subtitle="Today's Completed"
                progress="0.85"
                increase="+8%"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.greenAccent[500], fontSize: "28px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={getGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: "100%",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <StatBox
                title={totalFailedDateCompletedTransactions.toLocaleString()}
                subtitle="Today's Failed"
                progress="0.15"
                increase="-5%"
                icon={
                  <TrafficIcon
                    sx={{ color: colors.redAccent[500], fontSize: "28px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={getGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: "100%",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <StatBox
                title={totalIncompleteTransactions.toLocaleString()}
                subtitle="Total Failed"
                progress="0.10"
                increase="+2%"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.redAccent[500], fontSize: "28px" }}
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CHARTS AND TRANSACTIONS SECTION */}
      <Grid container spacing={2}>
        {/* MAIN CHART */}
        <Grid item xs={12} md={getChartGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: isMobile ? "420px" : "520px",
              transition: "all 0.3s ease",
              '&:hover': {
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3, height: "100%", display: 'flex', flexDirection: 'column' }}>
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "flex-start" : "center"}
                mb={3}
                gap={isMobile ? 2 : 0}
              >
                <Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Transaction Analytics
                  </Typography>
                  <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight="bold"
                    color={colors.greenAccent[500]}
                  >
                    {totalTransactions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[400]}>
                    Total processed transactions
                  </Typography>
                </Box>
                <Tooltip title="Download Chart Data">
                  <IconButton sx={{ color: colors.greenAccent[500] }}>
                    <DownloadOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box flex={1} minHeight={0}>
                <LineChart isDashboard={true} data={transactionData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RECENT TRANSACTIONS */}
        <Grid item xs={12} md={getSidebarGridColumns()}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: isMobile ? "420px" : "520px",
              transition: "all 0.3s ease",
              '&:hover': {
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 0, height: "100%", display: 'flex', flexDirection: 'column' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`2px solid ${colors.primary[500]}`}
                p="20px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Transactions
                </Typography>
                <Chip 
                  label={`${recentTransactions.length} items`} 
                  size="small"
                  sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
                />
              </Box>
              
              <Box sx={{ flex: 1, overflow: "auto" }}>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, i) => (
                    <Box
                      key={`${transaction.id}-${i}`}
                      sx={{
                        p: "15px",
                        borderBottom: `1px solid ${colors.primary[500]}`,
                        '&:hover': {
                          backgroundColor: colors.primary[500],
                        },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography
                          color={colors.greenAccent[500]}
                          variant="body1"
                          fontWeight="600"
                          sx={{ wordBreak: 'break-all' }}
                        >
                          {transaction.transactionId}
                        </Typography>
                        <Chip
                          label={transaction.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(transaction.status),
                            color: colors.grey[100],
                            fontSize: '0.7rem',
                            height: '20px'
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        color={colors.grey[300]} 
                        variant="body2"
                        mb={1}
                      >
                        {transaction.service_name}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                          color={colors.grey[400]} 
                          variant="caption"
                        >
                          {new Date(transaction.date).toLocaleDateString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          color={colors.greenAccent[400]}
                        >
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color={colors.grey[500]} variant="body1">
                      No transactions found
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* BOTTOM CHARTS SECTION */}
      <Grid container spacing={2} mt={2}>
        {/* SUCCESS RATE */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: isMobile ? "320px" : "380px",
              transition: "all 0.3s ease",
              '&:hover': {
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3, height: "100%", display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight="600" mb={2}>
                Success Rate
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                flex={1}
              >
                <ProgressCircle size={isMobile ? 100 : 120} progress={progressValue} />
                <Typography
                  variant="h4"
                  color={colors.greenAccent[500]}
                  sx={{ mt: "15px" }}
                  fontWeight="bold"
                >
                  {progressValue}%
                </Typography>
                <Typography align="center" color={colors.grey[400]} sx={{ mt: 1 }}>
                  Overall transaction success rate
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Typography variant="body2" color={colors.greenAccent[400]}>
                    ✓ {totalCompleteTransactions} Success
                  </Typography>
                  <Typography variant="body2" color={colors.redAccent[400]}>
                    ✗ {totalIncompleteTransactions} Failed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* SERVICE DISTRIBUTION */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: isMobile ? "320px" : "380px",
              transition: "all 0.3s ease",
              '&:hover': {
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3, height: "100%", display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h5"
                fontWeight="600"
                mb={2}
              >
                Service Distribution
              </Typography>
              <Box flex={1} minHeight={0}>
                <BarChart isDashboard={true} data={transactionData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TRANSACTION STATUS */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              backgroundColor: colors.primary[400],
              height: isMobile ? "320px" : "380px",
              transition: "all 0.3s ease",
              '&:hover': {
                boxShadow: `0 8px 25px ${colors.primary[700]}`,
              },
              border: `1px solid ${colors.primary[500]}`,
            }}
          >
            <CardContent sx={{ p: 3, height: "100%", display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h5"
                fontWeight="600"
                mb={2}
              >
                Status Overview
              </Typography>
              <Box flex={1} minHeight={0}>
                <PieChart isDashboard={true} data={transactionData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;