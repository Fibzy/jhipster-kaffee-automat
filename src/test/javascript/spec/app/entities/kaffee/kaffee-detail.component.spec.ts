/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KaffeeautomatTestModule } from '../../../test.module';
import { KaffeeDetailComponent } from 'app/entities/kaffee/kaffee-detail.component';
import { Kaffee } from 'app/shared/model/kaffee.model';

describe('Component Tests', () => {
  describe('Kaffee Management Detail Component', () => {
    let comp: KaffeeDetailComponent;
    let fixture: ComponentFixture<KaffeeDetailComponent>;
    const route = ({ data: of({ kaffee: new Kaffee(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [KaffeeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(KaffeeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(KaffeeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.kaffee).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
