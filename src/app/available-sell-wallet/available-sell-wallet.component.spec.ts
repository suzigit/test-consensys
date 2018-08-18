import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableSellWalletComponent } from './available-sell-wallet.component';

describe('AvailableSellWalletComponent', () => {
  let component: AvailableSellWalletComponent;
  let fixture: ComponentFixture<AvailableSellWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableSellWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableSellWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
