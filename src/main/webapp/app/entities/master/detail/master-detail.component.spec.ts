import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MasterDetailComponent } from './master-detail.component';

describe('Component Tests', () => {
  describe('Master Management Detail Component', () => {
    let comp: MasterDetailComponent;
    let fixture: ComponentFixture<MasterDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MasterDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ master: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MasterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MasterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load master on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.master).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
