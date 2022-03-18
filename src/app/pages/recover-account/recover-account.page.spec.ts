import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoverAccountPage } from './recover-account.page';

describe('RecoverAccountPage', () => {
  let component: RecoverAccountPage;
  let fixture: ComponentFixture<RecoverAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
