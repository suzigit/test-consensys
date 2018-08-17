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


      }


    ngOnInit() {
    }

    withdrawTokens(){

        let self = this;

        this.blockchainService.withdrawTokens(self.tradeableWalletAddress, self.tokensAddress, self.numberOfTokens,
        function(result) {
              console.log("withdraw sucess!");
              console.log(result);
              self.newWithdrawHash = result;
              self.error = undefined;
        }, function(e) {
            console.log("withdraw  error: " + e);
            self.error = e;
            self.newWithdrawHash = undefined;
        });

    }


}
