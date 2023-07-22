import { Fragment } from "react";

import { Header } from "../components/Header";

import { Outlet } from "react-router-dom";

export function DefaultLayout() {
  return (
    <Fragment>
      <Header />

      <Outlet />
    </Fragment>
  )
}