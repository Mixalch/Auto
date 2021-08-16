import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActOfWorksDetailComponent } from './act-of-works-detail.component';

describe('Component Tests', () => {
  describe('ActOfWorks Management Detail Component', () => {
    let comp: ActOfWorksDetailComponent;
    let fixture: ComponentFixture<ActOfWorksDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ActOfWorksDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ actOfWorks: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ActOfWorksDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActOfWorksDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load actOfWorks on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.actOfWorks).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
