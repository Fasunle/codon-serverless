import { HashRouter, Route, Routes } from "react-router-dom";
import Nav from "./Nav";
import Profile from "./Profile";
import Protected from "./Protected";
import Public from "./Public";

/**
 *
 * @returns Router context
 *
 * HashRouter is used here
 * Other router types could have been used e.g BrowserRouter
 *
 * ? Switch has been deprecated. Use Route instead
 * <Route> component can now be nested
 */
const Router = () => {
  return (
    <HashRouter>
      {/* Non-route could only be used in the router but not in the Routes. Route component could also wrap non-route component */}
      <Nav />
      <Routes>
        <Route exact path="/home" element={<Public />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/protected" element={<Protected />} />
        <Route path="/" element={<Public />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
