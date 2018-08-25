import { Component, OnInit } from '@angular/core';

import { BlockchainService } from './../service/blockchain-service';
import { FilesService } from './../service/files.service';



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
  description: string;
  hashDescription: string;
  errorSaveDescription: string;
  
  constructor(private blockchainService: BlockchainService, private filesService: FilesService ) { 

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


  saveDescription() {

    let self = this;
    self.hashDescription = "";
    self.errorSaveDescription = "";

    if (this.description) {

        this.filesService.saveFile(this.description).subscribe(
            data => {
                if (data) {
                    console.log("hash=" + data["Hash"]);
                    self.hashDescription = data["Hash"];
                }
                else {
                    self.errorSaveDescription = "No data";
                    console.log("nao retornou data");
                }
            },
            error => {
                self.errorSaveDescription = error;
                console.log("Erro ao inserir dado - excecao");
                console.log("error");

            });

    }
    
  
  }


  sale() {

        let self = this;
        self.error = undefined;
        self.newSellHash = undefined;

        if (self.tradeableWalletAddress && self.priceInGWei) {

            if (this.blockchainService.isAddress(self.tradeableWalletAddress)) {

                this.blockchainService.setAvailableToSell(self.tradeableWalletAddress, self.priceInGWei,
                self.hashDescription, function(result) {

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
