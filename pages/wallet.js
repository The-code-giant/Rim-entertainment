import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import HandleNotification from "/Components/commons/handleNotification";
import { isMobileDevice, providerOptions } from "/Constants/constants";
import styles from "/styles/wallet.module.css";
import AsyncLocalStorage from "@createnextapp/async-local-storage";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Wallet = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);
  const [metamaskWeb3Modal, setMetamaskWeb3Modal] = useState(null);
  const [metamaskWeb3, setMetamaskWeb3] = useState(null);
  const [metamaskProvider, setMetamaskProvider] = useState(null);
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [mobileWeb3Modal, setMobileWeb3Modal] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [mobileWalletProvider, setMobileWalletProvider] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [chainId, setChainId] = useState(1);
  const [networkId, setNetworkId] = useState(1);
  const [accounts, setAccounts] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    isUserConnectedToAnyWallet();
    subscribeMetamaskProvider();
    if (typeof window !== "undefined") {
      const browserModal = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions,
      });

      const mobileModal = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: true,
      });

      setIsMobile(isMobileDevice());
      if (mobileModal.cachedProvider && isMobile) {
        onMobileConnect();
      }
      setMetamaskWeb3Modal(browserModal);
      setMobileWeb3Modal(mobileModal);
    }
  }, []);

  const isUserConnectedToAnyWallet = async () => {
    try {
      const metadata = JSON.parse(
        await AsyncLocalStorage.getItem("metamaskconnect")
      );
      const walletData = JSON.parse(
        await AsyncLocalStorage.getItem("walletconnect")
      );
      if (metadata != null) {
        setMetamaskConnected(true);
        router.push("/");
      } else {
        setMetamaskConnected(false);
      }

      if (walletData != null) {
        setIsWalletConnected(true);
        router.push("/");
      } else {
        setIsWalletConnected(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const initWeb3 = (provider) => {
    const web3 = new Web3(provider);
    web3.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    });

    return web3;
  };

  const connectToMetamask = async (wallet) => {
    const mp = await metamaskWeb3Modal.connectTo(wallet);
    await setMetamaskProvider(mp);
    const metamaskWeb3 = initWeb3(mp);
    await setMetamaskWeb3(metamaskWeb3);
    const accounts = await metamaskWeb3.eth.getAccounts();
    const address = accounts[0];
    const chainId = await metamaskWeb3.eth.chainId();
    const networkId = await metamaskWeb3.eth.net.getId();

    await setAddress(address);
    await setChainId(chainId);
    await setNetworkId(networkId);
    const metamaskconnect = { accounts, chainId, networkId };
    await storeMetamaskDetails(metamaskconnect);
  };

  const subscribeMetamaskProvider = async () => {
    if (!window.ethereum.on) {
      return;
    }
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length == 0) {
        logoutUser();
      } else {
        loginUser();
      }
    });

    window.ethereum.on("disconnect", () => {
      console.log("disconect from metamsk");
      logoutUser();
    });

    window.ethereum.on("accountsChanged", async (accounts) => {
      console.log("account changed");
      if (accounts.length == 0) {
        logoutUser();
      } else {
        loginUser();
      }
    });
    window.ethereum.on("chainChanged", async (chainId) => {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      await setChainId(chainId);
      await setNetworkId(networkId);
    });
  };

  const storeMetamaskDetails = async (metamask) => {
    try {
      const metadata = JSON.parse(
        await AsyncLocalStorage.getItem("metamaskconnect")
      );

      if (metadata != null) {
        console.log("metamask account :", metadata);
      } else {
        await AsyncLocalStorage.setItem(
          "metamaskconnect",
          JSON.stringify(metamask)
        );
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async () => {
    const metadata = await AsyncLocalStorage.getItem("metamaskconnect");
    if (metadata != null) {
      console.log("removing");
      await AsyncLocalStorage.removeItem("metamaskconnect");
      setFetching(false);
      setAccounts(null);
      setAddress(null);
      setWeb3(null);
      setMobileWalletProvider(null);
      setIsWalletConnected(false);
      setChainId(1);
      setNetworkId(1);
    }
  };

  const loginUser = async () => {
    console.log("user is logged in");
    try {
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const comingSoon = () => {
    HandleNotification(
      "info",
      "Comming Soon",
      "Portis Support Will be Available soon",
      "topLeft"
    );
  };

  const onMobileConnect = async () => {
    const provider = await mobileWeb3Modal.connect();
    await subscribeWalletProvider(provider);
    const web3 = initWeb3(provider);
    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.chainId();
    await setWeb3(web3);
    await setMobileWalletProvider(provider);
    await setIsWalletConnected(true);
    await setAccounts(accounts);
    await setAddress(address);
    await setChainId(chainId);
    await setNetworkId(networkId);
  };

  const subscribeWalletProvider = async (provider) => {
    console.log("subscribing to wallet account");
    if (!mobileWalletProvider.on) {
      return;
    }
    mobileWalletProvider.on("close", () => resetWalletConnect());
    mobileWalletProvider.on("accountsChanged", async (accounts) => {
      console.log("connected from mobile wallet");
      if (accounts.length > 0) {
        loginUser();
      } else {
        logoutUser();
      }
    });
    mobileWalletProvider.on("chainChanged", async (chainId) => {
      console.log("chanin changed");
      const metamaskWeb3 = new Web3(provider);
      const networkId = await metamaskWeb3.eth.net.getId();
      await setChainId(chainId);
      await setNetworkId(networkId);
    });
    mobileWalletProvider.on("networkChanged", async (networkId) => {
      console.log("network changed");
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
    });
  };

  const disconnectWallet = async () => {
    if (isWalletConnected) {
      await resetWalletConnect();
      HandleNotification(
        "success",
        "WalletConnect Disconnected",
        "Successfully Disconnected Your Wallet",
        "topLeft"
      );
    } else {
      HandleNotification(
        "info",
        "WalletConnect",
        "You are not connected to any Mobile wallet",
        "topLeft"
      );
    }
  };

  const resetWalletConnect = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    await mobileWeb3Modal.clearCachedProvider();
    setFetching(false);
    setAccounts(null);
    setAddress(null);
    setWeb3(null);
    setMobileWalletProvider(null);
    setIsWalletConnected(false);
    setChainId(1);
    setNetworkId(1);
  };

  const antLoading = () => {
    return (
      <div>
        <LoadingOutlined style={{ fontSize: 100 }} spin />
      </div>
    );
  };

  if (metamaskConnected || isWalletConnected) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Spin indicator={antLoading} />
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.leftColumn}></div>
        <div className={styles.rightColumn}>
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <Link className={styles.navigation} href="/">
                Go Home
              </Link>
              <h1 className={styles.walletHeader}>Connect your wallet</h1>
              <p className={styles.walletParagraph}>
                Connect with one of available wallet providers or create a new
                wallet. What is a wallet?
              </p>
            </div>
            <div className={styles.wallectContainer}>
              {!isMobile && (
                <div
                  className={styles.walletCard}
                  onClick={() => connectToMetamask("injected")}
                >
                  <div className={styles.walletCardPopup}>
                    <span>Most Popular</span>
                  </div>
                  <img
                    width={28}
                    height={28}
                    src={"/images/walletIcons/metamask.svg"}
                  />
                  <div>Metamask</div>
                </div>
              )}
              <div
                className={styles.walletCard}
                onClick={() => comingSoon("Portis")}
              >
                <div className={styles.walletCardPopup}>
                  <span>Credit Card Flow</span>
                </div>
                <img
                  width={28}
                  height={28}
                  src={"/images/walletIcons/portis.svg"}
                />
                <div>Portis</div>
              </div>
              <div className={styles.walletCard} onClick={onMobileConnect}>
                <div className={styles.walletCardPopup}>
                  <span>Mobile Wallets</span>
                </div>
                <div>
                  <img
                    className={styles.walletIcon}
                    width={28}
                    height={28}
                    src={"/images/walletIcons/walletconnect-1.svg"}
                  />
                  <img
                    className={styles.walletIcon}
                    width={28}
                    height={28}
                    src={"/images/walletIcons/walletconnect-2.svg"}
                  />
                  <img
                    className={styles.walletIcon}
                    width={28}
                    height={28}
                    src={"/images/walletIcons/walletconnect-3.png"}
                  />
                </div>
                <div className={styles.walletDetails}>WalletConnect</div>
              </div>
              <div
                className={styles.walletCard}
                onClick={() => disconnectWallet()}
              >
                <div className={styles.walletCardPopup}>
                  <span>Disconnect </span>
                </div>
                <img
                  width={28}
                  height={28}
                  src={"/images/walletIcons/disconnect.svg"}
                />
                <div>Disconnect Mobile Wallet</div>
              </div>
            </div>
            <div>
              <p className={styles.walletFooter}>
                We do not own your private keys and cannot access your funds
                without your confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
export default Wallet;
