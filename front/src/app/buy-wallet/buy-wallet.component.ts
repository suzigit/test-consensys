import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';
import { DescriptionService } from './../service/description.service';


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
  description: any;
  error: string;
  percentualFee: string;

  lastTradeableWalletAddress: string;
  
  constructor(private blockchainService: BlockchainService, private descriptionService: DescriptionService ) { 

      let self = this;
      self.percentualFee = "XX";      

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

    ensTranslationTW() {
        let self = this;

        this.blockchainService.getAddr(self.tradeableWalletAddress,
        function(result) {
            self.tradeableWalletAddress = result;
            console.log("ENS sucess: " + result);
        }, function(error) {
            console.warn("error during ENS: " + error);
            self.tradeableWalletAddress = "N/A";
        });

    }


  getPriceAndDescription() {


      if (this.tradeableWalletAddress != this.lastTradeableWalletAddress) {
            this.lastTradeableWalletAddress = this.tradeableWalletAddress;

            let self = this;
            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {            

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

                self.description = "";   
                this.blockchainService.getHashDescription(self.tradeableWalletAddress,
                function(hash) {
                    console.log("Hash sucess: " + hash);

                    if (hash) {

                        self.descriptionService.get(hash).subscribe(
                            data => {
                                if (data) {
                                    self.description = data;
                                    console.log("data from ipfs");
                                    console.log(data);

                                }
                                else {
                                    console.log("no data");
                                }
                            },
                            error => {
                                console.log("error getFile");
                                console.log(error);
                            });

                    }  

                }, function(e) {
                    console.log("Hash error: " + e);
                });


                this.blockchainService.getPercentualFee(self.tradeableWalletAddress,
                function(result) {
                    self.percentualFee = result;
                }, function(error) {
                    console.error("could not retrieve percentual fee");
                });


            } //close if checking valid address
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
        self.error = undefined;
        self.newBuyHash = undefined;

        if (self.tradeableWalletAddress) {

            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {            
            
                this.blockchainService.buyWallet(self.tradeableWalletAddress, Number(self.priceInGWei),
                function(result) {
                    console.log("Buy sucess: " + result);
                    self.newBuyHash = result;
                }, function(e) {
                    console.log("Buy  error: " + e);
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
  

}
