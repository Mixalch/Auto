jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClientCarService } from '../service/client-car.service';
import { IClientCar, ClientCar } from '../client-car.model';
import { ICarBrand } from 'app/entities/car-brand/car-brand.model';
import { CarBrandService } from 'app/entities/car-brand/service/car-brand.service';

import { ClientCarUpdateComponent } from './client-car-update.component';

describe('Component Tests', () => {
  describe('ClientCar Management Update Component', () => {
    let comp: ClientCarUpdateComponent;
    let fixture: ComponentFixture<ClientCarUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let clientCarService: ClientCarService;
    let carBrandService: CarBrandService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClientCarUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ClientCarUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClientCarUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      clientCarService = TestBed.inject(ClientCarService);
      carBrandService = TestBed.inject(CarBrandService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call CarBrand query and add missing value', () => {
        const clientCar: IClientCar = { id: 456 };
        const carBrand: ICarBrand = { id: 29498 };
        clientCar.carBrand = carBrand;

        const carBrandCollection: ICarBrand[] = [{ id: 36596 }];
        jest.spyOn(carBrandService, 'query').mockReturnValue(of(new HttpResponse({ body: carBrandCollection })));
        const additionalCarBrands = [carBrand];
        const expectedCollection: ICarBrand[] = [...additionalCarBrands, ...carBrandCollection];
        jest.spyOn(carBrandService, 'addCarBrandToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ clientCar });
        comp.ngOnInit();

        expect(carBrandService.query).toHaveBeenCalled();
        expect(carBrandService.addCarBrandToCollectionIfMissing).toHaveBeenCalledWith(carBrandCollection, ...additionalCarBrands);
        expect(comp.carBrandsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const clientCar: IClientCar = { id: 456 };
        const carBrand: ICarBrand = { id: 9478 };
        clientCar.carBrand = carBrand;

        activatedRoute.data = of({ clientCar });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(clientCar));
        expect(comp.carBrandsSharedCollection).toContain(carBrand);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ClientCar>>();
        const clientCar = { id: 123 };
        jest.spyOn(clientCarService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientCar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: clientCar }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(clientCarService.update).toHaveBeenCalledWith(clientCar);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ClientCar>>();
        const clientCar = new ClientCar();
        jest.spyOn(clientCarService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientCar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: clientCar }));
        saveSubject.complete();

        // THEN
        expect(clientCarService.create).toHaveBeenCalledWith(clientCar);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ClientCar>>();
        const clientCar = { id: 123 };
        jest.spyOn(clientCarService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientCar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(clientCarService.update).toHaveBeenCalledWith(clientCar);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCarBrandById', () => {
        it('Should return tracked CarBrand primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCarBrandById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
