import { Component, OnInit, Input } from '@angular/core';
import { ActionItem } from 'src/app/models/actionsitem';

@Component({
  selector: 'main-left-action-item',
  templateUrl: './main-left-action-item.component.html',
  styleUrls: ['./main-left-action-item.component.sass']
})
export class MainLeftActionItemComponent implements OnInit {

  constructor() { }

  @Input() item: ActionItem;

  ngOnInit() {
  }

}
