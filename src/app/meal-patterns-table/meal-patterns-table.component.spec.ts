import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPatternsTableComponent } from './meal-patterns-table.component';

describe('MealPatternsTableComponent', () => {
    let component: MealPatternsTableComponent;
    let fixture: ComponentFixture<MealPatternsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealPatternsTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MealPatternsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
