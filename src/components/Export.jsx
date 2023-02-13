import { CButton, CSpinner, CTooltip } from "@coreui/react";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload } from "@coreui/icons";


const Export = ({ title, data, fileName, sheetName, style, onClick, params }) => {
  const [loading, setLoading] = useState(false)
  const exportExcelHandler = async () => {
    try{
      setLoading(true)
     let x = await data(params)
     const wb = XLSX.utils.book_new();
     const ws = XLSX.utils.json_to_sheet(x);
     XLSX.utils.book_append_sheet(wb, ws, sheetName ?? "sheet1");
     XLSX.writeFile(wb, `${fileName}.xlsx`);
     setLoading(false)
    } catch (e){
      setLoading(false)
      console.error({e});
    }
  };
  return (
    <CTooltip content={`${title?? 'download'}`}>

    <CButton onClick={exportExcelHandler} color="secondary" style={style} disabled={loading}>
     {loading? <CSpinner size="sm" color="primary"/>:
      <CIcon icon={cilCloudDownload} size="lg" />}
     
    </CButton>
    </CTooltip>
  );
};

export default Export;
