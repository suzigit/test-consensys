import { Injectable, Output, EventEmitter } from '@angular/core';
import {Contract} from './contract'

@Injectable()
export class BlockchainService {

    private contractCreator: Contract;
    private tradeableContract: Contract;

    private web3: any;

    constructor() {
        this.web3 = new window['Web3'](window['web3'].currentProvider);
        console.log("web3" + this.web3);
    }
   
    getSelecteAccount() {
        console.log("vai chamar selected account com web3");
        return this.web3.eth.accounts[0];
    }

    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }

   createWallet() {
//       this.contractCreator.instance.createTradeableContract     
       console.log("create wallet");

    }

}
