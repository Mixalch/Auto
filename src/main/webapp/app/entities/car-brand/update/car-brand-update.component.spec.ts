jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CarBrandService } from '../service/car-brand.service';
import { ICarBrand, CarBrand } from '../car-brand.model';

import { CarBrandUpdateComponent } from './car-brand-update.component';

describe('Component Tests', () => {
  describe('CarBrand Management Update Component', () => {
    let comp: CarBrandUpdateComponent;
    let fixture: ComponentFixture<CarBrandUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let carBrandService: CarBrandService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CarBrandUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CarBrandUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CarBrandUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      carBrandService = TestBed.inject(CarBrandService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const carBrand: ICarBrand = { id: 456 };

        activatedRoute.data = of({ carBrand });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(carBrand));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CarBrand>>();
        const carBrand = { id: 123 };
        jest.spyOn(carBrandService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ carBrand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: carBrand }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(carBrandService.update).toHaveBeenCalledWith(carBrand);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CarBrand>>();
        const carBrand = new CarBrand();
        jest.spyOn(carBrandService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ carBrand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: carBrand }));
        saveSubject.complete();

        // THEN
        expect(carBrandService.create).toHaveBeenCalledWith(carBrand);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CarBrand>>();
        const carBrand = { id: 123 };
        jest.spyOn(carBrandService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ carBrand });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(carBrandService.update).toHaveBeenCalledWith(carBrand);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
