import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Mitarbeiter } from 'app/shared/model/mitarbeiter.model';
import { MitarbeiterService } from './mitarbeiter.service';
import { MitarbeiterComponent } from './mitarbeiter.component';
import { MitarbeiterDetailComponent } from './mitarbeiter-detail.component';
import { MitarbeiterUpdateComponent } from './mitarbeiter-update.component';
import { MitarbeiterDeletePopupComponent } from './mitarbeiter-delete-dialog.component';
import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';

@Injectable({ providedIn: 'root' })
export class MitarbeiterResolve implements Resolve<IMitarbeiter> {
  constructor(private service: MitarbeiterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMitarbeiter> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Mitarbeiter>) => response.ok),
        map((mitarbeiter: HttpResponse<Mitarbeiter>) => mitarbeiter.body)
      );
    }
    return of(new Mitarbeiter());
  }
}

export const mitarbeiterRoute: Routes = [
  {
    path: '',
    component: MitarbeiterComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Mitarbeiters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MitarbeiterDetailComponent,
    resolve: {
      mitarbeiter: MitarbeiterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Mitarbeiters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MitarbeiterUpdateComponent,
    resolve: {
      mitarbeiter: MitarbeiterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Mitarbeiters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MitarbeiterUpdateComponent,
    resolve: {
      mitarbeiter: MitarbeiterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Mitarbeiters'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const mitarbeiterPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: MitarbeiterDeletePopupComponent,
    resolve: {
      mitarbeiter: MitarbeiterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Mitarbeiters'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
