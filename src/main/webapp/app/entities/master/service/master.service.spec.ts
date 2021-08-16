import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMaster, Master } from '../master.model';

import { MasterService } from './master.service';

describe('Service Tests', () => {
  describe('Master Service', () => {
    let service: MasterService;
    let httpMock: HttpTestingController;
    let elemDefault: IMaster;
    let expectedResult: IMaster | IMaster[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MasterService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        date: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Master', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Master()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Master', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Master', () => {
        const patchObject = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          new Master()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Master', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Master', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMasterToCollectionIfMissing', () => {
        it('should add a Master to an empty array', () => {
          const master: IMaster = { id: 123 };
          expectedResult = service.addMasterToCollectionIfMissing([], master);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(master);
        });

        it('should not add a Master to an array that contains it', () => {
          const master: IMaster = { id: 123 };
          const masterCollection: IMaster[] = [
            {
              ...master,
            },
            { id: 456 },
          ];
          expectedResult = service.addMasterToCollectionIfMissing(masterCollection, master);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Master to an array that doesn't contain it", () => {
          const master: IMaster = { id: 123 };
          const masterCollection: IMaster[] = [{ id: 456 }];
          expectedResult = service.addMasterToCollectionIfMissing(masterCollection, master);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(master);
        });

        it('should add only unique Master to an array', () => {
          const masterArray: IMaster[] = [{ id: 123 }, { id: 456 }, { id: 74338 }];
          const masterCollection: IMaster[] = [{ id: 123 }];
          expectedResult = service.addMasterToCollectionIfMissing(masterCollection, ...masterArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const master: IMaster = { id: 123 };
          const master2: IMaster = { id: 456 };
          expectedResult = service.addMasterToCollectionIfMissing([], master, master2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(master);
          expect(expectedResult).toContain(master2);
        });

        it('should accept null and undefined values', () => {
          const master: IMaster = { id: 123 };
          expectedResult = service.addMasterToCollectionIfMissing([], null, master, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(master);
        });

        it('should return initial array if no Master is added', () => {
          const masterCollection: IMaster[] = [{ id: 123 }];
          expectedResult = service.addMasterToCollectionIfMissing(masterCollection, undefined, null);
          expect(expectedResult).toEqual(masterCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
