jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IClientCar, ClientCar } from '../client-car.model';
import { ClientCarService } from '../service/client-car.service';

import { ClientCarRoutingResolveService } from './client-car-routing-resolve.service';

describe('Service Tests', () => {
  describe('ClientCar routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ClientCarRoutingResolveService;
    let service: ClientCarService;
    let resultClientCar: IClientCar | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ClientCarRoutingResolveService);
      service = TestBed.inject(ClientCarService);
      resultClientCar = undefined;
    });

    describe('resolve', () => {
      it('should return IClientCar returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClientCar = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultClientCar).toEqual({ id: 123 });
      });

      it('should return new IClientCar if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClientCar = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultClientCar).toEqual(new ClientCar());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ClientCar })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClientCar = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultClientCar).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
