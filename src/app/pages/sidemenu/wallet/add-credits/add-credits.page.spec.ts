import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCreditsPage } from './add-credits.page';

describe('AddCreditsPage', () => {
  let component: AddCreditsPage;
  let fixture: ComponentFixture<AddCreditsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCreditsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCreditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
