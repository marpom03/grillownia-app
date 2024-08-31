import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "./pages/Home";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                path: 'home',
                element: <Home />
            }
        ]
    }
])