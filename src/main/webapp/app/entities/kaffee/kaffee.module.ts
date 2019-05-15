import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { KaffeeautomatSharedModule } from 'app/shared';
import {
  KaffeeComponent,
  KaffeeDetailComponent,
  KaffeeUpdateComponent,
  KaffeeDeletePopupComponent,
  KaffeeDeleteDialogComponent,
  kaffeeRoute,
  kaffeePopupRoute
} from './';

const ENTITY_STATES = [...kaffeeRoute, ...kaffeePopupRoute];

@NgModule({
  imports: [KaffeeautomatSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [KaffeeComponent, KaffeeDetailComponent, KaffeeUpdateComponent, KaffeeDeleteDialogComponent, KaffeeDeletePopupComponent],
  entryComponents: [KaffeeComponent, KaffeeUpdateComponent, KaffeeDeleteDialogComponent, KaffeeDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KaffeeautomatKaffeeModule {}
