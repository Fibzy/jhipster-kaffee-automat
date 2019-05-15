import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { KaffeeautomatSharedLibsModule, KaffeeautomatSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [KaffeeautomatSharedLibsModule, KaffeeautomatSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [KaffeeautomatSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KaffeeautomatSharedModule {
  static forRoot() {
    return {
      ngModule: KaffeeautomatSharedModule
    };
  }
}
