import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {InitialPanelComponent} from './initial-panel/initial-panel.component';
import {NewWalletComponent} from './new-wallet/new-wallet.component';
import {WithdrawTokensComponent} from './withdraw-tokens/withdraw-tokens.component';
import {BuyWalletComponent} from './buy-wallet/buy-wallet.component';
import {PutWalletSaleComponent} from './put-wallet-sale/put-wallet-sale.component';
import {AllWalletsComponent} from './all-wallets/all-wallets.component';
import {AllOwnersTwComponent} from './all-owners-tw/all-owners-tw.component';
import {AvailableSellWalletComponent} from './available-sell-wallet/available-sell-wallet.component';
import {AllWithdrawComponent} from './all-withdraw/all-withdraw.component';


const routes: Routes = [
    {
        path: 'new-wallet',
        component: NewWalletComponent,
    },
    {
        path: 'withdraw-tokens',
        component: WithdrawTokensComponent,
    },
    {
        path: 'buy-wallet',
        component: BuyWalletComponent,
    },
    {
        path: 'sell-wallet',
        component: PutWalletSaleComponent,
    },   
    {
        path: 'all-wallets',
        component: AllWalletsComponent,
    },   
    {
        path: 'available-sell-wallet',
        component: AvailableSellWalletComponent,
    },   
    {
        path: 'all-owners/:address',
        component: AllOwnersTwComponent,
    },
    {
        path: 'all-withdraw/:address',
        component: AllWithdrawComponent,
    },
    {
        path: '',
        component: InitialPanelComponent,
    },

];




@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}



