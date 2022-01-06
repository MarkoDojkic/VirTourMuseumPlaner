import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitsComponent } from './exhibits.component';

describe('ExhibitsComponent', () => {
  let component: ExhibitsComponent;
  let fixture: ComponentFixture<ExhibitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExhibitsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
