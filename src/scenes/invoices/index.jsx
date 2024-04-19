import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getAllLogs } from "../../apis/dataController";
import { format } from 'date-fns';

const Invoices = () => {
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
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "thirdpart_status",
      headerName: "ThirdPart Status",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "transaction_reference",
      headerName: "Transaction Reference",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "agent_name",
      headerName: "Agent Name",
      flex: 1,
    },
    {
      field: "service_name",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          Rwf {params.row.amount}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell:(params)=>(
        <Typography>
          {format(new Date(params.row.date), 'yyyy-MM-dd HH:mm:ss')}
        </Typography>
      )
     
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Service Logs"
        subtitle="List of All Service Transactions"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={transactionData} columns={columns} 
        components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
