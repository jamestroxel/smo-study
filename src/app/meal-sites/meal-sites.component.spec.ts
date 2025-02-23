import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealSitesComponent } from './meal-sites.component';

describe('MealSitesComponent', () => {
    let component: MealSitesComponent;
    let fixture: ComponentFixture<MealSitesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealSitesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MealSitesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
