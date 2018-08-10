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

  constructor(private blockchainService: BlockchainService, private ref: ChangeDetectorRef) { 

  }

  ngOnInit() {
  }

  ngAfterViewChecked(){
    this.getSelecteAccountInternal();
    
  }

  getSelecteAccount() {
     if (!this.selectedAccount) this.getSelecteAccountInternal();
    console.log("select account");
    return this.selectedAccount;
  }

  getSelecteAccountInternal() {
    console.log("select account internal");
    this.selectedAccount = this.blockchainService.getSelecteAccount();
    return this.selectedAccount;
  }

  refreshPage() {
  }

  createWallet() {
    this.blockchainService.createWallet();
    console.log("create wallet");

  }

}
