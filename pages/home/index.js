import Header from "/Components/header";
import Head from "next/head";
import LiveAuctions from "/Components/liveAuctions";
import Explore from "/Components/explore";
import Footer from "/Components/footer";
import TopSellers from "/Components/topSellers";
import Slide from "/Components/slider/slide";
import HotCollections from "/Components/HotCollections";
import { useEffect, useState } from "react";
import useApi from "../../Components/hooks/useApi";
import OpenSeaAPI from "../api/openSeaAPI";
import { accountLIst, assetTokens } from "../../Constants/constants";
import openSeaAPI from "../api/openSeaAPI";
function Home() {
  const [items, setItems] = useState(null);
  const [bundles, setBundles] = useState();
  const [topSellers, setTopSellers] = useState(null);
  const [liveAuctions, setLiveAuctions] = useState(null);
  const [explore, setExplore] = useState(null);
  const [collections, setCollections] = useState(null);
  const [accountAddress, setAccountAddress] = useState(accountLIst[1]);

  useEffect(() => {
    loadBundles();
    loadTopSellers();
    loadCollections();
  }, []);

  const loadBundles = async () => {
    const result = await openSeaAPI.getBundles(accountAddress);

    if (result.ok) {
      const bundles = result.data?.bundles;
      console.log(bundles);
      setBundles(bundles);
    }
  };

  // this function is not complete
  const loadTopSellers = async () => {
    const result = await OpenSeaAPI.getAssetsListByOwner(accountAddress);
    if (result.ok) {
      const assets = await result.data.assets;
      // setTopSellers(assets);
    }
  };
  const loadCollections = async () => {
    const result = await OpenSeaAPI.getCollections(accountAddress);
    if (result.ok) {
      const collections = await result.data;
      setCollections(collections);
    }
  };

  return (
    <>
      <Head>
        <title>Rim Entertainment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header /> */}
      <div style={{ maxWidth: 1400, margin: "auto" }}>
        <Slide />
        <TopSellers data={topSellers} />
        <LiveAuctions data={items} />
        <HotCollections data={collections} />
        <Explore data={bundles} />
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Home;
