import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./home";
import NotFound from "./not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
