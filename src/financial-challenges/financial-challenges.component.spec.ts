import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialChallengesComponent } from './financial-challenges.component';

describe('FinancialChallengesComponent', () => {
    let component: FinancialChallengesComponent;
    let fixture: ComponentFixture<FinancialChallengesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinancialChallengesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinancialChallengesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
