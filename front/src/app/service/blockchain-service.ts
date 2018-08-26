import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './Contract';
import {ENSHelper} from './ENSHelper';

declare let require: any;

declare let window: any;

const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');

import * as constants from './../../../constants.json';
import * as contractCreatortMetadata from  './../../../ContractCreator.json';
import * as tradeableContractMetadata from './../../../TradeableContract.json';
import * as ensContractMetadata from  './../../../ENSContract.json';
import * as resolverContractMetadata from './../../../ResolverContract.json';



@Injectable()
export class BlockchainService {

    private contractCreator: any;
    private web3: any;

    private ensContract: any;
    private resolverContract: any;


    constructor() {

        this.createWeb3();
        this.createInitialObjects();

    }

    isAddress(text) {
        return this.web3.utils.isAddress(text);
    }

    createWeb3() {

        if (typeof window.web3 !== 'undefined') {

             // Use Mist/MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);

        } else {
            console.warn(
                'Please use a dapp browser like mist or MetaMask plugin for chrome'
            );
        }
    }

    createInitialObjects() {

        this.contractCreator = new Contract();
        this.contractCreator.address =  (<any>constants).ContractCreatorAddr;
        this.contractCreator.ABI = (<any> contractCreatortMetadata).abi;
        this.contractCreator.instance = new this.web3.eth.Contract(this.contractCreator.ABI, this.contractCreator.address);

        this.ensContract = new Contract();
        this.ensContract.address =  (<any>constants).ENSContractAddr;
        this.ensContract.ABI = (<any> ensContractMetadata).abi;
        this.ensContract.instance = new this.web3.eth.Contract(this.ensContract.ABI, this.ensContract.address);


        this.resolverContract = new Contract();
        this.resolverContract.address =   (<any>constants).ResolverContractAddr;
        this.resolverContract.ABI = (<any> resolverContractMetadata).abi;
        this.resolverContract.instance = new this.web3.eth.Contract(this.resolverContract.ABI, this.resolverContract.address);
        
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
            
            tradeableContract.instance.methods.makeUntrustedWithdrawalOfTokens(tokenAddr, valueToWithdraw).send ({ from:selectedAccount, gas:300000 })
            .then (result => fSucess(result))
            .catch (error => fError(error));
        });     
    }


   setAvailableToSell(tradeableContractAddr: string, priceInGWei: number, hashDescription: string, fSucess: any, fError: any) {

       console.log("set available to sell with price (GWei) " + priceInGWei); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            let sPriceInGWei = String(priceInGWei);

            let priceInWei = this.web3.utils.toWei(sPriceInGWei, 'GWei');
            console.log(priceInWei);

            tradeableContract.instance.methods.setAvailableToSell(priceInWei, hashDescription).send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }

    getPriceToBuyInGWei(tradeableContractAddr: string, fSucess: any, fError: any) {
    
//        this.getAccounts().then(accounts => {

//            let selectedAccount = accounts[0]; 
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getPriceToSellInWei().call()
            .then(result => 
                {
                    if (!isNaN(result)) {
                        let priceInGwei = this.web3.utils.fromWei(result, "GWei");
                        fSucess(priceInGwei);
                    }
                    else {
                        fError("NAN")
                    }
                })
            .catch (error => fError(error));
//        }); 
    } 

    getHashDescription(tradeableContractAddr: string, fSucess: any, fError: any) {
    
//        this.getAccounts().then(accounts => {

//            let selectedAccount = accounts[0]; 
            let tradeableContract =  this.createTradeableContract(tradeableContractAddr);

            tradeableContract.instance.methods.getHashDescription().call()
            .then(result => 
                {
                    fSucess(result);
                })
            .catch (error => fError(error));
 //       }); 
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
            tradeableContract.instance.methods.untrustedChangeOwnershipWithTrade().send ({ from:selectedAccount, value:priceInWei, gas:300000 })
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
    


  getAddr(name, fSucess: any, fError: any) {

      name  = name + (<any>constants).ENSNetworkSufix;

      var node = this.namehash(name)
      this.ensContract.instance.methods.resolver(node).call()
      .then(result =>
        {
            if (resolverAddress === '0x0000000000000000000000000000000000000000') {
                return resolverAddress;
            }

            var resolverAddress = result;

            this.resolverContract.instance.methods.addr(node).call()
            .then(addr =>
            {
                fSucess(addr);
            }) 
            .catch (error => fError(error));

        }) 
       .catch (error => fError(error));
      
  }


 namehash(name) {
    var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name !== '') {
        var labels = name.split(".");
        for(var i = labels.length - 1; i >= 0; i--) {
            node = this.web3.utils.sha3(node + this.web3.utils.sha3(labels[i]).slice(2), {encoding: 'hex'});
        }
    }
    return node.toString(); 
 }



} 

