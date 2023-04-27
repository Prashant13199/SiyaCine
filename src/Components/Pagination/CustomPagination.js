import React from "react";
import Pagination from '@mui/material/Pagination';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function CustomPagination({ setPage, numOfPages = 10 }) {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handlePageChange = (page) => {
    setPage(page);
    window.scroll(0, 0);
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
    </ThemeProvider>
  );
}
