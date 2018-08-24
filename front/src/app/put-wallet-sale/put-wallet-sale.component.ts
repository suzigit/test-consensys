import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-put-wallet-sale',
  templateUrl: './put-wallet-sale.component.html',
  styleUrls: ['./put-wallet-sale.component.css']
})
export class PutWalletSaleComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  priceInGWei: number; //TODO: Deal with floating point
  newSellHash: string;
  error: string;

  
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

  sale() {

        let self = this;
        self.error = undefined;
        self.newSellHash = undefined;

        if (self.tradeableWalletAddress && self.priceInGWei) {

            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {

                this.blockchainService.setAvailableToSell(self.tradeableWalletAddress, self.priceInGWei,
                function(result) {
                    console.log("sell sucess: " + result);
                    self.newSellHash = result;
                }, function(e) {
                    console.log("sell  error: " + e);
                    self.error = e;           
                });

            }
        
            else {
                self.error = "It is not a valid address - Tradeable Wallet"
            }

        }
        else {
          self.error = "All fields are required"
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

}
