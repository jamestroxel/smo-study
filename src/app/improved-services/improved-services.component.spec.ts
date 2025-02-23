import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImprovedServicesComponent } from './improved-services.component';

describe('ImprovedServicesComponent', () => {
    let component: ImprovedServicesComponent;
    let fixture: ComponentFixture<ImprovedServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImprovedServicesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ImprovedServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
