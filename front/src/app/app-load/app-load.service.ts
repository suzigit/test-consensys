import { Injectable } from '@angular/core';


@Injectable()
export class AppLoadService {

    private web3: any;

    constructor() { }

    initializeApp(): Promise<any> {
        console.log(`initializeApp:: web3`);
        console.log(new Date());
/*
        if (typeof window['web3'] !== 'undefined') {
            this.web3 = new window['Web3'](window['web3'].currentProvider);
            console.log(this.web3);

        } else {
            console.log('Error! Web3 not connected');
            return;
        }        

*/
        return;
     }


}