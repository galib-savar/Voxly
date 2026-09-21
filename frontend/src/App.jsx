import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Profile from "../src/pages/Profile.jsx";
import Settings from "../src/pages/Settings.jsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/profile/:userId",
      element: <Profile />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
