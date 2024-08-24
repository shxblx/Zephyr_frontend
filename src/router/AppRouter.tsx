import { Route, Routes } from "react-router-dom";
import { UserRouter } from "./UserRouter";
import { AdminRouter } from "./AdminRouter";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};

export default AppRouter;
