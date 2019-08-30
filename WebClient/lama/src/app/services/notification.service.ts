import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationDTO } from '../models/Notification/notificationDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private client: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getNotifications(id: number) {
    return this.client.get<NotificationDTO[]>(
      `${environment.lamaApiUrl}/api/notification/${id}`
    );
  }
  sendIsRead(id: number) {
    return this.client.post(`${environment.lamaApiUrl}/api/notification`, id);
  }
}
