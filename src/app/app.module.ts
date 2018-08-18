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
import { BuyWalletComponent } from './buy-wallet/buy-wallet.component';
import { WithdrawTokensComponent } from './withdraw-tokens/withdraw-tokens.component';
import { AllWalletsComponent } from './all-wallets/all-wallets.component';
import { PutWalletSaleComponent } from './put-wallet-sale/put-wallet-sale.component';
import { AllOwnersTwComponent } from './all-owners-tw/all-owners-tw.component';
import { AvailableSellWalletComponent } from './available-sell-wallet/available-sell-wallet.component';




@NgModule({
  declarations: [
    AppComponent,
    NewWalletComponent,
    InitialPanelComponent,
    BuyWalletComponent,
    WithdrawTokensComponent,
    AllWalletsComponent,
    PutWalletSaleComponent,
    AllOwnersTwComponent,
    AvailableSellWalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFontAwesomeModule,
    AppLoadModule 
  ],
  providers: [BlockchainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
