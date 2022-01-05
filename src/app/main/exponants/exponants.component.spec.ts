import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExponantsComponent } from './exponants.component';

describe('ExponantsComponent', () => {
  let component: ExponantsComponent;
  let fixture: ComponentFixture<ExponantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExponantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExponantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
