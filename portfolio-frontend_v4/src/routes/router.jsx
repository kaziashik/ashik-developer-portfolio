import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import PageLoader from '../ui/skeletons/PageLoader'

const Home = lazy(() => import('../pages/Home'))
const Contact = lazy(() => import('../pages/Contact'))
const Login = lazy(() => import('../pages/Login'))
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'))

const lazyPage = (Component) => ({
  element: (
    <Component />
  ),
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, ...lazyPage(Home) },
      { path: 'contact', ...lazyPage(Contact) },
      { path: 'login', ...lazyPage(Login) },
      { path: 'projects/:id', ...lazyPage(ProjectDetails) },
    ],
  },
])

export { PageLoader }
