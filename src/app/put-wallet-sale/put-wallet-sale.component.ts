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
  price: number; //TODO: Deal with floating point
  newSellHash: string;

  
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

        this.blockchainService.setAvailableToSell(self.tradeableWalletAddress, self.price,
        function(result) {
              console.log("sell sucess: " + result);
              self.newSellHash = result;
        }, function(e) {
            console.log("sell  error: " + e);
        });


  }

}
