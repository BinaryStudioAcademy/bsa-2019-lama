import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewDescription } from 'src/app/models/Photo/NewDescription';
import { environment } from 'src/environments/environment';
import { NewLocation } from '../models/Photo/NewLocation';
import { NewPhotoDate } from '../models/Photo/NewPhotoDate';

@Injectable({
  providedIn: 'root'
})
export class PhotodetailsService {
  constructor(private client: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateDescription(desc: NewDescription) {
    return this.client.post<string>(
      `${environment.lamaApiUrl}/api/photodetails/description`,
      desc,
      this.httpOptions
    );
  }
  updateLocation(location: NewLocation) {
    return this.client.put<string>(
      `${environment.lamaApiUrl}/api/photodetails/location`,
      location
    );
  }
  DeleteLocation(Id: number) {
    return this.client.delete(
      `${environment.lamaApiUrl}/api/photodetails/location/${Id}`
    );
  }
  UpdateDate(date: NewPhotoDate) {
    return this.client.put<Date>(
      `${environment.lamaApiUrl}/api/photodetails/date`,
      date
    );
  }
}
