import React from "react";
import { Modal } from "antd";
import Link from "next/link";
import styles from "/styles/connectWalletModal.module.css";
import { isMobile } from "react-device-detect";
import HandleNotification from "./handleNotification";
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
    if (metaToken && metaToken.length > 0) {
      await dispatchMetaConnected(setMetaConnected(true));
    } else {
      if (typeof window.ethereum !== "undefined" && ethereum.isMetaMask) {
        const { ethereum } = window;
        let web3 = new Web3(window.ethereum);
        ethereum
          .request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          })
          .then((permissions) => {
            const accountsPermission = permissions.find(
              (permission) => permission.parentCapability === "eth_accounts"
            );
            if (accountsPermission) {
              (async () => {
                const accounts = await ethereum.request({
                  method: "eth_requestAccounts",
                });
                await dispatchMetaConnected(setMetaConnected(true));
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
              })();
            }
          })
          .catch((error) => {
            if (error.code === 4001) {
              HandleNotification(
                "warning",
                "Metamask",
                "User rejected wallet connection "
              );
            } else {
              console.error(error);
            }
          });
      }
    }
  };
  const onMobileConnect = async () => {
    console.log("connnecting with mobile");
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
        {!isMobile && (
          <div className={styles.walletCard} onClick={onDesktopConnect}>
            <img
              className={styles.walletIcon}
              width={100}
              height={100}
              src={"/images/walletIcons/metamask.svg"}
            />
            <div className={styles.metamaskButton}>
              {"Connect with metamask"}
            </div>
          </div>
        )}

        {isMobile && (
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
        )}
      </div>
    </Modal>
  );
};
export default ConnectWalletModal;
