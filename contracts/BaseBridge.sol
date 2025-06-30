// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseBridge {
    event ReserveCommitted(bytes32 root, uint256 timestamp);

    /// @notice Emit a new reserves commitment
    /// @param root   Merkle‐root of balances
    /// @param timestamp  seconds‐since‐epoch snapshot time
    function commit(bytes32 root, uint256 timestamp) external {
        emit ReserveCommitted(root, timestamp);
    }
}
