import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import { getAllLogs } from "../apis/dataController";

const BarChart = ({ isDashboard = false }) => {
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

// Group transactions by service name and status
const groupedTransactions = transactionData.reduce((acc, transaction) => {
  const { service_name, status } = transaction;
  if (!acc[service_name]) {
      acc[service_name] = { Complete: 0, Incomplete: 0 };
  }
  acc[service_name][status]++;
  return acc;
}, {});


// Display the grouped transactions
const chartData= Object.entries(groupedTransactions).map(([service, count], index) => ({
  country: service,
  "Complete": count.Complete,
  // "hot dogColor": "hsl(229, 70%, 50%)",
  "hot dogColor": "hsl(340, 70%, 50%)",
  "Failed": count.Incomplete,
  burgerColor: "hsl(296, 70%, 50%)",
  // kebab: 72,
  // kebabColor: "hsl(97, 70%, 50%)",
  // donut: 140,
  // donutColor: "hsl(340, 70%, 50%)",
}));

  // Prepare data for the line chart


  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        // added
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
      }}
      keys={["Complete", "Failed"]}
      indexBy="country"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Service Name", // changed
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Total Transactions", // changed
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
