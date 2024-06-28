
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserRouter } from './UserRouter'; 

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
};

export default AppRouter;
