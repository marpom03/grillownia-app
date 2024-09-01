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
        path: '/register',
        element: <Login />
    },
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'groups',
                element: <Home />
            },
        ]
    }
])