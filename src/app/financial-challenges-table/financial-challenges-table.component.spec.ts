import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialChallengesTableComponent } from './financial-challenges-table.component';

describe('FinancialChallengesTableComponent', () => {
    let component: FinancialChallengesTableComponent;
    let fixture: ComponentFixture<FinancialChallengesTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinancialChallengesTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialChallengesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
