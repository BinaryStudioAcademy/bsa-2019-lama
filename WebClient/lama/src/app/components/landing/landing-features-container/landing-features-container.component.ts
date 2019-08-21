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
          'Back up unlimited photos and videos for free, up to 16MP and 1080p HD. Access them from any phone, tablet, or computer on photos.google.com – your photos will be safe, secure, and always with you.',
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
        title: 'Make room for more memories',
        description:
          // tslint:disable-next-line: max-line-length
          'Never worry about running out of space on your phone again. Photos that are safely backed up can be removed from your device’s storage in just a tap.',
        image:
          'https://www.google.com/photos/about/static/images/dev_management.png',
        backgroundColor: '#B5FFDD',
        icon: 'cloud_upload'
      },
      {
        title: 'Everyones photos, together at last',
        description:
          'Pool photos with friends and family using shared albums. So you never miss a moment, no matter what device everyone has.',
        image:
          'https://www.google.com/photos/about/static/images/charlie-2.png',
        backgroundColor: '#FFFCD3',
        icon: 'people'
      }
    ];
  }
}
