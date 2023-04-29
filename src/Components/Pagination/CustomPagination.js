import React from "react";
import Pagination from '@mui/material/Pagination';
import './style.css'

export default function CustomPagination({ setPage, numOfPages = 10 }) {

  const handlePageChange = (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        margin: '10px 0px'
      }}
    >
      <Pagination
        onChange={(e) => handlePageChange(e.target.textContent)}
        count={numOfPages}
        color="primary"
        hideNextButton
        hidePrevButton
      />
    </div>
  );
}
