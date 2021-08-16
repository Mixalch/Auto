import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClientCarService } from '../service/client-car.service';

import { ClientCarComponent } from './client-car.component';

describe('Component Tests', () => {
  describe('ClientCar Management Component', () => {
    let comp: ClientCarComponent;
    let fixture: ComponentFixture<ClientCarComponent>;
    let service: ClientCarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClientCarComponent],
      })
        .overrideTemplate(ClientCarComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClientCarComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClientCarService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.clientCars?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
