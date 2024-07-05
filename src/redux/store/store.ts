import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice";
import adminSlice from "../slices/adminSlice/adminSlice";

const store = configureStore({
  reducer: {
    userInfo: userSlice,
    adminInfo: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
