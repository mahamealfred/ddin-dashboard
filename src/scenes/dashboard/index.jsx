import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import { getAllLogs } from "../../apis/dataController";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactionData,setTransactionData]=useState([]);
  // console.log("transa:",transactionData?transactionData:null)
  const fecthLogs=async()=>{
const response=await getAllLogs();
if(response.responseCode === 200){
  const dataWithIds = response.data.map((item, index) => ({
    ...item,
    id: index + 1 // Assuming index is zero-based, you can adjust if necessary
  }));
  setTransactionData(dataWithIds)
}
  }
  useEffect(()=>{
fecthLogs()
  },[])
  const totalCompleteTransactions = transactionData.filter(transaction => transaction.status === 'Complete').length;

// 2. Total incomplete transactions
const totalIncompleteTransactions = transactionData.filter(transaction => transaction.status !== 'Complete').length;

// 3. Total transactions for the current date
const currentDate = new Date(); // Assuming the current date
const totalCurrentDateTransactions = transactionData.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.toDateString() === currentDate.toDateString();
}).length;

// 3. Total transactions for the current date (completed)
const totalCurrentDateCompletedTransactions = transactionData.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    if(transaction.status ==="Complete")
    return transactionDate.toDateString() === currentDate.toDateString();
}).length;


// 4. Total transactions grouped by service name
const transactionsByService = {};
transactionData.forEach(transaction => {
    const serviceName = transaction.service_name;
    if (!transactionsByService[serviceName]) {
        transactionsByService[serviceName] = 0;
    }
    transactionsByService[serviceName]++;
});

const dailytransactionsByService = {};
transactionData?.forEach(transaction => {
    const serviceName = transaction.service_name;
    if (!dailytransactionsByService[serviceName]) {
      dailytransactionsByService[serviceName] = {
            Complete: 0,
            Incomplete: 0
        };
    }
    if (transaction.status === 'Complete') {
      dailytransactionsByService[serviceName].Complete++;
    } else {
      dailytransactionsByService[serviceName].Incomplete++;
    }
});
const progressValue=(totalCompleteTransactions*100/(totalCompleteTransactions + totalIncompleteTransactions)).toFixed(2)
// Displaying the results
console.log("1. Total complete transactions:", totalCompleteTransactions);
console.log("2. Total incomplete transactions:", totalIncompleteTransactions);
console.log("3. Total transactions for the current date:", totalCurrentDateTransactions);
console.log("4. Total transactions grouped by service name:", transactionsByService);
console.log("5. Total Daily transactions grouped by service name:", dailytransactionsByService);
console.log("Todaya completed tra",totalCurrentDateCompletedTransactions)


//list of recent transacctions
// Sort transactions by date in descending order
transactionData.sort((a, b) => new Date(b.date) - new Date(a.date));

// Display the 5 most recent transactions
const recentTransactions = transactionData.slice(0, 5);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
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
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalCompleteTransactions}
            subtitle="Completed Transactions"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalIncompleteTransactions}
            subtitle="Failed Transactions"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalCurrentDateTransactions}
            subtitle="Today Transactions"
            progress="0.30"
            increase="+5%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
            // icon={
            //   <PersonAddIcon
            //     sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            //   />
            // }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalCurrentDateCompletedTransactions}
            subtitle="Today Completed Transactions"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
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
            <LineChart isDashboard={true} />
          </Box>
        </Box>
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
              Recent Transactions
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

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            All Transactions Status
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" progress={progressValue} />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {progressValue}%
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Service Status
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Completed Transactions Statistics
          </Typography>
          <Box height="200px">
          <PieChart isDashboard={true} />
            {/* <GeographyChart isDashboard={true} /> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
