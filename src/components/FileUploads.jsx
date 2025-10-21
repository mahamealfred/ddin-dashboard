// src/components/FileUpload.js
import { Button, Input, Typography, Box, Alert } from '@mui/material';
import React, { useState, useRef } from 'react';

const FileUpload = ({ label, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

    if (fileExtension !== 'csv') {
      setError('Please upload a CSV file.');
      setFile(null);
      onFileUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setError('');
      setFile(uploadedFile);
      onFileUpload(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={2} border={1} borderRadius={2} borderColor="grey.400">
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ marginBottom: '10px' }}
        inputRef={fileInputRef}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {/* {file && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1">{file.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRemoveFile}
            style={{ marginTop: '10px' }}
          >
            Remove File
          </Button>
        </Box>
      )} */}
    </Box>
  );
};

export default FileUpload;
