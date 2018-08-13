import { Injectable } from '@angular/core';

// import Web3 from web3.js
import Web3 from "web3";
import {Contract} from './service/contract'



import * as contractJson from './../../../back-blockchain//build/contracts/TradeableContract.json';

declare let window: any;


@Injectable()
export class Web3Service {

 // declare web3 object
  private web3: Web3;

    private tradeableContract: any;
  
  // get only interface object from contract
//  private interface = (<any>contractJson).interface;
  
  // address where contract is deployed.
//  private contractDeployedAt = "0x1180e1dD0267e92B28B2c98Ec00CB27E9e10c8d8";
//  private exhibition = null;

  constructor() {
    // call createWeb3
    this.createWeb3();
  }


// this method is used to create web3 object with MetaMask provider
  // create a exhibition contract instance
  private async createWeb3() {
    // Checking if Web3 has been injected by the browser (MetaMask)
    if (typeof window.web3 !== "undefined") {
      // Use MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);

        const abi = (<any>contractJson).abi;
        const code = (<any>contractJson).bytecode;


        // Create Contract proxy class
        let proxyTradeableContract = new this.web3.eth.Contract(abi);

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
      console.log("No web3? Please trying with MetaMask!");
    }
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


      getSelecteAccount() {
          return this.web3.eth.accounts[0];
      }



}

