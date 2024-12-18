import { Helmet } from "react-helmet";
import {
  RegistrationReducer,
  intialProfileState,
} from "../reducers/RegistrationReducer";
import RegistrationProgress from "../components/Auth/RegistrationProgress";
import { lazy, useEffect, useState, useReducer } from "react";
import { Route, Routes, useParams } from "react-router-dom";

const RegistrationFormTwo = lazy(() =>
  import("../components/Auth/RegistrationFormTwo")
);
const EmailVerification = lazy(() =>
  import("../components/Auth/EmailVerification")
);

function useRegistrationRoute() {
  const [state, dispatch] = useReducer(RegistrationReducer, intialProfileState);
  const [role, setRole] = useState("candidate");
  
  return (
    <>
      <Helmet>
        <title>Registration Page</title>
      </Helmet>
      <main className="w-screen h-screen flex">
        <div className="w-[50%] md:block hidden  h-screen">
          <RegistrationProgress state={state} dispatch={dispatch} role={role} />
        </div>

        <Routes>
          <Route
            index
            element={<RegistrationFormTwo state={state} dispatch={dispatch} role={role} setRole={setRole} />}
          />
          <Route
            path="email_verification"
            element={<EmailVerification state={state} dispatch={dispatch} role={role} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default useRegistrationRoute;
