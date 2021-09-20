import { useEffect, useState } from "react";

import Explore from "/Components/explore";
import FixedSells from "@/components/fixedSells";
import HotCollections from "/Components/HotCollections";
import LiveAuctions from "/Components/liveAuctions";
import { MainWrapper } from "/Components/StyledComponents/globalStyledComponents";
import Slide from "/Components/slider/slide";
import TopSellers from "/Components/topSellers";
import { fetch } from "Utils/strapiApi";

function Home({ sells }) {
  const [topSellers, setTopSellers] = useState([]);
  const [auctionPrice, setAuctionPrice] = useState();
  const [fixedPrice, setFixedPrice] = useState();
  const loadData = () => {
    let auctions = [];
    let fixeds = [];
    sells.map((item) =>
      item.side == 1 ? auctions.push(item) : fixeds.push(item)
    );
    console.log("auctions", auctions);
    console.log("fixed", fixeds);
    setAuctionPrice(auctions);
    setFixedPrice(fixeds);
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <MainWrapper>
      <Slide />
      <TopSellers />
      {auctionPrice && <LiveAuctions data={auctionPrice} />}
      {fixedPrice && <FixedSells data={fixedPrice} />}
      <HotCollections />
      <Explore />
    </MainWrapper>
  );
}

export const getServerSideProps = async () => {
  const sellsResult = await fetch("/sells");
  const sells = sellsResult.data[0].sells;
  // // const bundles = await OpenSeaAPI.getBundles()
  // const assets = await OpenSeaAPI.getCollections();
  // const topSellers = OpenSeaAPI.getTopSellersDetails(orders.orders);
  // const fixPriceSellsResult = await fetch("/nfts/fixed");
  // const fixPriceSells = fixPriceSellsResult.data;

  // const collectionResult = await fetch("/collections");
  // const collections = collectionResult.data;
  // const { data } = await openseaApi.getExplores();
  // const explores = OpenSeaAPI.getExploresDetails(data?.assets);
  return {
    props: {
      sells: JSON.parse(JSON.stringify(sells)),
      // liveAuctions: JSON.parse(JSON.stringify(auctions)),
      // serverFixedPriceSells: JSON.parse(JSON.stringify(fixPriceSells)),
      // serverCollections: JSON.parse(JSON.stringify(collections)),
      // assets: JSON.parse(JSON.stringify(assets)),
      // explores: JSON.parse(JSON.stringify(explores)),
    },
  };
};
export default Home;
