// /client/src/components/AppRouter.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  MAIN_ROUTE,
  REQUEST_FLIGHT_ROUTE,
  MY_FLIGHTS_ROUTE,
  ADMIN_REQUESTS_ROUTE,
  ALL_FLIGHTS_ROUTE,
} from "../utils/consts";
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "../index";
import Main from "../pages/Main";
import Auth from "../pages/Auth";
import Admin from "../pages/Admin";
import RequestFlight from "../pages/RequestFlight";
import MyFlights from "../pages/MyFlights";
import AdminRequests from "../pages/AdminRequests";
import AllFlights from "../pages/AllFlights";

const AppRouter = () => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {user.isAuth && (
        <>
          <Route path={MAIN_ROUTE} element={<Main />} />
          
          {user.user.role === "PILOT" && (
            <>
              <Route path={REQUEST_FLIGHT_ROUTE} element={<RequestFlight />} />
              <Route path={MY_FLIGHTS_ROUTE} element={<MyFlights />} />
            </>
          )}
          
          {user.user.role === "ADMIN" && (
            <>
              <Route path={ADMIN_ROUTE} element={<Admin />} />
              <Route path={ADMIN_REQUESTS_ROUTE} element={<AdminRequests />} />
              <Route path={ALL_FLIGHTS_ROUTE} element={<AllFlights />} />
            </>
          )}
        </>
      )}
      
      <Route path={LOGIN_ROUTE} element={<Auth />} />
      <Route path={REGISTRATION_ROUTE} element={<Auth />} />
      
      <Route
        path="*"
        element={
          user.isAuth ? <Navigate to={MAIN_ROUTE} /> : <Navigate to={LOGIN_ROUTE} />
        }
      />
    </Routes>
  );
};

export default AppRouter;
