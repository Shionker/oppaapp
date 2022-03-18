import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewCardPage } from './new-card.page';

describe('NewCardPage', () => {
  let component: NewCardPage;
  let fixture: ComponentFixture<NewCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
