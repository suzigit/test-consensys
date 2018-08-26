import {Contract} from './Contract';

import * as ensContractMetadata from  './../../../ENSContract.json';
import * as resolverContractMetadata from './../../../ResolverContract.json';
import * as constants from './../../../constants.json';

export class ENSHelper {

    private web3: any;

    private ensContract: any;

    private resolverContract: any;

    constructor(web3) {
        
        this.web3 = web3;  

        this.ensContract = new Contract();
        this.ensContract.address =  (<any>constants).ENSContractAddr;
        this.ensContract.ABI = (<any> ensContractMetadata).abi;
        this.ensContract.instance = new this.web3.eth.Contract(this.ensContract.ABI, this.ensContract.address);
        console.log(this.ensContract.instance);


        this.resolverContract = new Contract();
        this.resolverContract.address =   (<any>constants).ResolverContractAddr;
        this.resolverContract.ABI = (<any> resolverContractMetadata).abi;
        this.resolverContract.instance = new this.web3.eth.Contract(this.resolverContract.ABI, this.resolverContract.address);
        console.log(this.resolverContract.instance);

    }


  getAddr(name, fSucess: any, fError: any) {

      name  = name + (<any>constants).ENSNetworkSufix;

      var node = this.namehash(name)
      this.ensContract.instance.methods.resolver(node).call()
      .then(result =>
        {
            if (resolverAddress === '0x0000000000000000000000000000000000000000') {
                return resolverAddress;
            }

            var resolverAddress = result;

            this.resolverContract.instance.methods.addr(node).call()
            .then(addr =>
            {
                fSucess(addr);
            }) 
            .catch (error => fError(error));

        }) 
       .catch (error => fError(error));
      
  }


 namehash(name) {
    var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name !== '') {
        var labels = name.split(".");
        for(var i = labels.length - 1; i >= 0; i--) {
            node = this.web3.utils.sha3(node + this.web3.utils.sha3(labels[i]).slice(2), {encoding: 'hex'});
        }
    }
    return node.toString(); 
 }


    
} 