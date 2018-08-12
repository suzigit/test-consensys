import { Injectable, Output, EventEmitter } from '@angular/core';
import {Contract} from './contract'


declare let window: any;

@Injectable()
export class BlockchainService {

    private contractCreator: Contract;
    private tradeableContract: Contract;

    private web3: any;


    constructor() {
 
        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            //this.web3 = new Web3(window.web3.currentProvider);
            this.web3 = new window['Web3'](window.web3.currentProvider);

            this.contractCreator = new Contract();
            this.contractCreator.address =  '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf';
            this.contractCreator.ABI = [ { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "b", "type": "bool" } ], "name": "setCircuitBreaker", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "createTradeableContract", "outputs": [ { "name": "subcontractAddr", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ];
            this.contractCreator.instance = this.web3.eth.contract(this.contractCreator.ABI).at(this.contractCreator.address);
            console.log(this.contractCreator);


            this.tradeableContract = new Contract();
            this.tradeableContract.address =  '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
            this.tradeableContract.ABI = [ { "constant": false, "inputs": [ { "name": "tokensAddr", "type": "address" }, { "name": "valueToWithdraw", "type": "uint256" } ], "name": "withdrawTokens", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "isAvailableToSell", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_new", "type": "address" } ], "name": "changeOwnershipWithoutTrade", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "changeOwnershipWithTrade", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contractCreatorAddr", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "priceToSell", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "price", "type": "uint256" } ], "name": "setAvailableToSell", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdrawETH", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "oaddr", "type": "address" }, { "name": "ccaddr", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "old", "type": "address" }, { "indexed": true, "name": "current", "type": "address" } ], "name": "NewOwnerWithoutTradeEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "old", "type": "address" }, { "indexed": true, "name": "current", "type": "address" }, { "indexed": false, "name": "price", "type": "uint256" } ], "name": "NewOwnerWithTradeEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": false, "name": "valueToWithdraw", "type": "uint256" } ], "name": "WithdrawTokensEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" } ], "name": "WithdrawETHEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "contractAddr", "type": "address" } ], "name": "AvaliableToSellEvent", "type": "event" } ];
            console.log("vai instanciar tradeable");
            this.tradeableContract.instance = this.web3.eth.contract(this.tradeableContract.ABI).at(this.tradeableContract.address);
            console.log(this.tradeableContract);    


        } else {
            console.warn(
                'Please use a dapp browser like mist or MetaMask plugin for chrome'
            );
        }

       console.log("web3" + this.web3);



    }
   
    getSelecteAccount() {
//         this.loop();
        return this.web3.eth.accounts[0];
    }
    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }

   createWallet(fSucess: any, fError: any) {

/*

      this.contractCreator.instance.setCircuitBreaker (false, { from:this.getSelecteAccount(),  gas: 500000 },
            (error, result) => {
                if (error) fError(error);
                else fSucess(result);
            });     

      this.contractCreator.instance.methods.createTradeableContract ({ from:this.getSelecteAccount(),  gas: 500000 },
            (error, result) => {
                if (error) fError(error);
                else fSucess(result);
            });     
       console.log("create wallet"); 

*/

      this.contractCreator.instance.createTradeableContract ({ from:this.getSelecteAccount(),  gas: 500000 },
            (error, result, r) => {
                if (error) fError(error);
                else fSucess(result, r);
            });     

    }

}
