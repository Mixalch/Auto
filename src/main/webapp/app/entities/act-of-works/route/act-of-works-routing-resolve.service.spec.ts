jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IActOfWorks, ActOfWorks } from '../act-of-works.model';
import { ActOfWorksService } from '../service/act-of-works.service';

import { ActOfWorksRoutingResolveService } from './act-of-works-routing-resolve.service';

describe('Service Tests', () => {
  describe('ActOfWorks routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ActOfWorksRoutingResolveService;
    let service: ActOfWorksService;
    let resultActOfWorks: IActOfWorks | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ActOfWorksRoutingResolveService);
      service = TestBed.inject(ActOfWorksService);
      resultActOfWorks = undefined;
    });

    describe('resolve', () => {
      it('should return IActOfWorks returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActOfWorks = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultActOfWorks).toEqual({ id: 123 });
      });

      it('should return new IActOfWorks if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActOfWorks = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultActOfWorks).toEqual(new ActOfWorks());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ActOfWorks })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultActOfWorks = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultActOfWorks).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
