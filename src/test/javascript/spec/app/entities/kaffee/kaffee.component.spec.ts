/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KaffeeautomatTestModule } from '../../../test.module';
import { KaffeeComponent } from 'app/entities/kaffee/kaffee.component';
import { KaffeeService } from 'app/entities/kaffee/kaffee.service';
import { Kaffee } from 'app/shared/model/kaffee.model';

describe('Component Tests', () => {
  describe('Kaffee Management Component', () => {
    let comp: KaffeeComponent;
    let fixture: ComponentFixture<KaffeeComponent>;
    let service: KaffeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [KaffeeComponent],
        providers: []
      })
        .overrideTemplate(KaffeeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(KaffeeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(KaffeeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Kaffee(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.kaffees[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
