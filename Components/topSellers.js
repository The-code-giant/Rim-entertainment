import "react-multi-carousel/lib/styles.css";

import {
  AvatarContainer,
  ListCounter,
  SellerDetails,
  SellerName,
  SellerPrice,
  TopSellerContainer,
  TopSellerItem,
} from "./StyledComponents/topSeller-styledComponents";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { SectionHeading } from "./StyledComponents/globalStyledComponents";
import { fetch } from "Utils/strapiApi";
import { randomAvatar } from "Utils/utils";

function TopSellers({ talents }) {
  return (
    <>
      <div className="pt-3">
        <SectionHeading>{"Recent Talents"}</SectionHeading>
        {/* {topSelers[0]?.assets?.length ? (
          <SectionHeading>{"Top Sellers"}</SectionHeading>
        ) : (
          ""
        )} */}
      </div>
      <TopSellerContainer>
        {talents &&
          talents.map((seller, index) => (
            <Link
              key={index}
              href={{
                pathname: `/profile/${seller.walletAddress}`,
              }}
            >
              <a>
                <TopSellerItem
                  key={seller.name}
                  onClick={() => topSellerDetails(seller)}
                >
                  <ListCounter>{index + 1}</ListCounter>
                  <AvatarContainer>
                    <img
                      src={
                        seller?.talentAvatar?.url
                          ? seller?.talentAvatar?.url
                          : randomAvatar()
                      }
                    />
                  </AvatarContainer>
                  <SellerDetails>
                    <SellerName key={seller?.talentName + seller?.talentName}>
                      {seller.talentName ? seller.talentName : "Anonymous"}
                    </SellerName>
                    <SellerPrice>
                      {/* {seller.stats?.average_price} */}
                      {/* {seller.number_of_assets + " assets"} */}
                      {`${seller?.assets?.length
                          ? seller?.assets?.length + " assets"
                          : ""
                        } `}
                    </SellerPrice>
                  </SellerDetails>
                </TopSellerItem>
              </a>
            </Link>
          ))}
      </TopSellerContainer>
    </>
  );
}

export default TopSellers;
