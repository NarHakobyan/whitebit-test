// SPDX-License-Identifier: Unlicensed
pragma solidity 0.5.10;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Staking is Ownable {
    using SafeMath for uint256;

    struct Balance {
        address[] tokens;
        mapping (address => uint256) amounts;
    }

    address public feeCollector;

    event Staked(address indexed addr, uint256 amount);

    event CollectorChanged(address collectorAddress);

    mapping(address => Balance) userBalance;

    /**
     * @dev Set chairPerson and give him voting rights
     */
    constructor() public {
        feeCollector = owner();
    }

    function getBalances(address userAddress, address[] calldata tokens)
        external
        view
        returns (uint256[] memory)
    {
        Balance storage balance = userBalance[userAddress];

        uint256[] memory balances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            balances[i] = balance.amounts[tokens[i]];
        }

        return balances;
    }

    function getBalance(address userAddress, address token)
        external
        view
        returns (uint256)
    {
        return userBalance[userAddress].amounts[token];
    }

    function changeCollectorAddress(address newCollector) external onlyOwner {
        feeCollector = newCollector;
        emit CollectorChanged(newCollector);
    }

    function stakeToken(address token, uint256 amount)
        external
        returns (uint256)
    {
        require(amount > 0, "Cannot stake 0");

        userBalance[msg.sender].amounts[token] = userBalance[msg.sender].amounts[token].add(amount);
        uint256 feePercent;
        if (amount < 100) {
            feePercent = 1;
        } else if (amount < 1000) {
            feePercent = 2;
        } else {
            feePercent = 3;
        }

        uint256 fee = amount.mul(feePercent) / 100;
        userBalance[feeCollector].amounts[token] = userBalance[feeCollector].amounts[token].add(fee);

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        require(success, "Cannot stake");
        success = IERC20(token).transferFrom(msg.sender, feeCollector, fee);

        require(success, "Cannot stake");
        emit Staked(msg.sender, amount);
    }
}
