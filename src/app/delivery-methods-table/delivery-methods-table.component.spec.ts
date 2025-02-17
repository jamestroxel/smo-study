import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryMethodsTableComponent } from './delivery-methods-table.component';

describe('DeliveryMethodsTableComponent', () => {
    let component: DeliveryMethodsTableComponent;
    let fixture: ComponentFixture<DeliveryMethodsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeliveryMethodsTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeliveryMethodsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
