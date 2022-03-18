import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ElderAccountPage } from './elder-account.page';

describe('ElderAccountPage', () => {
  let component: ElderAccountPage;
  let fixture: ComponentFixture<ElderAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElderAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ElderAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
