import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";
import accountSlice from "./action/accountSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
// import { EventType, ActionTypes, OpenSeaPort } from 'opensea-js';
// // import * as ActionTypes from './index';
// import openseaApi from "Utils/openseaApi";

// // ...

// export function handleSeaportEvents() {
//   console.log("in handle callllllllllllllllllllllll")
//   return async function(dispatch, getState) {
//     openSeaPort.addListener(EventType.TransactionCreated, ({ transactionHash, event }) => {
//       console.info({ transactionHash, event })
//       dispatch({ type: ActionTypes.SET_PENDING_TRANSACTION_HASH, hash: transactionHash })
//     })
//     openSeaPort.addListener(EventType.TransactionConfirmed, ({ transactionHash, event }) => {
//       console.info({ transactionHash, event })
//       // Only reset your exchange UI if we're finishing an order fulfillment or cancellation
//       if (event == EventType.MatchOrders || event == EventType.CancelOrder) {
//         dispatch({ type: ActionTypes.RESET_EXCHANGE })
//       }
//     })
//     openSeaPort.addListener(EventType.TransactionDenied, ({ transactionHash, event }) => {
//       console.info({ transactionHash, event })
//       dispatch({ type: ActionTypes.RESET_EXCHANGE })
//     })
//     openSeaPort.addListener(EventType.TransactionFailed, ({ transactionHash, event }) => {
//       console.info({ transactionHash, event })
//       dispatch({ type: ActionTypes.RESET_EXCHANGE })
//     })
//     openSeaPort.addListener(EventType.InitializeAccount, ({ accountAddress }) => {
//       console.info({ accountAddress })
//       dispatch({ type: ActionTypes.INITIALIZE_PROXY })
//     })
//     openSeaPort.addListener(EventType.WrapEth, ({ accountAddress, amount }) => {
//       console.info({ accountAddress, amount })
//       dispatch({ type: ActionTypes.WRAP_ETH })
//     })
//     openSeaPort.addListener(EventType.UnwrapWeth, ({ accountAddress, amount }) => {
//       console.info({ accountAddress, amount })
//       dispatch({ type: ActionTypes.UNWRAP_WETH })
//     })
//     openSeaPort.addListener(EventType.ApproveCurrency, ({ accountAddress, tokenAddress }) => {
//       console.info({ accountAddress, tokenAddress })
//       dispatch({ type: ActionTypes.APPROVE_WETH })
//     })
//     openSeaPort.addListener(EventType.ApproveAllAssets, ({ accountAddress, proxyAddress, tokenAddress }) => {
//       console.info({ accountAddress, proxyAddress, tokenAddress })
//       dispatch({ type: ActionTypes.APPROVE_ALL_ASSETS })
//     })
//     openSeaPort.addListener(EventType.ApproveAsset, ({ accountAddress, proxyAddress, tokenAddress, tokenId }) => {
//       console.info({ accountAddress, proxyAddress, tokenAddress, tokenId })
//       dispatch({ type: ActionTypes.APPROVE_ASSET })
//     })
//     openSeaPort.addListener(EventType.CreateOrder, ({ order, accountAddress }) => {
//       console.info({ order, accountAddress })
//       dispatch({ type: ActionTypes.CREATE_ORDER })
//     })
//     openSeaPort.addListener(EventType.OrderDenied, ({ order, accountAddress }) => {
//       console.info({ order, accountAddress })
//       dispatch({ type: ActionTypes.RESET_EXCHANGE })
//     })
//     openSeaPort.addListener(EventType.MatchOrders, ({ buy, sell, accountAddress }) => {
//       console.info({ buy, sell, accountAddress })
//       dispatch({ type: ActionTypes.FULFILL_ORDER })
//     })
//     openSeaPort.addListener(EventType.CancelOrder, ({ order, accountAddress }) => {
//       console.info({ order, accountAddress })
//       dispatch({ type: ActionTypes.CANCEL_ORDER })
//     })
//   }
// }

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const multiReducer = combineReducers({
  account: accountSlice,
});
const persistedReducer = persistReducer(persistConfig, multiReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(logger),
  devTools: true,
});

export const persistor = persistStore(store);

export default store;
