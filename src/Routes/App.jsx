import { createBrowserRouter } from 'react-router-dom';

import AdminLayout    from '../Layouts/AdminLayout.jsx';
import Layout         from '../Layouts/Layout.jsx';

import Landing        from '../Pages/Landing.jsx';
import Dashboard      from '../Pages/Dashboard.jsx';
import History        from '../Pages/history.jsx';
import AppDetails     from '../Pages/App_details.jsx';
import SignUp         from '../Pages/SignUp.jsx';
import Login          from '../Pages/Login.jsx';
import Library        from '../Pages/Library.jsx';
import SubmitApp      from '../Pages/Submit_app.jsx';
import PublicDashboard from '../Pages/PublicDashboard.jsx';
import ForgotPassword from '../Pages/ForgotPassword.jsx';

import ADashboard   from '../Pages/Admin/ADashboard.jsx';
import AUsers       from '../Pages/Admin/AUsers.jsx';
import ATools       from '../Pages/Admin/ATools.jsx';
import ASubmissions from '../Pages/Admin/ASubmissions.jsx';
import ACategories  from '../Pages/Admin/ACategories.jsx';
import ATags        from '../Pages/Admin/ATags.jsx';
import AReviews     from '../Pages/Admin/AReviews.jsx';
import AReports     from '../Pages/Admin/AReports.jsx';
import AStats       from '../Pages/Admin/AStats.jsx';
import AAddTool     from '../Pages/Admin/AAddTool.jsx';
import Notifications from '../Pages/Notifications.jsx';


const router = createBrowserRouter([
  { path: '/',               element: <Landing /> },
  { path: '/tools',          element: <PublicDashboard /> },
  { path: '/login',          element: <Login /> },
  { path: '/signUp',         element: <SignUp /> },
  { path: '/forgot-password',element: <ForgotPassword /> },
  {
    path: '/app',
    element: <Layout />,
    children: [
      { index: true,                element: <Dashboard /> },
      { path: '/app/dashboard',     element: <Dashboard /> },
      { path: '/app/app_details',   element: <AppDetails /> },
      { path: '/app/history',       element: <History /> },
      { path: '/app/library',       element: <Library /> },
      { path: '/app/submit_app',    element: <SubmitApp /> },
      { path: '/app/notifications', element: <Notifications /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true,                    element: <ADashboard /> },
      { path: '/admin/users',           element: <AUsers /> },
      { path: '/admin/tools',           element: <ATools /> },
      { path: '/admin/submissions',     element: <ASubmissions /> },
      { path: '/admin/categories',      element: <ACategories /> },
      { path: '/admin/tags',            element: <ATags /> },
      { path: '/admin/reviews',         element: <AReviews /> },
      { path: '/admin/reports',         element: <AReports /> },
      { path: '/admin/stats',           element: <AStats /> },
      { path: '/admin/add-tool',        element: <AAddTool /> },
    ],
  },
]);

export default router;