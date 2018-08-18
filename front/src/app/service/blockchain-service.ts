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

  //      window.addEventListener('load', (event) => {
            this.createWeb3();
            this.createInitialObjects();
 //       });


    }

    createWeb3() {
        console.log("vai criar web3");
            if (typeof window.web3 !== 'undefined') {

            // Use Mist/MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);
           console.log(this.web3);

        } else {
            console.warn(
                'Please use a dapp browser like mist or MetaMask plugin for chrome'
            );
        }
    }

    createInitialObjects() {

        console.log("vai instanciar contract creator");

        this.contractCreator = new Contract();
        this.contractCreator.address =  '0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4';
        this.contractCreator.ABI = (<any> contractCreatortMetadata).abi;
        this.contractCreator.instance = new this.web3.eth.Contract(this.contractCreator.ABI, this.contractCreator.address);
        console.log(this.contractCreator.instance);    

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


   setAvailableToSell(tradeableContractAddr: string, priceInGWei: number, fSucess: any, fError: any) {

       console.log("set available to sell with price (GWei) " + priceInGWei); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar set available to sell");

            let sPriceInGWei = String(priceInGWei);

            let priceInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
            console.log(priceInWei);

            tradeableContract.instance.methods.setAvailableToSell(priceInWei).send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }

    getPriceToBuyInGWei(tradeableContractAddr: string, fSucess: any, fError: any) {
    
        this.getAccounts().then(accounts => {

            let selectedAccount = accounts[0]; 
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar get");

            tradeableContract.instance.methods.getPriceToSellInWei().call({ from:selectedAccount })
            .then(result => 
                {
                    let priceInGwei = this.web3.utils.fromWei(result, "GWei");
                    fSucess(priceInGwei);
                })
            .catch (error => fError(error));
        }); 
    } 


   buyWallet(tradeableContractAddr: string, priceInGWei: number, fSucess: any, fError: any) {

       console.log("Buy with price (GWei) " + priceInGWei); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];

            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            console.log("vai chamar buy - changeOwner");

            let sPriceInGWei = String(priceInGWei);

            let priceInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
            console.log(priceInWei);

            //PAYABLE FUNCTION
            tradeableContract.instance.methods.changeOwnershipWithTrade().send ({ from:selectedAccount, value:priceInWei })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     

    }

    private createTradeableContract(tradeableContractAddr: string) {

        let tradeableContract = new Contract();
        tradeableContract.address =  tradeableContractAddr;
        tradeableContract.ABI = (<any>tradeableContractMetadata).abi;
        tradeableContract.instance = new this.web3.eth.Contract(tradeableContract.ABI, tradeableContract.address);
        console.log(tradeableContract);                
        return tradeableContract;
    }


    getBlockTimestamp(blockHash: number, fResult: any) {
        this.web3.eth.getBlock(blockHash, fResult);
    }


    getContractHistory(tradeableContractAddr: string, fEventOwner: any) {

        let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

        console.log("getPastEvents... ");
  
        tradeableContract.instance.getPastEvents('NewOwnerEvent', {
                fromBlock: 0,
                toBlock: 'latest'
        })
        .then(events =>  fEventOwner(events));
    }
 } 

