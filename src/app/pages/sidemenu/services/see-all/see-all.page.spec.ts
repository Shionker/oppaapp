import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeeAllPage } from './see-all.page';

describe('SeeAllPage', () => {
  let component: SeeAllPage;
  let fixture: ComponentFixture<SeeAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeeAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
