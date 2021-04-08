// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

// Common interface for the SortedTroves Doubly Linked List.
abstract contract ISortedTroves {
    struct Node {
        bool exists;
        address nextId; // Id of next node (smaller NICR) in the list
        address prevId; // Id of previous node (larger NICR) in the list
    }

    // Information for the list
    struct Data {
        address head; // Head of the list. Also the node in the list with the largest NICR
        address tail; // Tail of the list. Also the node in the list with the smallest NICR
        uint256 maxSize; // Maximum size of the list
        uint256 size; // Current size of the list
        mapping(address => Node) nodes; // Track the corresponding ids for each node in the list
    }

    Data public data;

    constructor() {}

    // --- Events ---

    event SortedTrovesAddressChanged(address _sortedDoublyLLAddress);
    event BorrowerOperationsAddressChanged(address _borrowerOperationsAddress);
    event NodeAdded(address _id, uint256 _NICR);
    event NodeRemoved(address _id);

    // --- Functions ---

    function setParams(
        uint256 _size,
        address _TroveManagerAddress,
        address _borrowerOperationsAddress
    ) external virtual;

    function insert(
        address _id,
        uint256 _ICR,
        address _prevId,
        address _nextId
    ) external virtual;

    function remove(address _id) external virtual;

    function reInsert(
        address _id,
        uint256 _newICR,
        address _prevId,
        address _nextId
    ) external virtual;

    function contains(address _id) external view virtual returns (bool);

    function isFull() external view virtual returns (bool);

    function isEmpty() external view virtual returns (bool);

    function getSize() external view virtual returns (uint256);

    function getMaxSize() external view virtual returns (uint256);

    function getFirst() external view virtual returns (address);

    function getLast() external view virtual returns (address);

    function getNext(address _id) external view virtual returns (address);

    function getPrev(address _id) external view virtual returns (address);

    function validInsertPosition(
        uint256 _ICR,
        address _prevId,
        address _nextId
    ) external view virtual returns (bool);

    function findInsertPosition(
        uint256 _ICR,
        address _prevId,
        address _nextId
    ) external view virtual returns (address, address);
}
