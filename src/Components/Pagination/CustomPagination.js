import React from "react";
import Pagination from '@mui/material/Pagination';
import './style.css'

export default function CustomPagination({ setPage, page, numOfPages = 10 }) {

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scroll(0, 0);
  };

  return (
    <>
      <br />
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <Pagination
          onChange={handlePageChange}
          count={numOfPages}
          page={Number(page)}
          color="warning"
          hideNextButton
          hidePrevButton
        />
      </div>
      <br />
    </>
  )
}
