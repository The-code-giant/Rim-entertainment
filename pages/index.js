import { useEffect, useState } from "react";

import Explore from "/Components/explore";
import HotCollections from "/Components/HotCollections";
import { MainWrapper } from "/Components/StyledComponents/globalStyledComponents";
import Slide from "/Components/slider/slide";
import TopSellers from "/Components/topSellers";
import { fetch } from "Utils/strapiApi";
import api from "/Components/axiosRequest";
const LIMIT = 15;
function Home({ slides, talents, collections, exploreAssets }) {
  return (
    <MainWrapper>
      <Slide slides={slides} />
      <TopSellers talents={talents} />
      <HotCollections collections={collections} />
      <Explore assets={exploreAssets} categories={slides} />
    </MainWrapper>
  );
}

export const getServerSideProps = async ({ query }) => {
  const slug = query.cat ? query.cat : "all";
  const slides = await api.get("/categories?_sort=id:ASC");
  const talents = await fetch("/talents");
  const collections = await fetch("/collections");
  const exploreAssets = await api.get(
    `/categories/${slug}?limit=${LIMIT}&offset=0`
  );
  return {
    props: {
      // fixPricesData: JSON.parse(JSON.stringify(fixeds)),
      // acutionPricesData: JSON.parse(JSON.stringify(acutions)),
      slides: slides.data,
      talents: talents.data,
      collections: collections.data,
      exploreAssets: exploreAssets.data

    },
  };
};
export default Home;
