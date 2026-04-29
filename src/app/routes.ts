import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import BidManagement from "./components/BidManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: BidManagement },
    ],
  },
]);
