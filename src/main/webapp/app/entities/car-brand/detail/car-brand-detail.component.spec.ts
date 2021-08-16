import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CarBrandDetailComponent } from './car-brand-detail.component';

describe('Component Tests', () => {
  describe('CarBrand Management Detail Component', () => {
    let comp: CarBrandDetailComponent;
    let fixture: ComponentFixture<CarBrandDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CarBrandDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ carBrand: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CarBrandDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CarBrandDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load carBrand on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.carBrand).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
