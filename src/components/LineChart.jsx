import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import { getAllLogs } from "../apis/dataController";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
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
  console.log(transactionData)
  // Step 1: Sort the transaction data by date
transactionData.sort((a, b) => new Date(b.date.split("T")[0]) - new Date(a.date.split("T")[0]));

// Step 2: Group transactions by date and service name
const groupedData = transactionData.reduce((acc, transaction) => {
    const date = transaction.date.split("T")[0]; // Extracting date without time
    const serviceName = transaction.service_name;
    
    if (!acc[serviceName]) {
        acc[serviceName] = {};
    }
    
    if (!acc[serviceName][date]) {
        acc[serviceName][date] = 1;
    } else {
        acc[serviceName][date]++;
    }
    
    return acc;
}, {});

// Step 3: Convert the grouped data to the desired format
const mockLineData = Object.entries(groupedData).map(([serviceName, dates]) => {
    const data = Object.entries(dates)
        .map(([date, count]) => ({ x: date, y: count }));
    
    return {
        id: serviceName,
        data,
    };
});

  // // Prepare data for the line chart
   const chartData = mockLineData;

  return (
    <ResponsiveLine
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
