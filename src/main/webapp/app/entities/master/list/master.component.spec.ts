import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MasterService } from '../service/master.service';

import { MasterComponent } from './master.component';

describe('Component Tests', () => {
  describe('Master Management Component', () => {
    let comp: MasterComponent;
    let fixture: ComponentFixture<MasterComponent>;
    let service: MasterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MasterComponent],
      })
        .overrideTemplate(MasterComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MasterComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MasterService);

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
      expect(comp.masters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
