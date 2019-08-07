import { Observable } from 'rxjs';

export interface UnsaveEditDeactivate {
    canDeactivate: () => | Observable<boolean>| Promise<boolean> | boolean;
}