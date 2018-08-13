import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule  } from 'angular-font-awesome';

import {AppLoadModule} from './app-load/app-load.module';
import { AppComponent } from './app.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { AppRoutingModule } from './app-routing.module';
import { BlockchainService } from './service/blockchain-service';
import { InitialPanelComponent } from './initial-panel/initial-panel.component';
import { ManageWalletComponent } from './manage-wallet/manage-wallet.component';
import { BuyWalletComponent } from './buy-wallet/buy-wallet.component';
import { Web3Service } from './web3.service';




@NgModule({
  declarations: [
    AppComponent,
    NewWalletComponent,
    InitialPanelComponent,
    ManageWalletComponent,
    BuyWalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
    AppLoadModule 
  ],
  providers: [BlockchainService, Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
