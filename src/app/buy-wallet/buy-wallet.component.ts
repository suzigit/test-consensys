import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-buy-wallet',
  templateUrl: './buy-wallet.component.html',
  styleUrls: ['./buy-wallet.component.css']
})
export class BuyWalletComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  price: string; 
  newBuyHash: string;

  lastTradeableWalletAddress: string;
  
  constructor(private blockchainService: BlockchainService) { 

      let self = this;

      setInterval(function () {

        self.blockchainService.getAccounts().then(accounts =>
        {
            let newSelectedAccount = accounts[0]; 


            if (newSelectedAccount !== self.selectedAccount && newSelectedAccount) {
              self.selectedAccount = newSelectedAccount;
              console.log(self.selectedAccount);
            }
        }), 1000});

  }

  ngOnInit() {
  }

  getPrice() {

      if (this.tradeableWalletAddress != this.lastTradeableWalletAddress) {
            this.lastTradeableWalletAddress = this.tradeableWalletAddress;

            let self = this;

            this.blockchainService.getPriceToBuy(self.tradeableWalletAddress,
            function(result) {
                  console.log("Buy sucess: " + result);
                  if (result!=-1) {
                      self.price = result;
                  }
                  else {
                      self.price = "N/A";
                      console.log("Wallet is not available to sell");                        
                  }

            }, function(e) {
                  console.log("Buy error: " + e);
                  self.price = "N/A";
            });
      }
  }

  buy() {

        let self = this;

        this.blockchainService.buyWallet(self.tradeableWalletAddress, Number(self.price),
        function(result) {
              console.log("Buy sucess: " + result);
              self.newBuyHash = result;
        }, function(e) {
            console.log("Buy  error: " + e);
        });
  }     

}
