import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
