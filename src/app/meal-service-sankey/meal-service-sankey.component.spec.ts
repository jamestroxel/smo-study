import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MealServiceSankeyComponent } from './meal-service-sankey.component';

describe('MealServiceSankeyComponent', () => {
    let component: MealServiceSankeyComponent;
    let fixture: ComponentFixture<MealServiceSankeyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MealServiceSankeyComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MealServiceSankeyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
