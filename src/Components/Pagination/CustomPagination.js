import React from "react";
import Pagination from '@mui/material/Pagination';

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
        marginTop: 10,
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
