import { Injectable, Output, EventEmitter } from '@angular/core';

import {Contract} from './contract';

declare let require: any;

declare let window: any;

const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');


import * as tradeableContractMetadata from './../../../../back-blockchain//build/contracts/TradeableContract.json';
import * as contractCreatortMetadata from './../../../../back-blockchain//build/contracts/ContractCreator.json';

const TruffleContract = require('truffle-contract');



@Injectable()
export class BlockchainService {

    private contractCreator: any;
    private tradeableContract: any;

    private web3: any;


    constructor() {
 
        if (typeof window.web3 !== 'undefined') {

            // Use Mist/MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);
           console.log(this.web3);

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

            this.contractCreator = new Contract();
            this.contractCreator.address =  '0x62227531b82259561cc9ad4413188f08e536598a';
            this.contractCreator.ABI = (<any> contractCreatortMetadata).abi;;
            console.log("vai instanciar contract creator");
            this.contractCreator.instance = new this.web3.eth.Contract(this.contractCreator.ABI, this.contractCreator.address);
            console.log(this.contractCreator.instance);    



/*
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
       console.log("web3" + this.web3);

    }
   
    getAccounts(fResult) {
        this.web3.eth.getAccounts(fResult);
    }


    createTradeableWallet(fSucess: any, fError: any) {
            
        let self = this; 
        this.web3.eth.getAccounts().then(accounts => {
            let selectedAccount = accounts[0]; 

            //TODO: casos de erro
            //TODO: questao de concorrencia do Last Created - fazer map com hash da transacao -> contrato 
            self.contractCreator.instance.methods.createTradeableContract().send({from: selectedAccount})
            .then( receipt => 
                self.contractCreator.instance.methods.getLastCreatedContract(selectedAccount).call({from: selectedAccount})
                .then(result => {
                    fSucess(result);
                })
            )});
    }



/*
                .on('confirmation', function(confirmationNumber, receipt){
                    console.log(confirmationNumber);
                    
                    if (confirmationNumber==12) { //number of confirmation to make sure that the transaction will not roll back 

                         console.log("entrou");
                        self.contractCreator.instance.getContracts().call({from: selectedAccount}).then(
                            function(result){
                                 console.log("interno");
                                 console.log(result);
                            });

                    }
                    
                })
                .on('error', console.error)
*/
    //    });



/*

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
*/
}
