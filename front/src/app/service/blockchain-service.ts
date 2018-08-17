import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './contract';

declare let require: any;

declare let window: any;

const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');


import * as contractCreatortMetadata from './../../../../back-blockchain//build/contracts/ContractCreator.json';
import * as tradeableContractMetadata from './../../../../back-blockchain//build/contracts/TradeableContract.json';

const TruffleContract = require('truffle-contract');



@Injectable()
export class BlockchainService {

    private contractCreator: any;
    private web3: any;


    constructor() {
 
        if (typeof window.web3 !== 'undefined') {

            // Use Mist/MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);
           console.log(this.web3);

            this.contractCreator = new Contract();
            this.contractCreator.address =  '0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4';
            this.contractCreator.ABI = (<any> contractCreatortMetadata).abi;
            console.log("vai instanciar contract creator");
            this.contractCreator.instance = new this.web3.eth.Contract(this.contractCreator.ABI, this.contractCreator.address);
            console.log(this.contractCreator.instance);    

/*
            this.contractCreator = TruffleContract(contracCreatortMetadata); 
           	this.contractCreator.setProvider(window.web3.currentProvider);
            console.log("this.contractCreator");
            console.log(this.contractCreator);

            var deployed;
            this.contractCreator.deployed().then(function(instance) {
                console.log("dentro do deployed");
                var deployed = instance;
                return instance.createTradeableContract();
            }).then(function(result) {
                console.log("result=");
                console.log(result);
            });


*/
        } else {
            console.warn(
                'Please use a dapp browser like mist or MetaMask plugin for chrome'
            );
        }
    }
   
    async getAccounts() {
        return await this.web3.eth.getAccounts();
    }


    createTradeableWallet(fSucess: any, fError: any) {
            
        let self = this; 
        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0]; 

            console.log("selected accont para create:" + selectedAccount);

            //TODO: questao de concorrencia do Last Created - fazer map com hash da transacao -> contrato 
            self.contractCreator.instance.methods.createTradeableContract().send({from: selectedAccount})
            .then( receipt => 
            {
                console.log("criou wallet");
                console.log(receipt);

                self.contractCreator.instance.methods.getLastCreatedContract().call()
                .then(result => fSucess(result))
                .catch (error => fError(error));
                                
            })
            .catch (error => console.warn(error));

        });
    }


   withdrawTokens(tradeableContractAddr: string, tokenAddr: string, valueToWithdraw: number, fSucess: any, fError: any) {

       console.log("withdrawTokens do " + tradeableContractAddr); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
            
            console.log("vai chamar withdraw");

            tradeableContract.instance.methods.withdrawTokens(tokenAddr, valueToWithdraw).send ({ from:selectedAccount })
            .then (result => fSucess(result))
            .catch (error => fError(error));
        });     
    }


   setAvailableToSell(tradeableContractAddr: string, price: number, fSucess: any, fError: any) {

       console.log("set available to sell with price " + price); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar set available to sell");

            tradeableContract.instance.methods.setAvailableToSell(price).send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }

    getPriceToBuy(tradeableContractAddr: string, fSucess: any, fError: any) {
    
        this.getAccounts().then(accounts => {

            let selectedAccount = accounts[0]; 
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar get");

            tradeableContract.instance.methods.getPriceToSell().call({ from:selectedAccount })
            .then(result => fSucess(result))
            .catch (error => fError(error));
        });    
    } 


   buyWallet(tradeableContractAddr: string, price: number, fSucess: any, fError: any) {

       console.log("Buy with price " + price); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];

            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar buy - changeOwner");

            //PAYABLE FUNCTION
            tradeableContract.instance.methods.changeOwnershipWithTrade().send ({ from:selectedAccount, value:price })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     

    }

    createTradeableContract(tradeableContractAddr: string) {

        let tradeableContract = new Contract();
        tradeableContract.address =  tradeableContractAddr;
        tradeableContract.ABI = (<any>tradeableContractMetadata).abi;
        tradeableContract.instance = new this.web3.eth.Contract(tradeableContract.ABI, tradeableContract.address);
        console.log(tradeableContract);                
        return tradeableContract;
    }

/*
    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }
*/
}
