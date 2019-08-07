import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';

import { FileUploadDirective } from '../directives';
import { ImageService } from '../services';
import { SharingService } from '../services/sharing.service';

@NgModule(
{
  declarations:
  [
    FileUploadDirective
  ],
  providers:
  [
    ImageService, SharingService
  ],
  imports:
  [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule
  ],
  exports:
  [
    CommonModule, RouterModule, FormsModule,
    MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule,
    FileUploadDirective
  ]
})
export class SharedModule { }
