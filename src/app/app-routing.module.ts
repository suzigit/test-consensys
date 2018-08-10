import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {InitialPanelComponent} from './initial-panel/initial-panel.component';
import {NewWalletComponent} from './new-wallet/new-wallet.component';
import {ManageWalletComponent} from './manage-wallet/manage-wallet.component';
import {BuyWalletComponent} from './buy-wallet/buy-wallet.component';


const routes: Routes = [
    {
        path: 'new-wallet',
        component: NewWalletComponent,
    },
    {
        path: 'manage-wallet',
        component: ManageWalletComponent,
    },
    {
        path: 'buy-wallet',
        component: BuyWalletComponent,
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



