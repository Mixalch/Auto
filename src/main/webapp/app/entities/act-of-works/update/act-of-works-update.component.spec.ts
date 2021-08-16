jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ActOfWorksService } from '../service/act-of-works.service';
import { IActOfWorks, ActOfWorks } from '../act-of-works.model';
import { IClientCar } from 'app/entities/client-car/client-car.model';
import { ClientCarService } from 'app/entities/client-car/service/client-car.service';
import { IMaster } from 'app/entities/master/master.model';
import { MasterService } from 'app/entities/master/service/master.service';

import { ActOfWorksUpdateComponent } from './act-of-works-update.component';

describe('Component Tests', () => {
  describe('ActOfWorks Management Update Component', () => {
    let comp: ActOfWorksUpdateComponent;
    let fixture: ComponentFixture<ActOfWorksUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let actOfWorksService: ActOfWorksService;
    let clientCarService: ClientCarService;
    let masterService: MasterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ActOfWorksUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ActOfWorksUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActOfWorksUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      actOfWorksService = TestBed.inject(ActOfWorksService);
      clientCarService = TestBed.inject(ClientCarService);
      masterService = TestBed.inject(MasterService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ClientCar query and add missing value', () => {
        const actOfWorks: IActOfWorks = { id: 456 };
        const clientCar: IClientCar = { id: 66092 };
        actOfWorks.clientCar = clientCar;

        const clientCarCollection: IClientCar[] = [{ id: 10996 }];
        jest.spyOn(clientCarService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCarCollection })));
        const additionalClientCars = [clientCar];
        const expectedCollection: IClientCar[] = [...additionalClientCars, ...clientCarCollection];
        jest.spyOn(clientCarService, 'addClientCarToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        expect(clientCarService.query).toHaveBeenCalled();
        expect(clientCarService.addClientCarToCollectionIfMissing).toHaveBeenCalledWith(clientCarCollection, ...additionalClientCars);
        expect(comp.clientCarsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Master query and add missing value', () => {
        const actOfWorks: IActOfWorks = { id: 456 };
        const master: IMaster = { id: 73136 };
        actOfWorks.master = master;

        const masterCollection: IMaster[] = [{ id: 9796 }];
        jest.spyOn(masterService, 'query').mockReturnValue(of(new HttpResponse({ body: masterCollection })));
        const additionalMasters = [master];
        const expectedCollection: IMaster[] = [...additionalMasters, ...masterCollection];
        jest.spyOn(masterService, 'addMasterToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        expect(masterService.query).toHaveBeenCalled();
        expect(masterService.addMasterToCollectionIfMissing).toHaveBeenCalledWith(masterCollection, ...additionalMasters);
        expect(comp.mastersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const actOfWorks: IActOfWorks = { id: 456 };
        const clientCar: IClientCar = { id: 55089 };
        actOfWorks.clientCar = clientCar;
        const master: IMaster = { id: 43453 };
        actOfWorks.master = master;

        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(actOfWorks));
        expect(comp.clientCarsSharedCollection).toContain(clientCar);
        expect(comp.mastersSharedCollection).toContain(master);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ActOfWorks>>();
        const actOfWorks = { id: 123 };
        jest.spyOn(actOfWorksService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: actOfWorks }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(actOfWorksService.update).toHaveBeenCalledWith(actOfWorks);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ActOfWorks>>();
        const actOfWorks = new ActOfWorks();
        jest.spyOn(actOfWorksService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: actOfWorks }));
        saveSubject.complete();

        // THEN
        expect(actOfWorksService.create).toHaveBeenCalledWith(actOfWorks);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ActOfWorks>>();
        const actOfWorks = { id: 123 };
        jest.spyOn(actOfWorksService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ actOfWorks });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(actOfWorksService.update).toHaveBeenCalledWith(actOfWorks);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackClientCarById', () => {
        it('Should return tracked ClientCar primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClientCarById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMasterById', () => {
        it('Should return tracked Master primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMasterById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
