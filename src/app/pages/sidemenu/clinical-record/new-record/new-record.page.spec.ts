import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewRecordPage } from './new-record.page';

describe('NewRecordPage', () => {
  let component: NewRecordPage;
  let fixture: ComponentFixture<NewRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
