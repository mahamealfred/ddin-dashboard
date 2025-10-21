import { Box, Button,IconButton, Typography, Grid, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllLogs } from "../../apis/dataController";
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import Header from "../../components/Header";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TrafficIcon from "@mui/icons-material/Traffic";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactionData, setTransactionData] = useState([]);

  const fetchLogs = async () => {
    const response = await getAllLogs();
    if (response.responseCode === 200) {
      const dataWithIds = response.data.map((item, index) => ({
        ...item,
        id: index + 1
      }));
      setTransactionData(dataWithIds);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalCompleteTransactions = transactionData.filter(
    (transaction) => transaction.status === 'Complete' || 'successful'
  ).length;

  const totalIncompleteTransactions = transactionData.filter(
    (transaction) => transaction.status === 'Incomplete' || 'failed'
  ).length;

  const currentDate = new Date();
  const totalCurrentDateTransactions = transactionData.filter(
    (transaction) => new Date(transaction.date).toDateString() === currentDate.toDateString()
  ).length;

  const totalCurrentDateCompletedTransactions = transactionData.filter(
    (transaction) => transaction.status === 'Complete' || 'successful' && new Date(transaction.date).toDateString() === currentDate.toDateString()
  ).length;

  const totalFailedDateCompletedTransactions = transactionData.filter(
    (transaction) => transaction.status === 'Incomplete' || 'failed' && new Date(transaction.date).toDateString() === currentDate.toDateString() && transaction.thirdpart_status === "failed"
  ).length;

  const progressValue = ((totalCompleteTransactions * 100) / (totalCompleteTransactions + totalIncompleteTransactions)).toFixed(2);

  const recentTransactions = transactionData.slice(0, 5);

  return (
    <Box m="20px" overflow="auto">
      <Grid container spacing={2}>
        {/* HEADER */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Download Reports 
            </Button>
          </Box>
        </Grid>

        {/* STAT BOXES */}
        <Grid item xs={12} md={6} lg={2}>
          <StatBox
            // title={totalCurrentDateTransactions}
            title={totalCurrentDateTransactions}
            subtitle="Today's Transactions"
            progress={0.3}
            increase="+5%"
            icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatBox
            title={totalCurrentDateCompletedTransactions}
            subtitle="Today's Completed Transactions"
            progress={0.8}
            increase="+43%"
            icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatBox
            title={totalFailedDateCompletedTransactions}
            subtitle="Today's Failed Transactions"
            progress={0.8}
            increase="+43%"
            icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatBox
            title={totalIncompleteTransactions}
            subtitle="All Failed Transactions"
            progress={0.5}
            increase="+21%"
            icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Grid>

        {/* LINE CHART */}
        <Grid item xs={12} lg={8}>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Generated Transactions
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
              {totalCompleteTransactions + totalIncompleteTransactions} Transactions
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart  />
          </Box>
        </Box>
        </Grid>

        {/* RECENT TRANSACTIONS */}
        <Grid item xs={12} lg={4}>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions 00
            </Typography>
          </Box>
          {recentTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.ID}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.transactionId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.service_name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                Rwf{(transaction.amount)}
              </Box>
            </Box>
          ))}
        </Box>
        </Grid>

        {/* PROGRESS CIRCLE & CHARTS */}
        
        <Grid item xs={12} md={4}>
          
          <Box p={3}>
            <Typography variant="h5" fontWeight="600">All Transactions Status</Typography>
            <ProgressCircle size={125} progress={progressValue} />
            <Typography variant="h5" color={colors.greenAccent[500]}>{progressValue}%</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          
          <Box p={3}>
            <Typography variant="h5" fontWeight="600">All Transactions Status</Typography>
            <BarChart isDashboard={true} />
            <Typography variant="h5" color={colors.greenAccent[500]}>{progressValue}%</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          
          <Box p={3}>
            <Typography variant="h5" fontWeight="600">All Transactions Status</Typography>
            <PieChart isDashboard={true} />
        
            <Typography variant="h5" color={colors.greenAccent[500]}>{progressValue}%</Typography>
          </Box>
        </Grid>
      

      
      </Grid>
    </Box>
  );
};

export default Dashboard;
