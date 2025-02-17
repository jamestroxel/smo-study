import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummerParticipationTableComponent } from './summer-participation-table.component';

describe('SummerParticipationTableComponent', () => {
    let component: SummerParticipationTableComponent;
    let fixture: ComponentFixture<SummerParticipationTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SummerParticipationTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SummerParticipationTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
