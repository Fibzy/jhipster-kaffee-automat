import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Kaffee } from 'app/shared/model/kaffee.model';
import { KaffeeService } from './kaffee.service';
import { KaffeeComponent } from './kaffee.component';
import { KaffeeDetailComponent } from './kaffee-detail.component';
import { KaffeeUpdateComponent } from './kaffee-update.component';
import { KaffeeDeletePopupComponent } from './kaffee-delete-dialog.component';
import { IKaffee } from 'app/shared/model/kaffee.model';

@Injectable({ providedIn: 'root' })
export class KaffeeResolve implements Resolve<IKaffee> {
  constructor(private service: KaffeeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IKaffee> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Kaffee>) => response.ok),
        map((kaffee: HttpResponse<Kaffee>) => kaffee.body)
      );
    }
    return of(new Kaffee());
  }
}

export const kaffeeRoute: Routes = [
  {
    path: '',
    component: KaffeeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Kaffees'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: KaffeeDetailComponent,
    resolve: {
      kaffee: KaffeeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Kaffees'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: KaffeeUpdateComponent,
    resolve: {
      kaffee: KaffeeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Kaffees'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: KaffeeUpdateComponent,
    resolve: {
      kaffee: KaffeeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Kaffees'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const kaffeePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: KaffeeDeletePopupComponent,
    resolve: {
      kaffee: KaffeeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Kaffees'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
