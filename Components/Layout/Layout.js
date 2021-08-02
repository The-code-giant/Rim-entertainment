import Header from "/Components/header";
import Footer from "/Components/footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  setAccountTokens,
  setMetaToken,
  setMetaBalance,
  setWalletToken,
  setMetaConnected,
  setWalletConnected,
  getAccountTokens,
  getMetaToken,
  getWalletToken,
  getMetaConnected,
  getWalletConnected,
} from "/store/action/accountSlice";
import Web3 from "web3";
import { OpenSeaPort, Network } from "opensea-js";
import { seaportProvider } from "/Utils/openseaApi";
import openseaApi from "Utils/openseaApi";
import {Modal} from "antd"
// This example provider won't let you make transactions, only read-only calls:

const seaport = new OpenSeaPort(seaportProvider, {
  networkName: Network.Main,
  apiKey: "2e7ef0ac679f4860bbe49a34a98cf5ac",
});

const Layout = ({ children }) => {
  const dispatchAccountTokens = useDispatch();
  const dispatchMetaToken = useDispatch();
  const dispatchWalletToken = useDispatch();
  const dispatchMetaConnected = useDispatch();
  const dispatchWalletconneted = useDispatch();
  const dipsatchMetaBalance = useDispatch();

  const accountTokens = useSelector(getAccountTokens);
  const metaToken = useSelector(getMetaToken);
  const walletToken = useSelector(getWalletToken);
  const isMetaconnected = useSelector(getMetaConnected);
  const isWalletConnected = useSelector(getWalletConnected);
  const [isWrongNet, setIsWrongNet] = useState(false)
  const router = useRouter();
  const [displayHeader, setDisplayHeader] = useState(true);
  const [network, setNetwork] = useState(null)
  const providers = {"0x4": "Rinkeby Network", "0x1": "Ethereum Main Network (Mainnet)", "0x4": "Rinkeby Test Network",
  "0x3": "Ropsten Test Network", "0x5": "Goerli Test Network", "0x2a": "Kovan Test Network"}

  useEffect(() => {
    // detectNetwork()
    subscribeMetamaskProvider();
    handleHeader();
  });

  const handleHeader = () => {
    if (router.pathname !== "/wallet") {
      setDisplayHeader(true);
    } else {
      setDisplayHeader(false);
    }
  };

  const getWalletAccountData = () => {};
  const subscribeMetamaskProvider = async () => {
    const provider = await detectEthereumProvider();
    if (provider !== window.ethereum) {
      return;
    }
    ethereum.on("accountsChanged", handleMetaAccount);
    ethereum.on("chainChanged", (chainId) => {
      console.log("chain changed");
      console.log(chainId);
    });
  };
  const handleMetaAccount = async (accounts) => {
    console.log("Listen to account changes");
    console.log("My Meta accounts are", accounts);
    if (accounts.length === 0) {
      await dispatchMetaConnected(setMetaConnected(false));
      await dispatchMetaToken(setMetaToken(null));
      await dipsatchMetaBalance(setMetaBalance(""));
    } else {
      await dispatchMetaConnected(setMetaConnected(true));
      await dispatchMetaToken(setMetaToken(accounts));
      const web3 = new Web3(window.ethereum);
      web3.eth.getBalance(accounts[0], async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          await dipsatchMetaBalance(
            setMetaBalance(web3.utils.fromWei(result, "ether"))
          );
        }
        console.log(
          "account balance is ",
          web3.utils.fromWei(result, "ether") + " ETH"
        );
      });
      if (router.pathname === "/wallet") {
        router.push("/");
      }
    }
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rim Entertainment</title>
        <meta name="description" content="Rim Entertainment inc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!displayHeader && <div style={{ marginBottom: "-90px" }}></div>}
      {displayHeader && <Header />}
      {children}
      {isWrongNet ? DisplayWrongNetModal() : ""}
      <Footer />
    </>
  );
  async function detectNetwork()
  {
    let provider = await detectEthereumProvider();
    if(provider.chainId != "0x1")
    {
      setIsWrongNet(true)
      setNetwork(provider.chainId)
    }
  }
  function DisplayWrongNetModal(){    
    let  message = "You are connected to "+providers[network]+".\n Please change to "+providers["0x1"]+" and reload the page"

    return <Modal title={<strong>{"Wrong Network!"}</strong>} footer={false} visible={true}>
    {message }
  </Modal>
  }
};

export default Layout;
