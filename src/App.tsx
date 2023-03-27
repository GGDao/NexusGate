import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GelatoProvider } from "./contexts/gelatocontext";
import { store } from "./store";
import Router from "./routes";
import ThemeProvider from "./theme";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <Provider store={store}>
            <GelatoProvider>
              <Router />
            </GelatoProvider>
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
