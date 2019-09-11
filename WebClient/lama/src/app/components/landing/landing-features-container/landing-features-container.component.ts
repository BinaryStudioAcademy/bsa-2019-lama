import { Component, OnInit } from '@angular/core';
import { FeatureBlock } from 'src/app/models';
import { style } from '@angular/animations';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'landing-features-container',
  templateUrl: './landing-features-container.component.html',
  styleUrls: ['./landing-features-container.component.sass']
})
export class LandingFeaturesContainerComponent implements OnInit {
  constructor() {}

  blocks: FeatureBlock[] = [];

  ngOnInit() {
    this.blocks = [
      {
        title: 'We have got your backup',
        description:
          // tslint:disable-next-line: max-line-length
          'Back up unlimited photos for free. Access them from computer – your photos will be safe, secure, and always with you.',
        image:
          'https://www.google.com/photos/about/static/images/devices_family.jpg',
        backgroundColor: 'white',
        icon: 'cloud_circle'
      },
      {
        title: 'Find your photos faster',
        description:
          // tslint:disable-next-line: max-line-length
          'Your photos are organized and searchable by the places and things in them – no tagging required. Just search dog to find all the photos of your pup.',
        image: 'https://www.google.com/photos/about/static/images/search.png',
        backgroundColor: '#F5F5F5',
        icon: 'search'
      },
      {
        title: 'Everyones photos, together at last',
        description:
          'Pool photos with friends and family using shared albums. So you never miss a moment.',
        image:
          'https://www.google.com/photos/about/static/images/charlie-2.png',
        backgroundColor: '#FFFCD3',
        icon: 'people'
      }
    ];
  }
}
