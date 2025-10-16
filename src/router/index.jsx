import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const QuestionDetail = lazy(() => import("@/components/pages/QuestionDetail"));
const AskQuestion = lazy(() => import("@/components/pages/AskQuestion"));
const Tags = lazy(() => import("@/components/pages/Tags"));
const Users = lazy(() => import("@/components/pages/Users"));
const UserProfile = lazy(() => import("@/components/pages/UserProfile"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "question/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <QuestionDetail />
      </Suspense>
    )
  },
  {
    path: "ask",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AskQuestion />
      </Suspense>
    )
  },
  {
    path: "tags",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Tags />
      </Suspense>
    )
  },
  {
    path: "users",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Users />
      </Suspense>
    )
  },
  {
    path: "user/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <UserProfile />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);