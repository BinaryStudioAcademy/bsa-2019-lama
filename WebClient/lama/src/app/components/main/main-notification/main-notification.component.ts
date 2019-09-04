import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationDTO } from 'src/app/models/Notification/notificationDTO';
import { FileService } from 'src/app/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-main-notification',
  templateUrl: './main-notification.component.html',
  styleUrls: ['./main-notification.component.sass']
})
export class MainNotificationComponent implements OnInit {
  constructor(private fileService: FileService) {}

  imageUrl: string;
  unsubscribe = new Subject();

  @Output() id = new EventEmitter<number>();
  @Output() deleteId = new EventEmitter<number>();

  @Input() notification: NotificationDTO;
  ngOnInit() {
    if (this.notification.id !== 0) {
      this.fileService
        .getPhoto(this.notification.sender.imageUrl)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(x => (this.imageUrl = x));
      this.notification.date = moment
        .utc(this.notification.date)
        .local()
        .toDate();
    }
    this.imageUrl = '../../../../assets/setting-512.png';
  }
  sendIsRead() {
    if (this.notification.isRead) {
      return;
    }
    this.id.emit(this.notification.id);
    this.notification.isRead = true;
  }
  sendDelete() {
    this.deleteId.emit(this.notification.id);
  }
}
