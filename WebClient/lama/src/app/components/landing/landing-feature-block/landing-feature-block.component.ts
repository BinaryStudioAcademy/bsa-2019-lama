import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FeatureBlock } from 'src/app/models';
import { element } from 'protractor';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'landing-feature-block',
  templateUrl: './landing-feature-block.component.html',
  styleUrls: ['./landing-feature-block.component.sass']
})
export class LandingFeatureBlockComponent implements OnInit {

  constructor() { }

  @Input() featureBlock: FeatureBlock;

  ngOnInit() {
  }



}
