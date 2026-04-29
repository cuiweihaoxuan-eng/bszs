import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
import BidManagement from "./components/BidManagement";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: BidManagement },
    ],
  },
]);
