import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../styles/style.css";
import ReactDOM from "react-dom";
import { Web3Provider } from "../Providers/store";

import React, { useEffect, useRef } from "react";
import store from "../store";
import { Provider } from "react-redux";
function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }) {
  let ref = useRef();

  useEffect(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Web3Provider>
          <Component {...pageProps} />
        </Web3Provider>
      </Provider>,
      ref.current
    );
  }, []);
  return <div ref={ref} />;
}

export default MyApp;
