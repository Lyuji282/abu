import React from "react";
import { GRP_ADMIN, GRP_EDITOR } from "./constants";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const UsersList = React.lazy(() => import("./pages/system/Users"));
const UsersForm = React.lazy(() => import("./pages/system/Users/Form"));
const UsersAdd = React.lazy(() => import("./pages/system/Users/Add"));
const Models = React.lazy(() => import("./pages/system/Models"));
const Apps = React.lazy(() => import("./pages/system/Apps"));
const Content = React.lazy(() => import("./pages/Content"));

const routes = [
  {
    path: "/",
    exact: true,
    groups: [GRP_ADMIN, GRP_EDITOR],
  },
  {
    path: "/dashboard",
    exact: true,
    component: Dashboard,
    groups: [GRP_ADMIN, GRP_EDITOR],
  },
  {
    path: "/system",
    exact: true,
    groups: [GRP_ADMIN],
  },
  {
    path: "/system/users",
    exact: true,
    component: UsersList,
    groups: [GRP_ADMIN],
  },
  {
    path: "/system/users/add",
    exact: true,
    component: UsersAdd,
    groups: [GRP_ADMIN],
  },
  {
    path: "/system/users/edit/:id",
    exact: true,
    component: UsersForm,
    groups: [GRP_ADMIN],
  },
  {
    path: "/system/models/:id?",
    component: Models,
    groups: [GRP_ADMIN],
  },
  { path: "/system/apps", component: Apps, groups: [GRP_ADMIN] },
  {
    path: "/content",
    component: Content,
    groups: [GRP_ADMIN, GRP_EDITOR],
  },
];

export default routes;
