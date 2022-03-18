import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClinicalRecordPage } from './clinical-record.page';

describe('ClinicalRecordPage', () => {
  let component: ClinicalRecordPage;
  let fixture: ComponentFixture<ClinicalRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalRecordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicalRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
