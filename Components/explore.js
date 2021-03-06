import React, { useState, useEffect } from "react";
import Products from "/Components/nfts";
import Link from "next/link";
import { Spin } from "antd";
import EXPLORE_CONSTANTS from "/Constants/exploreConstants";
import {
  CategoriesListContainer,
  CategoriesListScroll,
  CategoriesList,
} from "./StyledComponents/explore-styledComponents";
import {
  SectionHeading,
  LoadingContainer,
  LoadMoreButton,
} from "./StyledComponents/globalStyledComponents";
import { useRouter } from "next/router";
import api from "/Components/axiosRequest";

function Explore({ assets, categories }) {
  const router = useRouter();
  const { cat } = router.query;


  const [isLoad, setLoad] = useState(true);
  const [explores, setExplores] = useState(assets);
  const [loadMore, setLoadMore] = useState({
    dataLimit: 15,
    dataStart: 0,
    countBy: 15,
    dataLoad: true,
    dataLoadMoreButtonLoading: false,
  });
  async function LoadMoreData(slug) {
    setLoadMore({
      ...loadMore,
      dataLoadMoreButtonLoading: true,
    });
    const fetchedData = await api.get(
      `/categories/${slug}?limit=${loadMore.dataLimit}&offset=${loadMore.dataStart}`
    );
    const assetLength = fetchedData.data.assets.length;
    assetLength === 0
      ? setLoadMore({ ...loadMore, dataLoad: false })
      : (() => {
        setExplores({
          ...explores,
          assets: [...explores.assets, ...fetchedData.data.assets],
        });
        setLoadMore({
          ...loadMore,
          dataStart: loadMore.dataStart + loadMore.countBy,
          dataLoadMoreButtonLoading: false,
        });
      })();
  }



  return (
    <>
      <div>
        <CategoriesListContainer>
          {categories?.length > 0 && <SectionHeading>{EXPLORE_CONSTANTS.explore}</SectionHeading>}
          <CategoriesListScroll>
            <CategoriesList className={"m-2"}>
              {categories && categories.map((category, v) => (
                <Link key={v} href={`/?cat=${category.slug}`} passHref>
                  <li className={cat == category.slug ? "active" : ""}>{`${category.icon ? category.icon : ""
                    } ${category.categoryName}`}</li>
                </Link>
              ))}
            </CategoriesList>
          </CategoriesListScroll>
        </CategoriesListContainer>
        {explores ? (
          <>
            {explores && <Products data={explores} />}
            {
              loadMore.dataLoad ? (
                loadMore.dataLoadMoreButtonLoading ? (
                  <LoadMoreButton block shape={"round"} size={"large"}>
                    <Spin></Spin>
                  </LoadMoreButton>
                ) : (
                    <LoadMoreButton
                      block
                      shape={"round"}
                      size={"large"}
                      onClick={() => LoadMoreData(cat ? cat : "all")}
                    >
                      Load More
                    </LoadMoreButton>
                  )
              ) : null
            }

          </>
        ) : (
            <LoadingContainer>
              <Spin />
            </LoadingContainer>
          )}
      </div>
    </>
  );
}
export default Explore;
