// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentToken is ERC20 {
    constructor() ERC20("PaymentToken", "PT"){
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to,_amount);
    }
}