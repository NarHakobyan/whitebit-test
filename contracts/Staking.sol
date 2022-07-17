// SPDX-License-Identifier: Unlicensed
pragma solidity 0.5.10;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract IERC20Detailed is IERC20 {
    function name() public view returns (string memory);

    function symbol() public view returns (string memory);

    function decimals() public view returns (uint8);
}

contract Staking is Ownable {
    using SafeMath for uint256;

    struct Balance {
        address[] tokens;
        mapping(address => uint256) amounts;
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

    function setCollector(address newCollector) external onlyOwner {
        feeCollector = newCollector;
        emit CollectorChanged(newCollector);
    }

    function stake(address token, uint256 amount) external returns (uint256) {
        require(amount > 100, "Cannot stake less then 100");

        uint256 decimals = 10 ** uint256(IERC20Detailed(token).decimals());

        userBalance[msg.sender].amounts[token] = userBalance[msg.sender]
            .amounts[token]
            .add(amount);

        uint256 feePercent;
        if (amount < 100 * decimals) {
            feePercent = 1;
        } else if (amount < 1000 * decimals) {
            feePercent = 2;
        } else {
            feePercent = 3;
        }

        bool success = IERC20Detailed(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        require(success, "Cannot stake");
        success = IERC20Detailed(token).transferFrom(
            msg.sender,
            feeCollector,
            amount.mul(feePercent) / 100
        );

        require(success, "Cannot stake");
        emit Staked(msg.sender, amount);
    }
}
