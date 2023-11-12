import { ChakraProvider } from "@chakra-ui/react";
import React, { Suspense } from "react"; // Import Suspense
import ReactDOM from "react-dom/client";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import Loader from "./Loader"; // Import the Loader component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        // You can add a loader here if needed
      },
      {
        path: "/event/:eventId",
        element: (
          <Suspense fallback={<Loader />}>
            {" "}
            {/* Use Suspense with a fallback */}
            <EventPage />
          </Suspense>
        ),
        // You can add a loader here if needed
      },
    ],
  },
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
