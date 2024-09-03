import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Permalink from "./pages/Permalink";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/share/:long/:lat',
        element: <Permalink />
    },
    {
        path: '/',
        element: <ProtectedRoute component={RootLayout}/>,
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