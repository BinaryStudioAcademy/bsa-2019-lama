import { NotificationUserDTO } from './notificationUserDTO';

export interface NotificationDTO {
  id: number;
  text: string;
  date: Date;
  isRead: boolean;
  sender: NotificationUserDTO;
}
