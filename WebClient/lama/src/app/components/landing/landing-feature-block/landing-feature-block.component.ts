import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FeatureBlock } from '../../../models/featureblock';
import { element } from 'protractor';

@Component({
  selector: 'landing-feature-block',
  templateUrl: './landing-feature-block.component.html',
  styleUrls: ['./landing-feature-block.component.sass']
})
export class LandingFeatureBlockComponent implements OnInit{

  constructor() { }

  @Input() featureBlock: FeatureBlock;

  ngOnInit() {
  }



}
