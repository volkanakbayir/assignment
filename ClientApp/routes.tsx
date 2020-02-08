import AuthorizedLayout from "@Layouts/AuthorizedLayout";
import GuestLayout from "@Layouts/GuestLayout";
import LoginPage from "@Pages/LoginPage";
import { AppRoute } from "@Components/shared/AppRoute";
import * as React from "react";
import { Switch } from "react-router-dom";
import FishMarketPage from "./pages/FishMarketPage";

export const routes = (
  <Switch>
    <AppRoute layout={GuestLayout} exact path="/login" component={LoginPage} />
    <AppRoute layout={AuthorizedLayout} exact path="/" component={FishMarketPage} />
  </Switch>
);
