import Header from "/Components/header";
import Head from "next/head";
import LiveAuctions from "/Components/liveAuctions";
import Explore from "/Components/explore";
import Footer from "/Components/footer";
import TopSellers from "/Components/topSellers";
import Slide from "/Components/slider/slide";
import HotCollections from "/Components/HotCollections";
import { useEffect, useState } from "react";
import OpenSeaAPI from "../api/openseaApi";
import {
  accountList,
  getAuctionTimesDetail,
  getAuctionPriceDetails,
  getAuctionUserDetails,
  isMobileDevice,
} from "../../Constants/constants";
import HandleNotification from "/Components/commons/handleNotification";
import { MainWrapper } from "/Components/StyledComponents/globalStyledComponents";
import _ from "lodash";
function Home() {
  const [bundles, setBundles] = useState([]);
  const [topSellers, setTopSellers] = useState();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [collections, setCollections] = useState();
  const [explores, setExplores] = useState();
  useEffect(() => {
    initData();
  }, []);
  const initData = () => {
    if (!isMobileDevice())
      window.ethereum.on("accountsChanged", function (accounts) {
        console.log(accounts);
      });

    loadBundles();
    loadLiveAuctions();
    loadTopSellers();
    loadCollections();
    loadExplores();
  };
  const loadBundles = async () => {
    const bundleResult = OpenSeaAPI.getBundles();
    bundleResult
      .then((bundles) => {
        setBundles(bundles);
      })
      .catch((e) =>
        HandleNotification("error", e.message, "Server Is Not Available")
      );
  };
  const loadLiveAuctions = () => {
    const liveAuctions = OpenSeaAPI.getLiveAuctions();
    liveAuctions
      .then((auctions) => {
        setLiveAuctions(auctions);
      })
      .catch((e) =>
        HandleNotification("error", e.message, "Server Is Not Available")
      );
  };
  const loadTopSellers = () => {
    const topSellerResult = OpenSeaAPI.getTopSellers();
    topSellerResult
      .then((tops) => {
        const topSellers = OpenSeaAPI.getTopSellersDatails(tops);
        setTopSellers(topSellers);
      })
      .catch((e) =>
        HandleNotification("error", e.message, "Server Is Not Available")
      );
  };
  const loadCollections = () => {
    const collectionsResult = OpenSeaAPI.getCollections();
    collectionsResult
      .then((collections) => {
        let cols = OpenSeaAPI.getCollectionDetails(collections);
        setCollections(cols);
      })
      .catch((e) =>
        HandleNotification("error", e.message, "Server Is Not Available")
      );
  };
  const loadExplores = () => {
    const exploresResult = OpenSeaAPI.getExplores();
    exploresResult
      .then((explores) => {
        const exps = OpenSeaAPI.getExploresDetails(explores);
        console.log(exps);
        setExplores(explores);
      })
      .catch((e) =>
        HandleNotification("error", e.message, "Server Is Not Available")
      );
  };
  return (
    <>
      <Head>
        <title>Rim Entertainment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <MainWrapper>
        <Slide />
        <TopSellers data={topSellers} />
        <LiveAuctions data={liveAuctions} />
        <HotCollections data={collections} />
        <Explore data={explores} />
      </MainWrapper>
      <Footer />
    </>
  );
}
export default Home;
