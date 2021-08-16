import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ActOfWorksService } from '../service/act-of-works.service';

import { ActOfWorksComponent } from './act-of-works.component';

describe('Component Tests', () => {
  describe('ActOfWorks Management Component', () => {
    let comp: ActOfWorksComponent;
    let fixture: ComponentFixture<ActOfWorksComponent>;
    let service: ActOfWorksService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ActOfWorksComponent],
      })
        .overrideTemplate(ActOfWorksComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActOfWorksComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ActOfWorksService);

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
      expect(comp.actOfWorks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
