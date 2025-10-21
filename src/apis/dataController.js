import React, { useContext } from "react";
import axios from "axios";
//Local PROD APIs:

//LOGIN URL
const base_remote_get_logs = "https://app.ddin.rw/api/v1/transactions/logs-transactions";

//login Auth 
const getAllLogs = async () => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:[]
  };

  await axios
    .get(base_remote_get_logs, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    .then((response) => {
      if (response.data.responseCode === 200) {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
        serverResponse.data = response.data?.data;
       
      } else {
        serverResponse.responseDescription = response.data.codeDescription;
        serverResponse.communicationStatus = response.data.communicationStatus;
        serverResponse.responseCode = response.data.responseCode;
      }
    })
    .catch((err) => {
     
    if (err.response.status == 400) {
      
      serverResponse.responseDescription = err.response.data.responseDescription;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    }
    else if(err.response.status == 401){
      serverResponse.responseDescription = err.response.data.responseDescription;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    }
    else{
      serverResponse.responseDescription = err.response.data.error;
      serverResponse.responseStatus = err.response.data.communicationStatus;
      serverResponse.responseCode = err.response.data.responseCode;
    } 
  
    });

  return serverResponse;
};


  export {
 getAllLogs
    
}