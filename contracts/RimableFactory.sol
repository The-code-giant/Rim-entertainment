pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IFactoryERC721.sol";
import "./Rimable.sol";
import "./Strings.sol";

contract NatureFactory is FactoryERC721, Ownable {
    using Strings for string;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    address public proxyRegistryAddress;
    address public nftAddress;
    address public lootBoxNftAddress;
    string public baseURI = "https://creatures-api.opensea.io/api/factory/";

    /**
     * Enforce the existence of only 100 OpenSea creatures.
     */
    uint256 CREATURE_SUPPLY = 100;

    /**
     * Three different options for minting Creatures (basic, premium, and gold).
     */

    // constructor(address _proxyRegistryAddress, address _nftAddress) public {
    //     proxyRegistryAddress = _proxyRegistryAddress;
    //     nftAddress = _nftAddress;
    //     fireTransferEvents(address(0), owner());
    // }

    // function name() external view returns (string memory) {
    //     return "Nature Photo Sale";
    // }

    // function symbol() external view returns (string memory) {
    //     return "NAT";
    // }

    // function supportsFactoryInterface() public view returns (bool) {
    //     return true;
    // }

    // function transferOwnership(address newOwner) public onlyOwner {
    //     address _prevOwner = owner();
    //     super.transferOwnership(newOwner);
    //     fireTransferEvents(_prevOwner, newOwner);
    // }

    // function mint(uint256 _optionId, address _toAddress) public {
    //     // Must be sent from the owner proxy or owner.
    //     ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    //     assert(
    //         address(proxyRegistry.proxies(owner())) == msg.sender ||
    //             owner() == msg.sender
    //     );

    //     Rimable rimable = Rimable(nftAddress);
    //     rimable.mintTo(_toAddress);
    // }

    // function canMint(uint256 _optionId) public view returns (bool) {
    //     Rimable openSeaCreature = Rimable(nftAddress);

    //     return creatureSupply < (CREATURE_SUPPLY - numItemsAllocated);
    // }

    // function tokenURI(uint256 _optionId) external view returns (string memory) {
    //     return Strings.strConcat(baseURI, Strings.uint2str(_optionId));
    // }

    // /**
    //  * Hack to get things to work automatically on OpenSea.
    //  * Use transferFrom so the frontend doesn't have to worry about different method names.
    //  */
    // function transferFrom(
    //     address _from,
    //     address _to,
    //     uint256 _tokenId
    // ) public {
    //     mint(_tokenId, _to);
    // }

    // /**
    //  * Hack to get things to work automatically on OpenSea.
    //  * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
    //  */
    // function isApprovedForAll(address _owner, address _operator)
    //     public
    //     view
    //     returns (bool)
    // {
    //     if (owner() == _owner && _owner == _operator) {
    //         return true;
    //     }

    //     ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    //     if (
    //         owner() == _owner &&
    //         address(proxyRegistry.proxies(_owner)) == _operator
    //     ) {
    //         return true;
    //     }

    //     return false;
    // }

    // /**
    //  * Hack to get things to work automatically on OpenSea.
    //  * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
    //  */
    // function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    //     return owner();
    // }
}
