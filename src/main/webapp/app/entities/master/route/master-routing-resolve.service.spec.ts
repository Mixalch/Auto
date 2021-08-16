jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMaster, Master } from '../master.model';
import { MasterService } from '../service/master.service';

import { MasterRoutingResolveService } from './master-routing-resolve.service';

describe('Service Tests', () => {
  describe('Master routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MasterRoutingResolveService;
    let service: MasterService;
    let resultMaster: IMaster | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MasterRoutingResolveService);
      service = TestBed.inject(MasterService);
      resultMaster = undefined;
    });

    describe('resolve', () => {
      it('should return IMaster returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMaster = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMaster).toEqual({ id: 123 });
      });

      it('should return new IMaster if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMaster = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMaster).toEqual(new Master());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Master })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMaster = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMaster).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
