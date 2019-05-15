/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KaffeeautomatTestModule } from '../../../test.module';
import { MitarbeiterDetailComponent } from 'app/entities/mitarbeiter/mitarbeiter-detail.component';
import { Mitarbeiter } from 'app/shared/model/mitarbeiter.model';

describe('Component Tests', () => {
  describe('Mitarbeiter Management Detail Component', () => {
    let comp: MitarbeiterDetailComponent;
    let fixture: ComponentFixture<MitarbeiterDetailComponent>;
    const route = ({ data: of({ mitarbeiter: new Mitarbeiter(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [KaffeeautomatTestModule],
        declarations: [MitarbeiterDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MitarbeiterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MitarbeiterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.mitarbeiter).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
