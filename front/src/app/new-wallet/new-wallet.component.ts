import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';


@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {

  selectedAccount: any;  
  newTradeableWalletAddress: string;
  
  constructor(private blockchainService: BlockchainService, public ref: ChangeDetectorRef) { 

      let self = this;
/*      setInterval(function () {
          if (self.blockchainService.getSelecteAccount() !== self.selectedAccount && self.blockchainService.getSelecteAccount()) {
            self.selectedAccount = self.blockchainService.getSelecteAccount();
            console.log(self.selectedAccount);
          }
        }, 1000);
*/
      this.newTradeableWalletAddress = null;
  }

  ngOnInit() {

  }


  createWallet() {
    let self = this;

    this.blockchainService.createTradeableWallet(
        function(result) {
          self.newTradeableWalletAddress = result;
          console.log("sucesso: " + result);
    }, function(e) {
        console.log("erro: " + e);
    });

  }

}
