// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentToken is ERC20, Ownable {
    constructor() ERC20("PaymentToken", "PT") Ownable(msg.sender){
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to,_amount);
    }
}