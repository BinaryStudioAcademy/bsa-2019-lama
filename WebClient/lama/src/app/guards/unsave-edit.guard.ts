import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UnsaveEditDeactivate } from '../interfaces/unsave-edit-deactivate';

@Injectable({
  providedIn: 'root'
})
export class UnsaveEditGuard implements CanDeactivate<UnsaveEditDeactivate> {
  canDeactivate(component: UnsaveEditDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
