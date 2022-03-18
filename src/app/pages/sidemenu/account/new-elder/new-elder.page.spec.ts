import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewElderPage } from './new-elder.page';

describe('NewElderPage', () => {
  let component: NewElderPage;
  let fixture: ComponentFixture<NewElderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewElderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewElderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
