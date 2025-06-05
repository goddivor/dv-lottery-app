import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./home";
import NotFound from "./not-found";
import RootLayout from "@/app.layout";
import { DVLotteryPage } from "./dv-lottery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dv-lottery",
        element: <DVLotteryPage />, // ✅ Nouvelle route
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
