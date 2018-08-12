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

  constructor(private blockchainService: BlockchainService, public ref: ChangeDetectorRef) { 

      let self = this;
      setInterval(function () {
          if (self.blockchainService.getSelecteAccount() !== self.selectedAccount && self.blockchainService.getSelecteAccount()) {
            self.selectedAccount = self.blockchainService.getSelecteAccount();
            console.log(self.selectedAccount);
          }
        }, 1000);

  }

  ngOnInit() {

  }


  createWallet() {
    let self = this;

    this.blockchainService.createWallet(function(result, r) {
      console.log("Funcionou!");
      console.log(result);
      console.log(r);

    }, function(error) {
      console.log("Error during wallet creation");
      console.log(error);

    });

    console.log("create wallet");

  }

}
