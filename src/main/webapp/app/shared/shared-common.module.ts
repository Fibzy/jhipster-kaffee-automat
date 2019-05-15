import { NgModule } from '@angular/core';

import { KaffeeautomatSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [KaffeeautomatSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [KaffeeautomatSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class KaffeeautomatSharedCommonModule {}
