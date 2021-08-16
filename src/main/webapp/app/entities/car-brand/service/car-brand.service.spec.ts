import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICarBrand, CarBrand } from '../car-brand.model';

import { CarBrandService } from './car-brand.service';

describe('Service Tests', () => {
  describe('CarBrand Service', () => {
    let service: CarBrandService;
    let httpMock: HttpTestingController;
    let elemDefault: ICarBrand;
    let expectedResult: ICarBrand | ICarBrand[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CarBrandService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        brande: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a CarBrand', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CarBrand()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CarBrand', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            brande: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a CarBrand', () => {
        const patchObject = Object.assign({}, new CarBrand());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CarBrand', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            brande: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a CarBrand', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCarBrandToCollectionIfMissing', () => {
        it('should add a CarBrand to an empty array', () => {
          const carBrand: ICarBrand = { id: 123 };
          expectedResult = service.addCarBrandToCollectionIfMissing([], carBrand);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(carBrand);
        });

        it('should not add a CarBrand to an array that contains it', () => {
          const carBrand: ICarBrand = { id: 123 };
          const carBrandCollection: ICarBrand[] = [
            {
              ...carBrand,
            },
            { id: 456 },
          ];
          expectedResult = service.addCarBrandToCollectionIfMissing(carBrandCollection, carBrand);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CarBrand to an array that doesn't contain it", () => {
          const carBrand: ICarBrand = { id: 123 };
          const carBrandCollection: ICarBrand[] = [{ id: 456 }];
          expectedResult = service.addCarBrandToCollectionIfMissing(carBrandCollection, carBrand);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(carBrand);
        });

        it('should add only unique CarBrand to an array', () => {
          const carBrandArray: ICarBrand[] = [{ id: 123 }, { id: 456 }, { id: 12446 }];
          const carBrandCollection: ICarBrand[] = [{ id: 123 }];
          expectedResult = service.addCarBrandToCollectionIfMissing(carBrandCollection, ...carBrandArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const carBrand: ICarBrand = { id: 123 };
          const carBrand2: ICarBrand = { id: 456 };
          expectedResult = service.addCarBrandToCollectionIfMissing([], carBrand, carBrand2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(carBrand);
          expect(expectedResult).toContain(carBrand2);
        });

        it('should accept null and undefined values', () => {
          const carBrand: ICarBrand = { id: 123 };
          expectedResult = service.addCarBrandToCollectionIfMissing([], null, carBrand, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(carBrand);
        });

        it('should return initial array if no CarBrand is added', () => {
          const carBrandCollection: ICarBrand[] = [{ id: 123 }];
          expectedResult = service.addCarBrandToCollectionIfMissing(carBrandCollection, undefined, null);
          expect(expectedResult).toEqual(carBrandCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
