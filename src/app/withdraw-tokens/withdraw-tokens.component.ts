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
  totalTokensToWithdraw: number; //TODO: Deal with floating point
  newWithdrawHash: string;

  
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

        this.blockchainService.withdrawTokens(this.selectedAccount, this.totalTokensToWithdraw,
        function(result) {
              self.newWithdrawHash = result;
              console.log("sucess: " + result);
        }, function(e) {
            console.log("error: " + e);
        });

    }


}
