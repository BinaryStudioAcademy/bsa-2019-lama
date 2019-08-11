import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/User/user';
  
@Injectable()
export class HttpService{
  	
    constructor(private http: HttpClient){ }
	
    getData(endPoint: string): Observable<User> {
        return this.http.get(`${environment.lamaApiUrl}/api/${endPoint}`) as Observable<User>;
    }

    putData(endPoint: string, data: any) {
        return this.http.put(`${environment.lamaApiUrl}/api/${endPoint}`, data);
    }
}