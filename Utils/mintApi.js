import collectionArtifact from "./../build/contracts/Rimable.json";

import Web3 from "web3";
import axios from "axios";
import { slugify } from "./utils";
import detectEthereumProvider from "@metamask/detect-provider";

const STRAPI_BASE_URL = process.env.HEROKU_BASE_URL;
// const STRAPI_BASE_URL = process.env.HEROKU_BASE_TNC;
// const STRAPI_BASE_URL = process.env.STRAPI_LOCAL_BASE_URL;

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
  if (!input != null && input != "") {
    if (!input.replace(/\s/g, "").length) {
      return {
        isDuplicate: true,
        message: `× ${capitalizeWorkd(
          label
        )} can not be only whitespace (ie. spaces, tabs or line breaks)`,
      };
    }
    const isDuplicate = array.some(
      (item) => item[searchField] == input.toString().trim()
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
  console.log("given hash is ", txHash);
  const web3 = new Web3(window.ethereum);
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log(
      "token id from hash is here::::",
      web3.utils.hexToNumber(receipt.logs[0].topics[3])
    );
    return web3.utils.hexToNumber(receipt.logs[0].topics[3]);
  } catch (e) {
    return {
      success: false,
      message: "Not Valid Hash",
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

export const saveFileToPinata = (file) => {
  const pinataData = new FormData();
  pinataData.append("file", file);
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  return axios
    .post(url, pinataData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${pinataData._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        ipfsUrl: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const pinJSONToIPFS = (metaContent, mediaType) => {
  const metadata = {
    pinataMetadata: {
      name: (metaContent.name + " - " + mediaType).toUpperCase(),
    },
    pinataContent: metaContent,
  };

  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, metadata, {
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        ipfsUrl: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const deployCollection = async (logo, banner, values, ownerAddress) => {
  if (process.env.RINKEBY_PROXY_ADDRESS) {
    console.log("proxy address is ", process.env.RINKEBY_PROXY_ADDRESS);
  }
  let strapiUploadResult = {
    success: false,
    message: "Deploy was not successful",
  };
  const etherumProvider = await detectEthereumProvider();

  const web3 = new Web3(window.ethereum);
  let collectionData = new Object();
  const fileType = checkFileType(logo);
  console.log("values is ", values);
  const logoFileResult = await saveFileToPinata(logo);
  const bannerFileResult = await saveFileToPinata(banner);
  console.log("wating to upload collection image...");
  if (logoFileResult.success && bannerFileResult.success) {
    const ipfsUrl = logoFileResult.ipfsUrl;
    const bannerIpfsUrl = bannerFileResult.ipfsUrl;
    const metadata = {
      name: values.collectionName,
      description: values.description,
      image: ipfsUrl,
      banner: bannerIpfsUrl,
      ...(fileType.mediaType == "video" && {
        animation_url: ipfsUrl,
      }),
      ...(values.external_link && { external_link: values.external_link }),
    };
    console.log("collection metadata is ", metadata);
    const collectionMetadataResult = await pinJSONToIPFS(
      metadata,
      "collection"
    );
    console.log("wating to upload collection metadata...");
    // if (collectionMetadataResult.success) {
    const collectionUri = collectionMetadataResult.ipfsUrl;
    console.log("wating to deploy collection...");
    // await provider.enable();
    web3.setProvider(etherumProvider);

    const proxyAddress = web3.utils.toChecksumAddress(RINKEBY_PROXY_ADDRESS);
    const owner = web3.utils.toChecksumAddress(ownerAddress);
    const deployResult = await new web3.eth.Contract(collectionArtifact.abi)
      .deploy({
        name: "Rimable",
        data: collectionArtifact.bytecode,
        arguments: [
          "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
          "Rimable",
          "RIMABLE",
          collectionUri,
        ],
      })
      .send({
        type: "0x2",
        from: owner,
        // gas: "6721975",
      })
      .on("transactionHash", function (hash) {
        console.log("here is transaction hash ", hash);
      })
      .once("receipt", function (receipt) {
        console.log("transaction receipt ", receipt);
      })
      .once("confirmation", function (confirmationNumber, receipt) {
        console.log("configrmation number", confirmationNumber);
      })
      .on("error", (error) => {
        if (error.code == 4001) {
          return {
            success: false,
            rejected: true,
            message: "User denied transaction signature",
          };
        }
      })
      .catch((e) => {
        console.log("error in deploye", e);
        return {
          success: false,
          rejected: true,
          message: "User denied transaction signature",
        };
      });

    if (!deployResult.rejected) {
      console.log("deploye result is ", deployResult);
      collectionData.contractAddress = deployResult._address;
      collectionData.talentAddress = ownerAddress;
      collectionData.talent = values.talent;
      collectionData.collectionName = values.collectionName;
      collectionData.slug = slugify(values.collectionName.toString());
      return uploadCollectionToStrapi(logo, banner, collectionData);
    } else {
      return {
        success: false,
        rejected: true,
        message: "User denied transaction signature!",
      };
    }
  }
};

export const uploadNft = async (file, values, ownerAddress) => {
  let nftData = new Object();
  let metadata = new Object();
  let tokenId;
  const fileType = checkFileType(file);
  console.log("nft values is ", values);

  const fileUploadResult = await saveFileToPinata(file);

  if (!fileUploadResult.success) return fileUploadResult;
  console.log(
    "File is uploaded to pinata successfully",
    fileUploadResult.ipfsUrl
  );

  console.log("start uploading metadata...");

  const ipfsUrl = fileUploadResult.ipfsUrl;
  metadata = {
    name: values.name.trim(),
    description: values.description.trim(),
    image: ipfsUrl,
    ...(fileType.mediaType == "video" && {
      animation_url: ipfsUrl,
    }),
    ...(values.external_link && { external_link: values.external_link }),
  };

  const metadataUploadResult = await pinJSONToIPFS(metadata, "asset");

  if (!metadataUploadResult.success) return metadataUploadResult;
  console.log("uploaded metadata uri is ", metadataUploadResult);
  const hashResult = await mintNft(
    values.collections.contractAddress,
    ownerAddress,
    metadataUploadResult.ipfsUrl
  );

  if (hashResult.rejected) {
    return {
      success: false,
      rejected: true,
      message: "User denied transaction signature",
    };
  }

  console.log("hash result is after minting is ", hashResult);
  if (hashResult.transactionHash) {
    tokenId = await getTokenId(hashResult.transactionHash);
    console.log("Asset token Id is ", tokenId);
    nftData.tokenId = tokenId.toString();
    nftData.tokenAddress = values.collections.contractAddress;
    nftData.collections = values.collections;
    nftData.name = values.name;
    nftData.categories = values.categories;
    nftData.talent = values.talent;
    nftData.metadata = metadata;
    console.log("NFT data is ", nftData);
    const strapiResult = await uploadNftToStrapi(file, nftData);
    if (strapiResult.success == false)
      return {
        success: false,
        message: `Uploading NFT Failed!!! Server is not Available`,
      };
    console.log("Nft is uploaded to strapi", strapiResult);
    return strapiResult;
  } else {
  }
};

export const mintNft = async (contractAddress, ownerAddress, metadataUri) => {
  let transactionHash = null;
  console.log("owner address of NFT owner is ", ownerAddress);
  console.log("proxy address is ", RINKEBY_PROXY_ADDRESS);
  const etherumProvider = await detectEthereumProvider();
  const web3 = new Web3(window.ethereum);
  const nftContract = new web3.eth.Contract(
    collectionArtifact.abi,
    contractAddress
  );
  const owner = web3.utils.toChecksumAddress(ownerAddress);
  const nftResult = await nftContract.methods
    .mintTo(owner, metadataUri)
    .send({ from: owner, type: "0x2" })
    .once("transactionHash", function (hash) {
      console.log("here is transaction nft hash ", hash);
      transactionHash = hash;
    })
    .once("receipt", function (receipt) {
      console.log("transaction onf nft receipt ", receipt);
    })
    .once("confirmation", function (confirmationNumber, receipt) {
      console.log("configrmation nft number", confirmationNumber);
    })
    .once("error", (error) => {
      if (error.code == 4001) {
        return {
          success: false,
          rejected: true,
          message: "User denied transaction signature",
        };
      }
    })
    .catch((e) => {
      return {
        success: false,
        rejected: true,
        message: "User denied transaction signature",
      };
    });

  if (nftResult.transactionHash) {
    return nftResult;
  } else if (nftResult.rejected) {
    return {
      success: false,
      rejected: true,
      message: "User denied transaction signature",
    };
  } else {
    return {
      success: false,
      message: "Can not get NFT Hash",
    };
  }
};

export const uploadCollectionToStrapi = (logo, banner, collectionData) => {
  let formData = new FormData();
  formData.append("files.collectionImageURL", logo);
  formData.append("files.collectionBanner", banner);
  formData.append("data", JSON.stringify(collectionData));
  console.log("uploading to strapi...");
  return axios.post(`${STRAPI_BASE_URL}/collections`, formData, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });
};

export const uploadNftToStrapi = (file, nftMetadata) => {
  let formData = new FormData();
  formData.append("files.previewImage", file);
  formData.append("data", JSON.stringify(nftMetadata));
  console.log("uploading fntData to strapi...");
  return axios.post(`${STRAPI_BASE_URL}/nfts`, formData, {
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });
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
