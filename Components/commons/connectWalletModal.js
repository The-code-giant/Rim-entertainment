import React from "react";
import { Modal } from "antd";
import Link from "next/link";
import styles from "/styles/connectWalletModal.module.css";
import { isMobile } from "react-device-detect";
import CustomNotification from "/Components/commons/customNotification";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountTokens,
  getMetaConnected,
  getMetaToken,
  getWalletConnected,
  getWalletToken,
  setMetaBalance,
  setMetaConnected,
  setMetaToken,
} from "store/action/accountSlice";
import Web3 from "web3";
import { registerTalent } from "Utils/utils";

const ConnectWalletModal = ({ displayModal }) => {
  const dispatchMetaConnected = useDispatch();
  const dispatchMetaToken = useDispatch();
  const dipsatchMetaBalance = useDispatch();
  const metaToken = useSelector(getMetaToken);

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
                  "User must accept wallet connection "
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
  };

  const handleNewAccounts = (newAccounts) => {
    if (newAccounts.length > 0) {
      presisMetamask(newAccounts);
    }
  };

  const onMobileConnect = async () => {
    console.log("connnecting with mobile");
    const web3 = new Web3(window.ethereum);
    const onboard = Onboard({
      dappId: process.env.ONBOARD_API_KEY, // [String] The API key created by step one above
      networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
      subscriptions: {
        wallet: (wallet) => {
          console.log("wallet is ", wallet);
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
    if (!isMetaconnected) {
      const data = await onboard.walletSelect();
      if (data) {
        const walletCheck = await onboard.walletCheck();
        console.log("walletselct is ", data);
        console.log("wallet checi is ", walletCheck);
      }
    }
  };

  return (
    <Modal
      title="Please Connect your wallet"
      visible={displayModal}
      header={null}
      footer={null}
      closable={false}
      width={500}
      height={400}
      maskStyle={{
        backgroundColor: "#EEEEEE",
        opacity: 0.1,
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.navigateHome}>
          <Link
            className={styles.modalButton}
            href={{
              pathname: `/`,
            }}
          >
            <span className={styles.linkSpan}>{"Go Home"}</span>
          </Link>
        </div>
        {/* {!isMobile && ( */}
        <div className={styles.walletCard} onClick={onDesktopConnect}>
          <img
            className={styles.walletIcon}
            width={100}
            height={100}
            src={"/images/walletIcons/metamask.svg"}
          />
          <div className={styles.metamaskButton}>{"Connect with metamask"}</div>
        </div>
        {/* )} */}

        {/* {isMobile && (
          <div className={styles.walletCard} onClick={onMobileConnect}>
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
        )} */}
      </div>
    </Modal>
  );
};
export default ConnectWalletModal;
