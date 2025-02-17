import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealOptionsTableComponent } from './meal-options-table.component';

describe('MealOptionsTableComponent', () => {
    let component: MealOptionsTableComponent;
    let fixture: ComponentFixture<MealOptionsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealOptionsTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MealOptionsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
