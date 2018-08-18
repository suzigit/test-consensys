import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-buy-wallet',
  templateUrl: './buy-wallet.component.html',
  styleUrls: ['./buy-wallet.component.css']
})
export class BuyWalletComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  priceInGWei: string; 
  newBuyHash: string;
  error: string;

  lastTradeableWalletAddress: string;
  
  constructor(private blockchainService: BlockchainService, private router: Router) { 

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

            this.blockchainService.getPriceToBuyInGWei(self.tradeableWalletAddress,
            function(result) {
                  console.log("Buy sucess: " + result);
                  if (result>=0) {
                      self.priceInGWei = result;
                  }
                  else {
                      self.priceInGWei = "N/A";
                      console.log("Wallet is not available to sell");                        
                  }

            }, function(e) {
                  console.log("Buy error: " + e);
                  self.priceInGWei = "N/A";
            });
      }
  }

  convertPriceToETH() {
      if (this.priceInGWei) {
          
          let pETH = Number(this.priceInGWei)/1000000000;

          if (isNaN(pETH) ) {
            return "N/A";
          }
          else {
              return pETH;
          }
      }
      return "";

  }

  buy() {

        let self = this;

        this.blockchainService.buyWallet(self.tradeableWalletAddress, Number(self.priceInGWei),
        function(result) {
              console.log("Buy sucess: " + result);
              self.newBuyHash = result;
              self.error = undefined;
        }, function(e) {
            console.log("Buy  error: " + e);
            self.error = e;
            self.newBuyHash = undefined;
        });
  }
  

}
