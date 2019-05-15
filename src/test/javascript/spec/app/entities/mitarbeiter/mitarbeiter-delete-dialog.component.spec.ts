/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { KaffeeautomatTestModule } from '../../../test.module';
import { MitarbeiterDeleteDialogComponent } from 'app/entities/mitarbeiter/mitarbeiter-delete-dialog.component';
import { MitarbeiterService } from 'app/entities/mitarbeiter/mitarbeiter.service';

describe('Component Tests', () => {
  describe('Mitarbeiter Management Delete Component', () => {
    let comp: MitarbeiterDeleteDialogComponent;
    let fixture: ComponentFixture<MitarbeiterDeleteDialogComponent>;
    let service: MitarbeiterService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [MitarbeiterDeleteDialogComponent]
      })
        .overrideTemplate(MitarbeiterDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MitarbeiterDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MitarbeiterService);
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
