/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KaffeeautomatTestModule } from '../../../test.module';
import { KaffeeDeleteDialogComponent } from 'app/entities/kaffee/kaffee-delete-dialog.component';
import { KaffeeService } from 'app/entities/kaffee/kaffee.service';

describe('Component Tests', () => {
  describe('Kaffee Management Delete Component', () => {
    let comp: KaffeeDeleteDialogComponent;
    let fixture: ComponentFixture<KaffeeDeleteDialogComponent>;
    let service: KaffeeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [KaffeeDeleteDialogComponent]
      })
        .overrideTemplate(KaffeeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(KaffeeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(KaffeeService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
