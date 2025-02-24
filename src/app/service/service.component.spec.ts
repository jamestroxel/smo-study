import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('StackedAreaComponent', () => {
    let component: StackedAreaComponent;
    let fixture: ComponentFixture<StackedAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StackedAreaComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StackedAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
