import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-page-header',
  templateUrl: './shared-page-header.component.html',
  styleUrls: ['./shared-page-header.component.sass']
})
export class SharedPageHeaderComponent implements OnInit {

  @Input() userName: string;
  @Input() userPhoto: string;

  constructor() { }

  ngOnInit() {
  }

}
