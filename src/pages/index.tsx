import { createBrowserRouter, RouterProvider } from "react-router";
// import HomePage from "./home";
import NotFound from "./not-found";
import RootLayout from "@/app.layout";
import { DVLotteryPage } from "./dv-lottery";
import LoginPage from "./login";
import LandingPage from "./landing";
import { SimpleDVLotteryPage } from "./dv-lottery/simple";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />, // ✅ New login route
      },
      {
        path: "dv-lottery",
        element: <SimpleDVLotteryPage />, // ✅ Nouvelle route pour la page DV Lottery
      },
      {
        path: "dv-lottery/complex",
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
