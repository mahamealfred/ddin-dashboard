import React, { useState } from 'react';
import Papa from 'papaparse';
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import FileUpload from '../../components/FileUploads'; // Ensure this path is correct
import './App.css'; // Ensure this CSS file exists and is correctly referenced

const App = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [file1Data, setFile1Data] = useState([]);
  const [file2Data, setFile2Data] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [file1Total, setFile1Total] = useState(0);
  const [file2Total, setFile2Total] = useState(0);
  const [unmatchedResults, setUnmatchedResults] = useState([]);
  const [matchedResults, setMatchedResults] = useState([]);
  const [matchedFile1Total, setMatchedFile1Total] = useState(0);
  const [matchedFile2Total, setMatchedFile2Total] = useState(0);
  const [unmatchedFile1Total, setUnmatchedFile1Total] = useState(0);
  const [unmatchedFile2Total, setUnmatchedFile2Total] = useState(0);

  const handleFileUpload = (file, setFileData, setFileTotal) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((item, index) => ({
          ...item,
          id: index + 1 // Add unique id based on index
        }));
        setFileData(data);
        const total = data.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
        setFileTotal(total);
      },
    });
  };

  const compareFiles = () => {
    const matched = [];
    const results = file1Data.map((row1) => {
      const match = file2Data.find((row2) => row2.Transaction_reference === row1.Transaction_reference);
      if (match) {
        matched.push({
          ...row1,
          file2_amount: match.Amount,
        });
      }
      return {
        ...row1,
        file2_amount: match ? match.Amount : 'No Match',
      };
    }).map((item, index) => ({
      ...item,
      id: index + 1 // Ensure unique id for each row in results
    }));

    const unmatchedFile1 = file1Data.filter(row1 => !file2Data.some(row2 => row2.Transaction_reference === row1.Transaction_reference))
      .map((row, index) => ({ ...row, source: 'DDIN', id: `DDIN-${index + 1}` }));
    const unmatchedFile2 = file2Data.filter(row2 => !file1Data.some(row1 => row1.Transaction_reference === row2.Transaction_reference))
      .map((row, index) => ({ ...row, source: 'Efashe', id: `Efashe-${index + 1}` }));

    const unmatched = [...unmatchedFile1, ...unmatchedFile2];

    const unmatchedFile1Total = unmatchedFile1.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
    const unmatchedFile2Total = unmatchedFile2.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);

    const matchedFile1Total = matched.reduce((sum, row) => sum + parseFloat(row.Amount || 0), 0);
    const matchedFile2Total = matched.reduce((sum, row) => sum + parseFloat(row.file2_amount || 0), 0);

    setComparisonResults(results);
    setUnmatchedResults(unmatched);
    setMatchedResults(matched);
    setUnmatchedFile1Total(unmatchedFile1Total);
    setUnmatchedFile2Total(unmatchedFile2Total);
    setMatchedFile1Total(matchedFile1Total);
    setMatchedFile2Total(matchedFile2Total);
  };

  const comparisonColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.Date).toLocaleString()}
        </Typography>
      )
    },
    {
      field: "Transaction_reference",
      headerName: "Transaction Reference",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "Service_name",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "DDIN Amount",
      renderCell: (params) => (
        <Typography>
          Rwf {params.row.Amount}
        </Typography>
      ),
    },
    {
      field: "file2_amount",
      headerName: "Efashe Amount",
      renderCell: (params) => (
        <Typography>
          {params.row.file2_amount !== 'No Match' ? `Rwf ${params.row.file2_amount}` : 'No Match'}
        </Typography>
      ),
    }
  ];

  const unmatchedColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.Date).toLocaleString()}
        </Typography>
      )
    },
    {
      field: "Transaction_reference",
      headerName: "Transaction Reference",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "Service_name",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "Amount",
      renderCell: (params) => (
        <Typography>
          Rwf {params.row.Amount}
        </Typography>
      ),
    },
    {
      field: "source",
      headerName: "Source File",
    }
  ];

  const matchedColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.Date).toLocaleString()}
        </Typography>
      )
    },
    {
      field: "Transaction_reference",
      headerName: "Transaction Reference",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "Service_name",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "DDIN Amount",
      renderCell: (params) => (
        <Typography>
          Rwf {params.row.Amount}
        </Typography>
      ),
    },
    {
      field: "file2_amount",
      headerName: "Efashe Amount",
      renderCell: (params) => (
        <Typography>
          {params.row.file2_amount !== 'No Match' ? `Rwf ${params.row.file2_amount}` : 'No Match'}
        </Typography>
      ),
    }
  ];

  return (
    <Box m="20px">
      <Header
        title="DDIN Reconciliation with Efashe"
        subtitle="Please use the provided file format."
      />
      <div className="file-uploads">
        <FileUpload label="Upload DDIN  CSV File" onFileUpload={(file) => handleFileUpload(file, setFile1Data, setFile1Total)} />
        <FileUpload label="Upload Efashe CSV File" onFileUpload={(file) => handleFileUpload(file, setFile2Data, setFile2Total)} />
      </div>
    

      <Box display="flex" flexDirection="column" alignItems="center">
        
          <Button
            disabled={!file1Data.length || !file2Data.length}
            variant="contained"
            color="secondary"
            onClick={compareFiles}
            style={{ marginTop: '10px' }}
          >
           Compare
          </Button>
        </Box>
      <Box m="40px 0 0 0">
     
        <Typography variant="h6" sx={{textAlign:"center",fontWeight:"800",fontSize:24}}>Matched Transactions</Typography>
        <div className="totals">
      <p>Total matched in DDIN: {matchedFile1Total.toFixed(2)} Rwf</p>
      <p>Total matched in Efashe: {matchedFile2Total.toFixed(2)} Rwf</p>
      </div>
        <Box height="35vh"
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
          <DataGrid checkboxSelection rows={matchedResults} columns={matchedColumns} 
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
      <Box m="40px 0 0 0">
      
        <Typography variant="h6" sx={{textAlign:"center",fontWeight:"800",fontSize:24}}>Unmatched Transactions</Typography>
        <div className="totals">
      
        <p>Total unmatched in DDIN: {unmatchedFile1Total.toFixed(2)} Rwf</p>
        <p>Total unmatched in Efashe: {unmatchedFile2Total.toFixed(2)} Rwf</p>
      </div>
        <Box height="35vh"
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
          <DataGrid checkboxSelection rows={unmatchedResults} columns={unmatchedColumns} 
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>

      
      <Box m="40px 0 0 0">
      
        <Typography variant="h6" sx={{textAlign:"center",fontWeight:"800",fontSize:24}}>Comparison Results</Typography>
        <div className="totals">
        <p>DDIN Total: {file1Total.toFixed(2)} Rwf</p>
        <p>Efashe Total: {file2Total.toFixed(2)} Rwf</p>
       
      </div>
        <Box height="35vh"
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
          <DataGrid checkboxSelection rows={comparisonResults} columns={comparisonColumns} 
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>

      
    </Box>
  );
};

export default App;
