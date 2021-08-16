import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClientCarDetailComponent } from './client-car-detail.component';

describe('Component Tests', () => {
  describe('ClientCar Management Detail Component', () => {
    let comp: ClientCarDetailComponent;
    let fixture: ComponentFixture<ClientCarDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ClientCarDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ clientCar: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ClientCarDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ClientCarDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load clientCar on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.clientCar).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
