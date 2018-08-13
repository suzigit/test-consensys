import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './contract';

import * as data from './../../../../back-blockchain//build/contracts/TradeableContract.json';

declare let require: any;

declare let window: any;


const Web3 = require('web3');




@Injectable()
export class BlockchainService {

    private tradeableContract: any;

    private web3: any;


    constructor() {
 
        if (typeof window.web3 !== 'undefined') {

            // Use Mist/MetaMask's provider
            //this.web3 = new Web3(window.web3.currentProvider);
 //           this.web3 = new window['Web3'](window.web3.currentProvider);
            this.web3 = new Web3(window.web3.currentProvider);
           console.log(this.web3);

            const abi = (<any>data).abi;
            const code = (<any>data).bytecode;


            // Create Contract proxy class
            let proxyTradeableContract = new this.web3.eth.Contract(abi);
        
/*
           console.log("create....");
            this.tradeableContract = proxyTradeableContract.new({from: this.getSelecteAccount(), gas: 1000000, data: '0x' + code}, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }

                // Log the tx, you can explore status with eth.getTransaction()
                console.log(res.transactionHash);

                // If we have an address property, the contract was deployed
                if (res.address) {
                    console.log('Contract address: ' + res.address);
                    // Let's test the deployed contract
               //     testContract(res.address);
                }
            });
            console.log(this.tradeableContract);

*/

            this.tradeableContract = new Contract();
            this.tradeableContract.address =  '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
            this.tradeableContract.ABI = abi;
            console.log("vai instanciar tradeable");
            this.tradeableContract.instance = new this.web3.eth.Contract(this.tradeableContract.ABI, this.tradeableContract.address);
            console.log(this.tradeableContract);    

            
            this.setAvailableToSell("1",
               function(s) {
                console.log("sucesso: " + s);
            }, function(e) {
                console.log("erro: " + e);
            });

        } else {
            console.warn(
                'Please use a dapp browser like mist or MetaMask plugin for chrome'
            );
        }
       console.log("web3" + this.web3);

    }
   
    getSelecteAccount() {
        return this.web3.eth.accounts[0];
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

    }


   withdrawTokens(tokenAddr: number, valueToWithdraw: number, fSucess: any, fError: any) {

       console.log("withdrawTokens"); 

//TODO: tirar o 1 e colocar o valueToWithdraw
      this.tradeableContract.instance.withdrawTokens (tokenAddr, 1, { from:this.getSelecteAccount(),  gas: 500000 },
            (error, result) => {
                if (error) fError(error);
                else fSucess(result);
            });     
    }

   setAvailableToSell(price: string, fSucess: any, fError: any) {

       console.log("set available to sell"); 
       console.log(this.tradeableContract.instance); 

//TODO: tirar o 1 e colocar o valueToWithdraw
      this.tradeableContract.instance.setAvailableToSell (1, { from:this.getSelecteAccount(),  gas: 500000 },
            (error, result) => {
                if (error) fError(error);
                else fSucess(result);
            });     
    }



   buyWallet(fSucess: any, fError: any) {

       console.log("changeOwnershipWithTrade"); 
       console.log(this.tradeableContract.instance); 

      this.tradeableContract.instance.changeOwnershipWithTrade ({ from:this.getSelecteAccount(),  gas: 500000 },
            (error, result) => {
                if (error) fError(error);
                else fSucess(result);
            });     
    }

    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }

}
