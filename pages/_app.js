import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../styles/style.css";
import ReactDOM from "react-dom";
import { Web3Provider } from "../Providers/store";

import React, { useEffect, useRef } from "react";
import store from "../store";
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
const defaultQueryFn = async () => {
  return new Promise((resolve) => {
    resolve(loadAsset);
  });
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Web3Provider>
    </Provider>
  )
}

export default MyApp;
