import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummerParticipationComponent } from './summer-participation.component';

describe('SummerParticipationComponent', () => {
    let component: SummerParticipationComponent;
    let fixture: ComponentFixture<SummerParticipationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SummerParticipationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SummerParticipationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
