/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KaffeeautomatTestModule } from '../../../test.module';
import { MitarbeiterUpdateComponent } from 'app/entities/mitarbeiter/mitarbeiter-update.component';
import { MitarbeiterService } from 'app/entities/mitarbeiter/mitarbeiter.service';
import { Mitarbeiter } from 'app/shared/model/mitarbeiter.model';

describe('Component Tests', () => {
  describe('Mitarbeiter Management Update Component', () => {
    let comp: MitarbeiterUpdateComponent;
    let fixture: ComponentFixture<MitarbeiterUpdateComponent>;
    let service: MitarbeiterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [MitarbeiterUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MitarbeiterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MitarbeiterUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MitarbeiterService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Mitarbeiter(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Mitarbeiter();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
