import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter,createBrowserRouter,RouterProvider } from "react-router-dom";
import NewsPages from "./pages/News/NewsPages";
import Roadmap from "./pages/roadmap/Roadmap";
import About from "./pages/About/About";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
        path:"/news",
        element: <NewsPages />
    },
    {
        path:"/roadmap",
        element: <Roadmap />
    },
    {
        path:"/about-us",
        element: <About />
    },
    {
        path:"/getInTouch",
        element: ''
    },
  ]);

  

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <RouterProvider router={router} />
);


