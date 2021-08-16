jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MasterService } from '../service/master.service';
import { IMaster, Master } from '../master.model';

import { MasterUpdateComponent } from './master-update.component';

describe('Component Tests', () => {
  describe('Master Management Update Component', () => {
    let comp: MasterUpdateComponent;
    let fixture: ComponentFixture<MasterUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let masterService: MasterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MasterUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MasterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MasterUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      masterService = TestBed.inject(MasterService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const master: IMaster = { id: 456 };

        activatedRoute.data = of({ master });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(master));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Master>>();
        const master = { id: 123 };
        jest.spyOn(masterService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ master });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: master }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(masterService.update).toHaveBeenCalledWith(master);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Master>>();
        const master = new Master();
        jest.spyOn(masterService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ master });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: master }));
        saveSubject.complete();

        // THEN
        expect(masterService.create).toHaveBeenCalledWith(master);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Master>>();
        const master = { id: 123 };
        jest.spyOn(masterService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ master });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(masterService.update).toHaveBeenCalledWith(master);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
