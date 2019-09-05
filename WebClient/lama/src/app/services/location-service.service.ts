import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ViewAlbum } from '../models/Album/ViewAlbum';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {
  constructor(private client: HttpClient) {}

  public AlbumsCities: ViewAlbum[];
  public AlbumsCountries: ViewAlbum[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  getUserLocationAlbums(id: number) {
    return this.client.get<ViewAlbum[]>(
      `${environment.lamaApiUrl}/api/location/city/${id}`
    );
  }
  getUserLocationAlbumsByCountry(id: number) {
    return this.client.get<ViewAlbum[]>(
      `${environment.lamaApiUrl}/api/location/country/${id}`
    );
  }
}
