import Link from "next/link";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import styles from "/styles/wallet.module.css";
import { isMobile } from "react-device-detect";
import MetaMaskOnboarding from "@metamask/onboarding";

// const STRAPI_BASE_URL = process.env.HEROKU_BASE_URL;
// const STRAPI_BASE_URL = process.env.HEROKU_BASE_TNC;
import {
  setMetaConnected,
  getMetaToken,
  setMetaBalance,
  setMetaToken,
} from "/store/action/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useOnboard } from "use-onboard";

import Onboard from "bnc-onboard";
import { getCurrentAccount, registerTalent } from "Utils/utils";
import InstallMetamaskModal from "/components/commons/InstallMetamaskModal";
import CustomNotification from "/components/commons/customNotification";
const Wallet = () => {
  const router = useRouter();
  const dispatchMetaConnected = useDispatch();
  const dispatchMetaToken = useDispatch();
  const dipsatchMetaBalance = useDispatch();
  const metaToken = useSelector(getMetaToken);

  const [displayInstallModal, setDisplayInstallModal] = useState();
  const { selectWallet, address, isWalletSelected, disconnectWallet, balance } =
    useOnboard({
      options: {
        dappId: process.env.ONBOARD_API_KEY, // optional API key
        networkId: 4, // Ethereum network ID
        walletSelect: {
          wallets: [
            {
              walletName: "metamask",
              rpcUrl:
                "https://rinkeby.infura.io/v3/c2dde5d7c0a0465a8e994f711a3a3c31",
            },
          ],
        },
      },
    });

  const [onboard, setOnboard] = useState(null);

  const [web3, setWeb3] = useState(null);

  const onDesktopConnect = async () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isConnected) {
      console.log("wallet is connected from walled modal");
      let web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        console.log("accounts are", accounts);
        presisMetamask(accounts);
      } else {
        console.log("request to connect to metamask from walled modal");
        if (ethereum && ethereum.isMetaMask) {
          ethereum
            .request({ method: "eth_requestAccounts" })
            .then(handleNewAccounts)
            .catch((error) => {
              if (error.code === 4001) {
                CustomNotification(
                  "warning",
                  "Metamask",
                  "You must accept wallet connection "
                );
              } else {
                console.error(error);
              }
            });
          ethereum.on("accountsChanged", handleNewAccounts);
        }
      }
    }
  };

  const onMobileConnect = async () => {
    if (metaToken != null && metaToken.length > 0) {
      await dispatchMetaConnected(setMetaConnected(true));
      router.push("/");
    } else {
      await onboard.walletSelect();
    }
  };

  const initBoard = async () => {
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
  };

  useEffect(() => {
    if (isMobile) {
      initBoard();
    }
  }, []);

  const presisMetamask = async (accounts) => {
    let web3 = new Web3(window.ethereum);
    await dispatchMetaConnected(setMetaConnected(true));
    accounts = accounts.map((account) => web3.utils.toChecksumAddress(account));

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
    router.push("/");
  };

  const handleNewAccounts = (newAccounts) => {
    if (newAccounts.length > 0) {
      presisMetamask(newAccounts);
    }
  };
  return (
    <div className={styles.container}>
      <InstallMetamaskModal displayModal={displayInstallModal} />
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
                onClick={() => onDesktopConnect("injected")}
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

            {isMobile && (
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
            )}
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
};
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
export default Wallet;
