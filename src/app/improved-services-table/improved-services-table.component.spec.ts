import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImprovedServicesTableComponent } from './improved-services-table.component';

describe('ImprovedServicesTableComponent', () => {
    let component: ImprovedServicesTableComponent;
    let fixture: ComponentFixture<ImprovedServicesTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImprovedServicesTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ImprovedServicesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
