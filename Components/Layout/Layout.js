import Header from "/Components/header";
import Footer from "/Components/footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Onboard from "bnc-onboard";

import {
  setMetaToken,
  setMetaBalance,
  setMetaConnected,
  getMetaToken,
  getMetaConnected,
} from "/store/action/accountSlice";
import Web3 from "web3";
import { providers } from "/Constants/constants";
import { Modal } from "antd";
import { isMobileDevice } from "Constants/constants";
import { useIdleTimer } from "react-idle-timer";
import ConnectWalletModal from "../commons/connectWalletModal";
import { registerTalent } from "Utils/utils";

const Layout = ({ children }) => {
  const dispatchMetaToken = useDispatch();
  const dispatchMetaConnected = useDispatch();
  const dipsatchMetaBalance = useDispatch();

  const metaToken = useSelector(getMetaToken);
  const isMetaconnected = useSelector(getMetaConnected);
  const [isWrongNet, setIsWrongNet] = useState(false);
  const router = useRouter();
  const [network, setNetwork] = useState(null);
  const [displayUnlockModal, setDisplayUnlockModal] = useState(true);
  const [onboard, setOnboard] = useState(null);

  const showHeader = router.pathname.toString().includes("wallet")
    ? false
    : true;
  const subscribeMetamaskProvider = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = await ethereum;
      if (provider !== window.ethereum) {
        return;
      }
      ethereum.on("accountsChanged", handleMetaAccount);
      ethereum.on("chainChanged", (chainId) => {
        console.log("chain changed in layout", chainId);
      });
    }
  };
  const handleMetaAccount = async (accounts) => {
    console.log("handingl meta account", accounts);
    let web3 = new Web3(window.ethereum);
    if (accounts.length == 0) {
      await dispatchMetaConnected(setMetaConnected(false));
      await dispatchMetaToken(setMetaToken([]));
      await dipsatchMetaBalance(setMetaBalance(0));
    } else {
      await dispatchMetaConnected(setMetaConnected(true));
      accounts = accounts.map((account) =>
        web3.utils.toChecksumAddress(account)
      );

      await registerTalent(accounts[0]);
      await dispatchMetaToken(setMetaToken(accounts));
      web3.eth.getBalance(accounts[0], async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          await dipsatchMetaBalance(
            setMetaBalance(web3.utils.fromWei(result, "ether"))
          );
        }
      });
      if (router.pathname.toString().includes("create")) {
        // router.replace(router.asPath);
      } else {
        router.push("/");
      }
    }
  };

  const checkMetamaskUnlocked = async () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      if (!isMetaconnected || !metaToken) {
        setDisplayUnlockModal(true);
      }
    }
  };

  const checkMobileMaskUnlocked = async () => {
    const onboard = Onboard({
      dappId: process.env.ONBOARD_API_KEY, // [String] The API key created by step one above
      networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
      subscriptions: {
        wallet: (wallet) => {
          setWeb3(new Web3(wallet.provider));
        },
        address: (addres) => {
          console.log("adddres is ", address);
        },
      },
      walletSelect: {
        wallets: [{ walletName: "metamask" }],
      },
    });
    setOnboard(onboard);
    if (
      !isMetaconnected &&
      router.pathname != "/wallet" &&
      router.pathname != "/"
    ) {
      const data = await onboard.walletSelect();
      if (data) {
        const walletCheck = await onboard.walletCheck();
      }
    }
  };

  const handleOnIdle = (event) => {
    console.log("user is idle", event);
    disconnectUserWallet();
    console.log("last active", getLastActiveTime());
  };

  const disconnectUserWallet = async () => {
    await dispatchMetaConnected(setMetaConnected(false));
  };

  const { getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    subscribeMetamaskProvider();
    if (isMobileDevice()) {
      checkMobileMaskUnlocked();
    } else {
      checkMetamaskUnlocked();
    }
  }, [isMetaconnected]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rim Entertainment</title>
        <meta name="description" content="Rim Entertainment inc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showHeader == false ? (
        <div style={{ marginBottom: "-90px" }}></div>
      ) : (
        <Header />
      )}
      {children}
      {isWrongNet ? DisplayWrongNetModal() : ""}

      <Footer />

      {router.pathname != "/wallet" &&
        router.pathname.includes("create") &&
        !isMetaconnected &&
        !isMobileDevice() && <ConnectWalletModal displayModal={true} />}
    </>
  );
  async function detectNetwork() {
    let provider = await detectEthereumProvider();
    if (provider.chainId != "0x1") {
      setIsWrongNet(true);
      setNetwork(provider.chainId);
    }
  }
  function DisplayWrongNetModal() {
    let message =
      "You are connected to " +
      providers[network] +
      ".\n Please change to " +
      providers["0x1"] +
      " and reload the page";

    return (
      <Modal
        title={<strong>{"Wrong Network!"}</strong>}
        footer={false}
        visible={true}
      >
        {message}
      </Modal>
    );
  }
};

export default Layout;
