import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment } from '../../environments/environment';
  
@Injectable()
export class HttpService{
  	
    constructor(private http: HttpClient){ }
	
    getData(endPoint: string){
        return this.http.get(`${environment.lamaApiUrl}/api/${endPoint}`);
    }

    putData(endPoint: string, data: any) {
        return this.http.put(`${environment.lamaApiUrl}/api/${endPoint}`, data);
    }
}