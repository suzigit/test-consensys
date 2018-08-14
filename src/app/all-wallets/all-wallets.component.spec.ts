import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWalletsComponent } from './all-wallets.component';

describe('AllWalletsComponent', () => {
  let component: AllWalletsComponent;
  let fixture: ComponentFixture<AllWalletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWalletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
