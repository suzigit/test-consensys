import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './Contract';

declare let require: any;

declare let window: any;

const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');

import * as constants from './../../../constants.json';
import * as contractCreatortMetadata from  './../../../ContractCreator.json';
import * as tradeableContractMetadata from './../../../TradeableContract.json';


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
        this.contractCreator.address =  (<any>constants).ContractCreatorAddr;

        console.log(this.contractCreator.address);

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
            .once('receipt', function(receipt){ 
                console.log("receipt");
                console.log(receipt); 
                console.log(receipt.events[0]);                                
                console.log(receipt.events[0].address); 
                fSucess(receipt.events[0].address);
             })
            .on('error', function(error){ 
                fError(error);
             })
            .catch (error => 
            {
                fError(error);
            });

        }); //close getAccounts
    }



   withdrawTokens(tradeableContractAddr: string, tokenAddr: string, valueToWithdraw: number, fSucess: any, fError: any) {

       console.log("withdrawTokens do " + tradeableContractAddr); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);
            
            console.log("vai chamar withdraw");

            tradeableContract.instance.methods.makeUntrustedWithdrawalOfTokens(tokenAddr, valueToWithdraw).send ({ from:selectedAccount })
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
            tradeableContract.instance.methods.untrustedChangeOwnershipWithTrade().send ({ from:selectedAccount, value:priceInWei })
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

        console.log("getPastEvents (owners)... ");
  
        tradeableContract.instance.getPastEvents('NewOwnerEvent', {
                fromBlock: 0,
                toBlock: 'latest'
        })
        .then(events =>  fEventOwner(events));
    }

    getWithdrawHistory(tradeableContractAddr: string, fEvents: any) {

        let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

        console.log("getPastEvents (withdraw)... ");
  
        tradeableContract.instance.getPastEvents('WithdrawTokensEvent', {
                fromBlock: 0,
                toBlock: 'latest'
        })
        .then(events =>  fEvents(events));
    }
    
 } 

