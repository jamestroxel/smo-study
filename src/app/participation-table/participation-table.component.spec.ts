import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationTableComponent } from './participation-table.component';

describe('ParticipationTableComponent', () => {
  let component: ParticipationTableComponent;
  let fixture: ComponentFixture<ParticipationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
