import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramRaceComponent } from './program-race.component';

describe('ProgramRaceComponent', () => {
  let component: ProgramRaceComponent;
  let fixture: ComponentFixture<ProgramRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramRaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
