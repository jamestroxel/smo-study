import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealSitesTableComponent } from './meal-sites-table.component';

describe('MealSitesTableComponent', () => {
    let component: MealSitesTableComponent;
    let fixture: ComponentFixture<MealSitesTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealSitesTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MealSitesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
