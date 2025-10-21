import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { getAllLogs } from "../apis/dataController";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

const BarChart = ({ isDashboard = false, data: externalData = null }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(!externalData);
  const [error, setError] = useState(null);

  // Professional API call with error handling
  const fetchLogs = async () => {
    if (externalData) {
      setTransactionData(externalData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllLogs();
      
      if (response.responseCode === 200) {
        const processedData = response.data.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        setTransactionData(processedData);
      } else {
        throw new Error(response.message || 'Failed to fetch transaction data');
      }
    } catch (err) {
      console.error('Error fetching bar chart data:', err);
      setError(err.message || 'An error occurred while fetching chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [externalData]);

  // Data processing with validation
  const processChartData = () => {
    if (!transactionData || transactionData.length === 0) {
      return [];
    }

    try {
      // Group transactions by service name and status
      const groupedTransactions = transactionData.reduce((acc, transaction) => {
        const { service_name, status } = transaction;
        
        if (!service_name) return acc; // Skip transactions without service name
        
        const serviceKey = service_name.trim() || 'Unknown Service';
        
        if (!acc[serviceKey]) {
          acc[serviceKey] = { 
            Complete: 0, 
            Incomplete: 0,
            Failed: 0,
            Successful: 0
          };
        }

        // Handle different status naming conventions
        const normalizedStatus = status?.toLowerCase() || 'unknown';
        if (normalizedStatus === 'complete' || normalizedStatus === 'successful') {
          acc[serviceKey].Complete++;
          acc[serviceKey].Successful++;
        } else if (normalizedStatus === 'incomplete' || normalizedStatus === 'failed') {
          acc[serviceKey].Incomplete++;
          acc[serviceKey].Failed++;
        }

        return acc;
      }, {});

      // Transform to Nivo bar chart format
      const chartData = Object.entries(groupedTransactions).map(([service, counts]) => ({
        service: service,
        Complete: counts.Complete,
        Failed: counts.Failed,
        // Color mapping for the chart
        completeColor: colors.greenAccent[500],
        failedColor: colors.redAccent[500],
        // Additional metrics for tooltips
        total: counts.Complete + counts.Failed,
        successRate: counts.total > 0 ? (counts.Complete / (counts.Complete + counts.Failed) * 100).toFixed(1) : 0
      }));

      return chartData;
    } catch (error) {
      console.error('Error processing chart data:', error);
      return [];
    }
  };

  const chartData = processChartData();

  // Custom tooltip for better UX
  const CustomTooltip = ({ id, value, color, data }) => (
    <Box
      sx={{
        background: colors.primary[700],
        padding: '12px',
        border: `1px solid ${colors.primary[500]}`,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>
        {data.service}
      </Typography>
      <Typography variant="body2" color={color} sx={{ mt: 0.5 }}>
        {id}: <strong>{value}</strong>
      </Typography>
      <Typography variant="caption" color={colors.grey[400]}>
        Total: {data.total} | Success: {data.successRate}%
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={40} sx={{ color: colors.greenAccent[500] }} />
        <Typography variant="body2" color={colors.grey[400]}>
          Loading chart data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        flexDirection="column"
        gap={2}
      >
        <Alert severity="error" sx={{ width: '80%' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h6" color={colors.grey[500]}>
          No data available
        </Typography>
        <Typography variant="body2" color={colors.grey[400]}>
          No transaction data found for the chart
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveBar
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
              fontSize: 12,
              fontWeight: 500,
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
              fontSize: 11,
            },
          },
        },
        grid: {
          line: {
            stroke: colors.primary[500],
            strokeWidth: 0.5,
            strokeDasharray: "4 4",
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontSize: 12,
          },
        },
        tooltip: {
          container: {
            background: colors.primary[700],
            color: colors.grey[100],
            fontSize: '12px',
            borderRadius: '8px',
          },
        },
      }}
      keys={["Complete", "Failed"]}
      indexBy="service"
      margin={{ 
        top: 50, 
        right: isDashboard ? 50 : 130, 
        bottom: 70, 
        left: 70 
      }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id, data }) => {
        if (id === "Complete") return data.completeColor || colors.greenAccent[500];
        if (id === "Failed") return data.failedColor || colors.redAccent[500];
        return colors.grey[500];
      }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
      borderRadius={4}
      borderWidth={1}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: isDashboard ? -45 : 0,
        legend: isDashboard ? undefined : "Services",
        legendPosition: "middle",
        legendOffset: 50,
        truncateTickAt: isDashboard ? 20 : 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Number of Transactions",
        legendPosition: "middle",
        legendOffset: -55,
        format: value => Math.round(value) === value ? value : value.toFixed(1),
      }}
      enableGridY={true}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={isDashboard ? undefined : [
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 4,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.95,
          symbolSize: 16,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
                itemTextColor: colors.greenAccent[400],
              },
            },
          ],
        },
      ]}
      motionConfig="gentle"
      tooltip={({ id, value, color, data }) => (
        <CustomTooltip id={id} value={value} color={color} data={data} />
      )}
      role="application"
      ariaLabel="Transaction service distribution bar chart"
      barAriaLabel={e =>
        `${e.id}: ${e.formattedValue} transactions for ${e.indexValue} service`
      }
      // Animation and interaction enhancements
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      isInteractive={true}
      onClick={(data, event) => {
        console.log('Bar clicked:', data);
        // You can add click handlers here for drill-down functionality
      }}
      onMouseEnter={(data, event) => {
        // Add any hover effects or analytics tracking
      }}
    />
  );
};

export default BarChart;