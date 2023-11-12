import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export const Root = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};
