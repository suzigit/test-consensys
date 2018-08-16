import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {

  selectedAccount: any;  
  newTradeableWalletAddress: string;
  
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

      this.newTradeableWalletAddress = null;
  }

  ngOnInit() {

  }


  createWallet() {
    let self = this;

    this.blockchainService.createTradeableWallet(
    function(result) {
          self.newTradeableWalletAddress = result;
          console.log("sucess: " + result);
    }, function(e) {
        console.warn("error during contract retrieval nw: " + e);
    });

  }

}
