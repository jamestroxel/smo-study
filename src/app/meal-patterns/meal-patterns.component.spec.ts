import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealPatternsComponent } from './meal-patterns.component';

describe('MealPatternsComponent', () => {
    let component: MealPatternsComponent;
    let fixture: ComponentFixture<MealPatternsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealPatternsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MealPatternsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
