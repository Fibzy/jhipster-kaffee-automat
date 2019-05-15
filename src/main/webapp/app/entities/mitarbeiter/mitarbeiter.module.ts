import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KaffeeautomatSharedModule } from 'app/shared';
import {
  MitarbeiterComponent,
  MitarbeiterDetailComponent,
  MitarbeiterUpdateComponent,
  MitarbeiterDeletePopupComponent,
  MitarbeiterDeleteDialogComponent,
  mitarbeiterRoute,
  mitarbeiterPopupRoute
} from './';

const ENTITY_STATES = [...mitarbeiterRoute, ...mitarbeiterPopupRoute];

@NgModule({
  imports: [KaffeeautomatSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MitarbeiterComponent,
    MitarbeiterDetailComponent,
    MitarbeiterUpdateComponent,
    MitarbeiterDeleteDialogComponent,
    MitarbeiterDeletePopupComponent
  ],
  entryComponents: [MitarbeiterComponent, MitarbeiterUpdateComponent, MitarbeiterDeleteDialogComponent, MitarbeiterDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KaffeeautomatMitarbeiterModule {}
