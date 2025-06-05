import { createBrowserRouter, RouterProvider } from "react-router";
// import HomePage from "./home";
import NotFound from "./not-found";
import RootLayout from "@/app.layout";
import { DVLotteryPage } from "./dv-lottery";
import LoginPage from "./login";
import LandingPage from "./landing";

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
