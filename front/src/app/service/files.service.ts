import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import * as ipfsAPI from 'ipfs-api';


import * as constants from './../../../constants.json';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';




@Injectable()
export class FilesService {

  serverUrl: string;
  ipfs: any;

  constructor(private http: HttpClient) { 
        this.serverUrl =  (<any>constants).ServerUrl;
        
        // connect to ipfs daemon API server
        this.ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}) // leaving out the arguments will default to these values
        
        console.log(this.ipfs);

  }
  
  saveFile(text): Observable<Object> {

    let fdata = new FormData();
    fdata.append("text", text);
    
    return this.http.post<Object>(this.serverUrl + 'add', fdata) 
        .do(result => console.log('hash :' +  JSON.stringify(result)))
        .catch(this.handleError);

  }


  getFile(hash): Observable<Object> {
    
      return this.http.get(this.serverUrl + 'cat?arg=' + hash, {responseType: 'text'});

  }



  private handleError(err: HttpErrorResponse)  {
    console.log("handle errror em Files.Service");
    console.log(err);
    return Observable.throw(err.message);
  }

}
