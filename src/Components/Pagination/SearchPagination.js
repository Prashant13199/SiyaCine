import React from "react";
import Pagination from '@mui/material/Pagination';
import './style.css'

export default function SearchPagination({ setPage, page, numOfPages = 10, handlePageChange }) {

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
