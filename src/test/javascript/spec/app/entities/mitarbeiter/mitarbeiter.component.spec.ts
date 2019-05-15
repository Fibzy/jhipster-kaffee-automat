/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { KaffeeautomatTestModule } from '../../../test.module';
import { MitarbeiterComponent } from 'app/entities/mitarbeiter/mitarbeiter.component';
import { MitarbeiterService } from 'app/entities/mitarbeiter/mitarbeiter.service';
import { Mitarbeiter } from 'app/shared/model/mitarbeiter.model';

describe('Component Tests', () => {
  describe('Mitarbeiter Management Component', () => {
    let comp: MitarbeiterComponent;
    let fixture: ComponentFixture<MitarbeiterComponent>;
    let service: MitarbeiterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [MitarbeiterComponent],
        providers: []
      })
        .overrideTemplate(MitarbeiterComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MitarbeiterComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MitarbeiterService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Mitarbeiter(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.mitarbeiters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
