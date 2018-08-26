import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-withdraw-tokens',
  templateUrl: './withdraw-tokens.component.html',
  styleUrls: ['./withdraw-tokens.component.css']
})
export class WithdrawTokensComponent implements OnInit {

  selectedAccount: any;  
  tradeableWalletAddress: string;
  tokensAddress: string;
  numberOfTokens: number; //TODO: Deal with floating point
  newWithdrawHash: string;
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

/*
      this.blockchainService.getAddr("michalzaleckihj",
      function(result) {
//            self.newTradeableWalletAddress = result;
            console.log("ENS sucess: " + result);
      }, function(error) {
          console.warn("error during ENS: " + error);
//          self.error = error;
      });
        
*/
   }

    ngOnInit() {
    }

    withdrawTokens(){

        let self = this;
        self.error = undefined;
        self.newWithdrawHash = undefined;

        if (self.tradeableWalletAddress && self.tokensAddress && self.numberOfTokens) {
            

            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {            

              if (this.blockchainService.isAddress(self.tokensAddress)) { 

                  this.blockchainService.withdrawTokens(self.tradeableWalletAddress, self.tokensAddress, self.numberOfTokens,
                  function(result) {
                        console.log("withdraw sucess!");
                        console.log(result);
                        self.newWithdrawHash = result;
                  }, function(e) {
                      console.log("withdraw  error: " + e);
                      self.error = e;
                  });
              
              }
              else {
                  self.error = "It is not a valid address - Token Address"
              }

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
