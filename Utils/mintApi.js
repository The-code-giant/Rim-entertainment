import collectionArtifact from "./../build/contracts/Rimable.json";

import Web3 from "web3";
import axios from "axios";
import { slugify } from "./utils";
import detectEthereumProvider from "@metamask/detect-provider";
const COLLECTION_SUFFIX = process.env.COLLECTION_SUFFIX;
const STRAPI_BASE_URL = process.env.HEROKU_BASE_URL;
// const STRAPI_BASE_URL = process.env.HEROKU_BASE_TNC;
// const STRAPI_BASE_URL = process.env.STRAPI_LOCAL_BASE_URL;
const EXTERNAL_LINK = process.env.EXTERNAL_LINK;
const RINKEBY_PROXY_ADDRESS = process.env.RINKEBY_PROXY_ADDRESS;
const RINKEBY_API_KEY = process.env.RINKEBY_API_KEY;
const RINKEBY_NODE_URL_WSS = process.env.RINKEBY_NODE_URL_WSS;
const RINKEBY_NODE = `${RINKEBY_NODE_URL_WSS}${RINKEBY_API_KEY}`;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export const capitalizeWorkd = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * this function is for searching duplicate entry in array, return true if duplicate found and
 * also return a message for more information
 * @param array the array want to search for duplicate
 * @param input the value we are searching for duplicate
 * @param searchField the field name we are looking for in array (firstname, lastname)
 */
export const checkForDuplicate = (array, input, searchField, label) => {
  if (
    !input
      ?.toString()
      .trim()
      .match(/^[a-zA-Z ]*$/)
  ) {
    return {
      isDuplicate: true,
      message: `× ${capitalizeWorkd(
        label
      )} Must contain Only Alphabet Characters`,
    };
  }
  if (!input != null && input != "") {
    if (!input?.replace(/\s/g, "").length) {
      return {
        isDuplicate: true,
        message: `× ${capitalizeWorkd(
          label
        )} can not be only whitespace (ie. spaces, tabs or line breaks)`,
      };
    }
    const isDuplicate = array.some(
      (item) =>
        item[searchField] == input.toString().trim() + " " + COLLECTION_SUFFIX
    );
    if (isDuplicate) {
      return {
        isDuplicate,
        message: `× ${capitalizeWorkd(searchField)} is already taken`,
      };
    } else {
      return {
        isDuplicate,
        message: `✔ This ${capitalizeWorkd(searchField)} is available.`,
      };
    }
  }
};

/**
 * this function is for generating slug for collection
 * @param array the array want to search for duplicate
 * @param input the value we are searching for duplicate
 * @param searchField the field name we are looking for in array (firstname, lastname)
 */
export const getTokenId = async (txHash) => {
  const web3 = new Web3(window.ethereum);
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    const tokenId = await web3.utils.hexToNumber(receipt.logs[0].topics[3]);
    console.log(
      "token id from hash is here::::",
      web3.utils.hexToNumber(receipt.logs[0].topics[3])
    );
    return {
      tokenId,
      success: true,
      message: "Token id is valid",
    };
  } catch (e) {
    return {
      success: false,
      message: "Token id is not available",
    };
  }
};

export const validateImage = (file, limitSize) => {
  if (!file) {
    return {
      message: "NFT Image is Required",
      status: false,
    };
  } else {
    let typeStatus = checkFileType(file);
    let sizeStatus = checkFileSize(file, limitSize);
    if (!sizeStatus.isSizeValid) {
      return {
        message: sizeStatus.message,
        status: false,
      };
    } else if (!typeStatus.isTypeValid) {
      return {
        message: typeStatus.message,
        status: false,
      };
    } else {
      return {
        message: null,
        status: true,
      };
    }
  }
};

