import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
  
@Injectable()
export class HttpService{
  	
    constructor(private http: HttpClient){ }
	
    url = 'https://localhost:5001/api';
	
    getData(endPoint: string){
        return this.http.get(`${this.url}/${endPoint}`);
		
    }

    putData(endPoint: string, data: any) {
        return this.http.put(`${this.url}/${endPoint}`, data);
    }
}