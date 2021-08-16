import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IClientCar, ClientCar } from '../client-car.model';

import { ClientCarService } from './client-car.service';

describe('Service Tests', () => {
  describe('ClientCar Service', () => {
    let service: ClientCarService;
    let httpMock: HttpTestingController;
    let elemDefault: IClientCar;
    let expectedResult: IClientCar | IClientCar[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ClientCarService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        brande: 'AAAAAAA',
        win: 'AAAAAAA',
        dateReceiving: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateReceiving: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ClientCar', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateReceiving: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReceiving: currentDate,
          },
          returnedFromService
        );

        service.create(new ClientCar()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ClientCar', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            brande: 'BBBBBB',
            win: 'BBBBBB',
            dateReceiving: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReceiving: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ClientCar', () => {
        const patchObject = Object.assign(
          {
            brande: 'BBBBBB',
            win: 'BBBBBB',
            dateReceiving: currentDate.format(DATE_FORMAT),
          },
          new ClientCar()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateReceiving: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ClientCar', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            brande: 'BBBBBB',
            win: 'BBBBBB',
            dateReceiving: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateReceiving: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ClientCar', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addClientCarToCollectionIfMissing', () => {
        it('should add a ClientCar to an empty array', () => {
          const clientCar: IClientCar = { id: 123 };
          expectedResult = service.addClientCarToCollectionIfMissing([], clientCar);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(clientCar);
        });

        it('should not add a ClientCar to an array that contains it', () => {
          const clientCar: IClientCar = { id: 123 };
          const clientCarCollection: IClientCar[] = [
            {
              ...clientCar,
            },
            { id: 456 },
          ];
          expectedResult = service.addClientCarToCollectionIfMissing(clientCarCollection, clientCar);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ClientCar to an array that doesn't contain it", () => {
          const clientCar: IClientCar = { id: 123 };
          const clientCarCollection: IClientCar[] = [{ id: 456 }];
          expectedResult = service.addClientCarToCollectionIfMissing(clientCarCollection, clientCar);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(clientCar);
        });

        it('should add only unique ClientCar to an array', () => {
          const clientCarArray: IClientCar[] = [{ id: 123 }, { id: 456 }, { id: 94974 }];
          const clientCarCollection: IClientCar[] = [{ id: 123 }];
          expectedResult = service.addClientCarToCollectionIfMissing(clientCarCollection, ...clientCarArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const clientCar: IClientCar = { id: 123 };
          const clientCar2: IClientCar = { id: 456 };
          expectedResult = service.addClientCarToCollectionIfMissing([], clientCar, clientCar2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(clientCar);
          expect(expectedResult).toContain(clientCar2);
        });

        it('should accept null and undefined values', () => {
          const clientCar: IClientCar = { id: 123 };
          expectedResult = service.addClientCarToCollectionIfMissing([], null, clientCar, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(clientCar);
        });

        it('should return initial array if no ClientCar is added', () => {
          const clientCarCollection: IClientCar[] = [{ id: 123 }];
          expectedResult = service.addClientCarToCollectionIfMissing(clientCarCollection, undefined, null);
          expect(expectedResult).toEqual(clientCarCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