export const checkFileType = (file) => {
  if (
    [
      "image/jpeg",
      "image/png",
      "image/svg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ].includes(file.type)
  ) {
    return { mediaType: "image", message: null, isTypeValid: true };
  } else if (
    [
      "video/mp4",
      "video/webm",
      "video/mp3",
      "video/wav",
      "video/ogg",
      "video/glb",
      "video/gltf",
    ].includes(file.type)
  ) {
    return { mediaType: "video", message: null, isTypeValid: true };
  } else {
    return {
      mediaType: "undefined",
      message: "Media Type is Invalid",
      isTypeValid: false,
    };
  }
};

export const checkFileSize = (file, sizeLimit) => {
  if (file) {
    const mbSize = Math.round(file.size / 1024 / 1024);
    if (mbSize < sizeLimit) {
      return {
        size: mbSize,
        isSizeValid: true,
        message: "File Size is Valid",
      };
    }
    return {
      size: mbSize,
      isSizeValid: false,
      message: `File is Too Large, File size should be less than ${sizeLimit} MB`,
    };
  }
};

export const pinFileToPinata = async (file) => {
  const pinataData = new FormData();
  pinataData.append("file", file);
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  try {
    const response = await axios.post(url, pinataData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${pinataData._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });
    return {
      success: true,
      pinataUrl: `https://topnftcollectibles.mypinata.cloud/ipfs/${response.data.IpfsHash}`,
      ipfsUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`,
      data: `${JSON.stringify(response.data)}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  // .then(function (response) {
  //   return {
  //     success: true,
  //     pinataUrl: `https://topnftcollectibles.mypinata.cloud/ipfs/${response.data.IpfsHash}`,
  //     ipfsUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`,
  //     data: `${JSON.stringify(response.data)}`,
  //   };
  // })
  // .catch(function (error) {
  //   return {
  //     success: false,
  //     message: error.message,
  //   };
  // });
};

export const pinJSONToIPFS = async (metaContent, mediaType) => {
  const metadata = {
    pinataMetadata: {
      name: (metaContent.name + " - " + mediaType).toUpperCase(),
    },
    pinataContent: metaContent,
  };

  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    const response = await axios.post(url, metadata, {
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return {
      success: true,
      pinataUrl: `https://topnftcollectibles.mypinata.cloud/ipfs/${response.data?.IpfsHash}`,
      ipfsUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`,
      data: `${JSON.stringify(response.data)}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  // const response = await axios
  //   .post(url, metadata, {
  //     maxContentLength: "Infinity",
  //     headers: {
  //       pinata_api_key: PINATA_API_KEY,
  //       pinata_secret_api_key: PINATA_SECRET_KEY,
  //     },
  //   })
  //   .then(function (response) {
  //     return {
  //       success: true,
  //       pinataUrl: `https://topnftcollectibles.mypinata.cloud/ipfs/${response.data?.IpfsHash}`,
  //       ipfsUrl: `https://ipfs.io/ipfs/${response.data.IpfsHash}`,
  //       data: `${JSON.stringify(response.data)}`,
  //     };
  //   })
  //   .catch(function (error) {
  //     return {
  //       success: false,
  //       message: error.message,
  //     };
  //   });
};

export const deployCollection = async (logo, banner, values, ownerAddress) => {
  const { ethereum } = window;
  let web3 = new Web3(ethereum);
  let collectionData = new Object();
  const logoFileResult = await pinFileToPinata(logo);
  const bannerFileResult = await pinFileToPinata(banner);
  const owner = web3.utils.toChecksumAddress(ownerAddress);
  // let nonceValue;
  const nonceValue = await web3.eth.getTransactionCount(owner);

  console.log("collection suffix is ", COLLECTION_SUFFIX);
  if (logoFileResult.success && bannerFileResult.success) {
    const logoIpfsUrl = logoFileResult.pinataUrl;
    const bannerIpfsUrl = bannerFileResult.pinataUrl;
    const metadata = {
      name: values.collectionName + " " + COLLECTION_SUFFIX,
      description: values.description,
      image: logoIpfsUrl,
      banner: bannerIpfsUrl,
      external_link: EXTERNAL_LINK,
    };

    const collectionMetadataResult = await pinJSONToIPFS(
      metadata,
      "collection"
    );
    if (collectionMetadataResult.success == true) {
      const collectionUri = collectionMetadataResult.pinataUrl;
      const proxyAddress = web3.utils.toChecksumAddress(RINKEBY_PROXY_ADDRESS);

      const deployResult = await new web3.eth.Contract(collectionArtifact.abi)
        .deploy({
          name: metadata.name,
          data: collectionArtifact.bytecode,
          arguments: [
            proxyAddress,
            metadata.name,
            metadata.name.toUpperCase(),
            collectionUri,
          ],
        })
        .send({
          type: "0x2",
          from: owner,
          nonce: nonceValue,
        })
        .catch((error) => {
          if (error.code == 4001) {
            return {
              success: false,
              rejected: true,
              message: "User denied transaction signature",
            };
          } else if (error.code == 32602) {
            return {
              success: false,
              rejected: false,
              message: "Metamask, The parameters were invalid",
            };
          } else if (error.code == 32603) {
            return {
              success: false,
              rejected: false,
              message: "Metamask Internal error",
            };
          } else {
            console.log("in try error ", error);
            return {
              success: false,
              rejected: false,
              message:
                "Metamask Transaction Failed Make Sure Your Metamask wallet is connected and unlocked",
            };
          }
        });

      console.log("deploy reslt is ", deployResult);
      if (deployResult.rejected == true) {
        return {
          success: false,
          rejected: true,
          message: "User denied transaction signature",
        };
      } else if (deployResult.success == false) {
        return {
          success: false,
          rejected: false,
          message:
            "Metamask Transaction Failed Make Sure Your Metamask wallet is connected and unlocked",
        };
      } else {
        collectionData.contractAddress = deployResult._address;
        collectionData.talentAddress = ownerAddress;
        collectionData.talent = values.talent;
        collectionData.collectionName =
          values.collectionName + " " + COLLECTION_SUFFIX;
        collectionData.slug = slugify(
          values.collectionName.toString() + " " + COLLECTION_SUFFIX
        );
        collectionData.metadata = metadata;
        return await uploadCollectionToStrapi(logo, banner, collectionData);
      }
    } else {
      return collectionMetadataResult;
    }
  } else {
    return {
      success: false,
      rejected: false,
      message: "Your File is not uploaded to blockchain",
    };
  }
};

export const uploadNft = async (file, values, ownerAddress) => {
  let nftData = new Object();
  let metadata = new Object();

  const fileType = checkFileType(file);

  const nftImageUploadResult = await pinFileToPinata(file);

  if (nftImageUploadResult.success == true) {
    metadata = {
      name: values.name.trim(),
      description: values.description.trim(),
      image: nftImageUploadResult.pinataUrl,
      ...(fileType.mediaType == "video" && {
        animation_url: nftImageUploadResult.pinataUrl,
      }),
      external_link: EXTERNAL_LINK,
    };

    const metadataUploadResult = await pinJSONToIPFS(metadata, "asset");

    if (metadataUploadResult.success == true) {
      const nftMintingResult = await mintNft(
        values.collections.contractAddress,
        ownerAddress,
        metadataUploadResult.pinataUrl
      );

      if (nftMintingResult.transactionHash) {
        const tokenIdResult = await getTokenId(
          nftMintingResult.transactionHash
        );
        if (tokenIdResult.tokenId) {
          nftData.tokenId = tokenIdResult.tokenId.toString();
          nftData.tokenAddress = values.collections.contractAddress;
          nftData.collections = values.collections;
          nftData.name = values.name;
          nftData.categories = values.categories;
          nftData.talent = values.talent;
          nftData.metadata = metadata;
          return await uploadNftToStrapi(file, nftData);
        } else {
          return tokenIdResult;
        }
      } else {
        return nftMintingResult;
      }
    }
  }
  return {
    success: false,
    rejected: false,
    message: "NFT data is not uploaded to blockchain",
  };
};

export const mintNft = async (contractAddress, ownerAddress, metadataUri) => {
  console.log("owner address of NFT owner is ", ownerAddress);
  console.log("proxy address is ", RINKEBY_PROXY_ADDRESS);
  const web3 = new Web3(window.ethereum);
  const nftContract = new web3.eth.Contract(
    collectionArtifact.abi,
    contractAddress
  );
  const owner = web3.utils.toChecksumAddress(ownerAddress);
  const nonceValue = await web3.eth.getTransactionCount(owner);

  const nftResult = await nftContract.methods
    .mintTo(owner, metadataUri)
    .send({ from: owner, type: "0x2", nonce: nonceValue })
    .once("transactionHash", function (hash) {
      console.log("here is transaction nft hash ", hash);
    })
    .once("receipt", function (receipt) {
      console.log("transaction onf nft receipt ", receipt);
    })
    .once("confirmation", function (confirmationNumber, receipt) {
      console.log("configrmation nft number", confirmationNumber);
    })
    .once("error", (error) => {
      if (error.code == 4001) {
        console.log("returning from code");
        return {
          success: false,
          rejected: true,
          message: "User denied transaction signature",
        };
      }
    })
    .catch((error) => {
      if (error.code == 4001) {
        return {
          success: false,
          rejected: true,
          message: "User denied transaction signature",
        };
      } else if (error.code == 32602) {
        return {
          success: false,
          rejected: false,
          message: "Metamask, The parameters were invalid",
        };
      } else if (error.code == 32603) {
        return {
          success: false,
          rejected: false,
          message: "Metamask Internal error",
        };
      } else {
        return {
          success: false,
          rejected: false,
          message:
            "Metamask Transaction Failed Make Sure Your Metamask wallet is connected and unlocked",
        };
      }
    });

  return nftResult;
  // if (nftResult.transactionHash) {
  //   return nftResult;
  // } else if (nftResult?.rejected) {
  //   console.log("in rejected ", nftResult);
  //   return {
  //     success: false,
  //     rejected: true,
  //     message: "User denied transaction signature",
  //   };
  // } else {
  //   return {
  //     success: false,
  //     message: "Can not get NFT Hash",
  //   };
  // }
};

export const uploadCollectionToStrapi = async (
  logo,
  banner,
  collectionData
) => {
  let formData = new FormData();
  formData.append("files.collectionImageURL", logo);
  formData.append("files.collectionBanner", banner);
  formData.append("data", JSON.stringify(collectionData));
  console.log("uploading to strapi...");

  try {
    const response = await axios.post(
      `${STRAPI_BASE_URL}/collections`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Faild to upload file",
    };
  }
};

export const uploadNftToStrapi = async (file, nftMetadata) => {
  let formData = new FormData();
  formData.append("files.previewImage", file);
  formData.append("data", JSON.stringify(nftMetadata));
  try {
    const response = await axios.post(`${STRAPI_BASE_URL}/nfts`, formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Faild to upload file",
    };
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 wallet address",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      status: `🦊 You must install Metamask, a virtual Ethereum wallet, in your plz go to "https://metamask.io/download.html" and add extenstion to your browser`,
    };
  }
};
