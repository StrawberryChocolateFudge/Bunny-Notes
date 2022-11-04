import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const getLoading = () => {
            return <Box sx={{ display: 'flex', justifyContent: "center" }}>
                  <CircularProgress />
            </Box>
      }