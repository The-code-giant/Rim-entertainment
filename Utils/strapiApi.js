import request from "./axios"
export const fetchOne = async (tokenAddress, tokenId) => {
    return await request(`nfts/${tokenId}/${tokenAddress}`, {
        method: 'GET',   
    }).then(res => res).catch(
        function (error) {
            return "error";
        }
      )
}
export const fetch = async (target) => {
    return await request(target, {
        method: 'GET',   
    }).then(res => res).catch(
        function (error) {
            return "error";
        }
      )
}