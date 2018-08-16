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
            this.contractCreator.address =  '0xde5bb8b8961faef05b2ab38a70c81bdbc91add29';
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
            // Create Contract proxy class

            let proxyTradeableContract = new this.web3.eth.Contract(abi);

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


            this.tradeableContract = new Contract();
            this.tradeableContract.address =  '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
            this.tradeableContract.ABI = abi;
            console.log("vai instanciar tradeable");
            this.tradeableContract.instance = new this.web3.eth.Contract(this.tradeableContract.ABI, this.tradeableContract.address);
            console.log(this.tradeableContract);                

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

                self.contractCreator.instance.methods.getLastCreatedContract(selectedAccount).call({from: selectedAccount})
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

            let tradeableContract = new Contract();
            tradeableContract.address =  tradeableContractAddr;
            tradeableContract.ABI = (<any>tradeableContractMetadata).abi;


            console.log("vai instanciar tradeable");
            tradeableContract.instance = new this.web3.eth.Contract(tradeableContract.ABI, tradeableContract.address);
            console.log(tradeableContract);                

            console.log("vai chamar withdraw");

            tradeableContract.instance.methods.withdrawTokens(tokenAddr, valueToWithdraw).send ({ from:selectedAccount })
            .then (result => 
            {
                fSucess(result);
                console.log("result");
                console.log(result);

            })
            .catch (error => fError(error));
        });     
    }


   setAvailableToSell(tradeableContractAddr: string, price: number, fSucess: any, fError: any) {

       console.log("set available to sell with price " + price); 

        this.getAccounts().then(accounts => {
            let selectedAccount = accounts[0];

            let tradeableContract = new Contract();
            tradeableContract.address =  tradeableContractAddr;
            tradeableContract.ABI = (<any>tradeableContractMetadata).abi;


            console.log("vai instanciar tradeable");
            tradeableContract.instance = new this.web3.eth.Contract(tradeableContract.ABI, tradeableContract.address);
            console.log(tradeableContract);                

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


/*
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
*/
}
