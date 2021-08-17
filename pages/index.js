import Head from "next/head";
import { useState, useEffect } from "react";
import Explore from "/Components/explore";
import HotCollections from "/Components/HotCollections";
import LiveAuctions from "/Components/liveAuctions";
import Slide from "/Components/slider/slide";
import { MainWrapper } from "/Components/StyledComponents/globalStyledComponents";
import TopSellers from "/Components/topSellers";
import request from "/Utils/axios";

function Home() {
  const [topSellers, setTopSellers] = useState([]);
  useEffect(() => {
    async function fetchingTopSellers() {
      const data = await request.get("/talents");
      setTopSellers(await data.data);
    }
    fetchingTopSellers();
  }, []);
  return (
    <MainWrapper>
      <Slide />
      <TopSellers data={topSellers} />
      <LiveAuctions />
      <HotCollections />
      <Explore />
    </MainWrapper>
  );
}

export const getServerSideProps = async () => {
  // const orders = await OpenSeaAPI.getOrders({});
  // const liveAuctions = await OpenSeaAPI.getOrders({ on_sale: true });
  // // const bundles = await OpenSeaAPI.getBundles()
  // const assets = await OpenSeaAPI.getCollections();
  // const topSellers = OpenSeaAPI.getTopSellersDetails(orders.orders);
  // const collections = OpenSeaAPI.getCollectionDetails(assets.assets);
  // const { data } = await openseaApi.getExplores();
  // const explores = OpenSeaAPI.getExploresDetails(data?.assets);
  return {
    props: {
      // topSellers: JSON.parse(JSON.stringify(topSellers)),
      // liveAuctions: JSON.parse(JSON.stringify(liveAuctions.orders)),
      // collections: JSON.parse(JSON.stringify(collections)),
      // assets: JSON.parse(JSON.stringify(assets)),
      // explores: JSON.parse(JSON.stringify(explores)),
    },
  };
};
export default Home;
