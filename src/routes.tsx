import { Navigate, useRoutes } from "react-router-dom";
import { Home } from "./views/Home";
import DashboardLayout from "./layout/dashboard/DashboardLayout";
import { Profile } from "./views/Profile";
// layouts

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/profile" />, index: true },
        { path: "profile", element: <Profile />},
      ],
    },
  ]);

  return routes;
}
