import { Tabs, Spin } from "antd";
import React, { useEffect, useState } from "react";
import {
  ProfileContainer,
  ShareButton,
  BiographyContainer,
  BioDescription,
  ProfileButton,
} from "/Components/StyledComponents/talentPage-styledComponents";
import Products from "/Components/nfts";
import {
  LoadingContainer,
  LoadMoreButton,
  MainWrapper,
} from "/Components/StyledComponents/globalStyledComponents";
import CollectionLoader from "@/components/collectionLoader";
import { useRouter } from "next/router";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.HEROKU_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const { TabPane } = Tabs;
function Profile() {
  const [isLoad, setLoad] = useState(false);
  const [talent, setTalent] = useState({
    talentAvatar: {
      url: "/images/talentCover.png",
    },
    talentBanner: {
      url: "",
    },
    talentName: "",
    assets: [],
  });
  const [onSales, setOnsales] = useState({
    assets: [],
  });
  const [owned, setOwned] = useState({
    assets: [],
  });
  const [loadMore, setLoadMore] = useState({
    onSalesOffset: 10,
    ownedOffset: 10,
    createdOffset: 10,
    onSalesLoad: true,
    ownedLoad: true,
    createdLoad: true,
    onsalesLoadMoreButtonLoading: false,
    ownedLoadMoreButtonLoading: false,
    createdLoadMoreButtonLoading: false,
  });
  const router = useRouter();
  const { profile } = router.query;

  async function LoadMoreOnsales() {
    setLoadMore({
      ...loadMore,
      onsalesLoadMoreButtonLoading: true,
    });
    const moreAssets = await api.get(
      `/talents/${profile}?offset=${loadMore.onSalesOffset}`
    );
    const assetLength = await moreAssets.data.assets.length;
    assetLength === 0
      ? setLoadMore({ ...loadMore, onSalesLoad: false })
      : (() => {
          setOnsales({
            ...onSales,
            assets: [...onSales.assets, ...moreAssets.data.assets],
          });
          setLoadMore({
            ...loadMore,
            onSalesOffset: loadMore.onSalesOffset + 10,
            onsalesLoadMoreButtonLoading: false,
          });
        })();
  }

  async function LoadMoreCreated() {
    setLoadMore({
      ...loadMore,
      createdLoadMoreButtonLoading: true,
    });
    const moreAssets = await api.get(
      `/talents/${profile}?offset=${loadMore.createdOffset}`
    );
    const assetLength = await moreAssets.data.assets.length;
    assetLength === 0
      ? setLoadMore({ ...loadMore, createdLoad: false })
      : (() => {
          setTalent({
            ...talent,
            assets: [...talent.assets, ...moreAssets.data.assets],
          });
          setLoadMore({
            ...loadMore,
            createdOffset: loadMore.createdOffset + 10,
            createdLoadMoreButtonLoading: false,
          });
        })();
  }
  useEffect(() => {
    (async function fetchingTalent() {
      if (profile != undefined) {
        const data = await api.get(`/talents/${profile}`);
        setTalent(await data.data);
        const sellOrders = await data.data.assets.filter(
          (asset) => asset.sellOrders != null
        );
        setOnsales({
          talent: { talentAvatar: { url: data.data.talentAvatar.url } },
          assets: sellOrders,
        });
        const owneds = await data.data.assets.filter(
          (asset) => asset.owner.address === data.data.walletAddress
        );
        setOwned({
          talent: { talentAvatar: { url: data.data.talentAvatar.url } },
          assets: owneds,
        });
        setLoad(true);
      }
    })();
  }, [profile]);
  return (
    <>
      <MainWrapper>
        {isLoad === false ? <CollectionLoader /> : ""}
        {isLoad ? (
          <ProfileContainer>
            <img src={talent.talentBanner?.url} />
            <BiographyContainer>
              <div className={"avatar"}>
                <img
                  alt="userAvatar"
                  src={talent.talentAvatar?.url}
                  loading="lazy"
                />
              </div>
              <BioDescription>
                <h3>
                  <strong>{talent.talentName}</strong>
                </h3>
                <h6>
                  <strong>{`addressToShow`}</strong>
                </h6>
                <div className="mt-4">
                  <ProfileButton type="button">
                    <ShareButton />
                  </ProfileButton>
                  <ProfileButton type="button">{"..."}</ProfileButton>
                </div>
              </BioDescription>
            </BiographyContainer>
          </ProfileContainer>
        ) : (
          ""
        )}
        <Tabs defaultActiveKey="1">
          <TabPane tab="On Sale" key="1">
            <>
              <Products data={onSales} />
              {isLoad ? (
                loadMore.onSalesLoad ? (
                  loadMore.onsalesLoadMoreButtonLoading ? (
                    <LoadMoreButton block shape={"round"} size={"large"}>
                      <Spin></Spin>
                    </LoadMoreButton>
                  ) : (
                    <LoadMoreButton
                      block
                      shape={"round"}
                      size={"large"}
                      onClick={() => LoadMoreOnsales()}
                    >
                      Load More
                    </LoadMoreButton>
                  )
                ) : null
              ) : null}
            </>
          </TabPane>

          <TabPane tab="Owned" key="2">
            <>
              <Products data={owned} />
              <LoadMoreButton block shape={"round"} size={"large"}>
                {"Load More"}
              </LoadMoreButton>{" "}
            </>
          </TabPane>

          <TabPane tab="Created" key="3">
            <Products data={talent} />
            {isLoad ? (
              loadMore.createdLoad ? (
                loadMore.createdLoadMoreButtonLoading ? (
                  <LoadMoreButton block shape={"round"} size={"large"}>
                    <Spin></Spin>
                  </LoadMoreButton>
                ) : (
                  <LoadMoreButton
                    block
                    shape={"round"}
                    size={"large"}
                    onClick={() => LoadMoreCreated()}
                  >
                    Load More
                  </LoadMoreButton>
                )
              ) : null
            ) : null}
          </TabPane>
        </Tabs>
      </MainWrapper>
    </>
  );
}

export default Profile;
