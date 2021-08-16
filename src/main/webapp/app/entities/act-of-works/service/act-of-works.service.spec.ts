import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IActOfWorks, ActOfWorks } from '../act-of-works.model';

import { ActOfWorksService } from './act-of-works.service';

describe('Service Tests', () => {
  describe('ActOfWorks Service', () => {
    let service: ActOfWorksService;
    let httpMock: HttpTestingController;
    let elemDefault: IActOfWorks;
    let expectedResult: IActOfWorks | IActOfWorks[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ActOfWorksService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        win: 'AAAAAAA',
        problev: 'AAAAAAA',
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

      it('should create a ActOfWorks', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ActOfWorks()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ActOfWorks', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            win: 'BBBBBB',
            problev: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ActOfWorks', () => {
        const patchObject = Object.assign(
          {
            problev: 'BBBBBB',
          },
          new ActOfWorks()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ActOfWorks', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            win: 'BBBBBB',
            problev: 'BBBBBB',
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

      it('should delete a ActOfWorks', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addActOfWorksToCollectionIfMissing', () => {
        it('should add a ActOfWorks to an empty array', () => {
          const actOfWorks: IActOfWorks = { id: 123 };
          expectedResult = service.addActOfWorksToCollectionIfMissing([], actOfWorks);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(actOfWorks);
        });

        it('should not add a ActOfWorks to an array that contains it', () => {
          const actOfWorks: IActOfWorks = { id: 123 };
          const actOfWorksCollection: IActOfWorks[] = [
            {
              ...actOfWorks,
            },
            { id: 456 },
          ];
          expectedResult = service.addActOfWorksToCollectionIfMissing(actOfWorksCollection, actOfWorks);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ActOfWorks to an array that doesn't contain it", () => {
          const actOfWorks: IActOfWorks = { id: 123 };
          const actOfWorksCollection: IActOfWorks[] = [{ id: 456 }];
          expectedResult = service.addActOfWorksToCollectionIfMissing(actOfWorksCollection, actOfWorks);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(actOfWorks);
        });

        it('should add only unique ActOfWorks to an array', () => {
          const actOfWorksArray: IActOfWorks[] = [{ id: 123 }, { id: 456 }, { id: 33348 }];
          const actOfWorksCollection: IActOfWorks[] = [{ id: 123 }];
          expectedResult = service.addActOfWorksToCollectionIfMissing(actOfWorksCollection, ...actOfWorksArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const actOfWorks: IActOfWorks = { id: 123 };
          const actOfWorks2: IActOfWorks = { id: 456 };
          expectedResult = service.addActOfWorksToCollectionIfMissing([], actOfWorks, actOfWorks2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(actOfWorks);
          expect(expectedResult).toContain(actOfWorks2);
        });

        it('should accept null and undefined values', () => {
          const actOfWorks: IActOfWorks = { id: 123 };
          expectedResult = service.addActOfWorksToCollectionIfMissing([], null, actOfWorks, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(actOfWorks);
        });

        it('should return initial array if no ActOfWorks is added', () => {
          const actOfWorksCollection: IActOfWorks[] = [{ id: 123 }];
          expectedResult = service.addActOfWorksToCollectionIfMissing(actOfWorksCollection, undefined, null);
          expect(expectedResult).toEqual(actOfWorksCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
