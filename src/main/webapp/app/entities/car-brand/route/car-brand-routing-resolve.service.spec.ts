jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICarBrand, CarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';

import { CarBrandRoutingResolveService } from './car-brand-routing-resolve.service';

describe('Service Tests', () => {
  describe('CarBrand routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CarBrandRoutingResolveService;
    let service: CarBrandService;
    let resultCarBrand: ICarBrand | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CarBrandRoutingResolveService);
      service = TestBed.inject(CarBrandService);
      resultCarBrand = undefined;
    });

    describe('resolve', () => {
      it('should return ICarBrand returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCarBrand = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCarBrand).toEqual({ id: 123 });
      });

      it('should return new ICarBrand if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCarBrand = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCarBrand).toEqual(new CarBrand());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CarBrand })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCarBrand = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCarBrand).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
