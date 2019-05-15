/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KaffeeautomatTestModule } from '../../../test.module';
import { KaffeeUpdateComponent } from 'app/entities/kaffee/kaffee-update.component';
import { KaffeeService } from 'app/entities/kaffee/kaffee.service';
import { Kaffee } from 'app/shared/model/kaffee.model';

describe('Component Tests', () => {
  describe('Kaffee Management Update Component', () => {
    let comp: KaffeeUpdateComponent;
    let fixture: ComponentFixture<KaffeeUpdateComponent>;
    let service: KaffeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [KaffeeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(KaffeeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(KaffeeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(KaffeeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Kaffee(123);
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
        const entity = new Kaffee();
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
