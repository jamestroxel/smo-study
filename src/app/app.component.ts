import { HttpClient } from '@angular/common/http';
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Back, gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** @title Sidenav with configurable mode */

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterContentInit, AfterViewInit {
    @ViewChild('image', { static: true }) imageWrap: ElementRef;
    @ViewChild('toggle', { static: true }) navToggle: ElementRef;
    @ViewChild('scroll', { static: true }) scrollContainer: ElementRef;
    @Input() chartView = 'chart';
    @HostBinding('class.drawer-open')
    title = 'smo-summary-report';
    mode = new UntypedFormControl('over');
    public participationProgram = new UntypedFormControl(
        'NSLP, SBP, SSO and SFSP'
    );
    public operationsProgram = new UntypedFormControl('NSLP, SBP, or SSO SFAs');
    public financeProgram = new UntypedFormControl('NSLP, SBP, or SSO SFAs');
    public sitesProgram = new UntypedFormControl('NSLP, SBP, or SSO SFAs');
    public deliveryProgram = new UntypedFormControl('NSLP, SBP, or SSO SFAs');
    public optionsProgram = new UntypedFormControl('NSLP, SBP, or SSO SFAs');
    public serviceProgram = new UntypedFormControl('NSLP, SBP, SSO and SFSP');
    public summerProgram = new UntypedFormControl('Child Participation');
    public patternsProgram = new UntypedFormControl('NSLP');
    public improvedProgram = new UntypedFormControl('NSLP');
    public operationsProgramList: string[] = [
        'NSLP, SBP, or SSO SFAs',
        'SFSP Sponsors',
        'Non-SFA SFSP Sponsors',
        'CACFP Institutions',
    ];
    public summerProgramList: string[] = [
        'Meals Served',
        'Child Participation',
    ];
    public financeProgramList: string[] = [
        'NSLP, SBP, or SSO SFAs',
        'SFSP Sponsors',
        'Non-SFA SFSP Sponsors',
        'CACFP Institutions',
    ];
    public sitesProgramList: string[] = [
        'NSLP, SBP, or SSO SFAs',
        'SFSP Sponsors',
        'CACFP Institutions',
    ];
    public deliveryProgramList: string[] = [
        'NSLP, SBP, or SSO SFAs',
        'SFSP Sponsors',
        'CACFP Institutions',
    ];
    public optionsProgramList: string[] = [
        'NSLP, SBP, or SSO SFAs',
        'SFSP Sponsors',
        'CACFP Institutions',
    ];
    public patternsProgramList: string[] = [
        'NSLP',
        'SBP',
        'SSO',
        'SFSP',
        'CACFP',
    ];
    public improvedProgramList: string[] = [
        'NSLP',
        'SBP',
        'SSO',
        'SFSP',
        'CACFP',
    ];
    public participationProgramList: string[] = [
        'NSLP, SBP, SSO and SFSP',
        'CACFP',
    ];
    public serviceProgramList: string[] = ['NSLP, SBP, SSO and SFSP', 'CACFP'];
    public participationFilter = 'NSLP, SBP, SSO and SFSP';
    public programFilter = 'NSLP, SBP, or SSO SFAs';
    public financeFilter = 'NSLP, SBP, or SSO SFAs';
    public sitesFilter = 'NSLP, SBP, or SSO SFAs';
    public deliveryFilter = 'NSLP, SBP, or SSO SFAs';
    public optionsFilter = 'NSLP, SBP, or SSO SFAs';
    public patternsFilter = 'NSLP';
    public improvedFilter = 'NSLP';
    public summerFilter = 'Child Participation';
    public serviceFilter = 'NSLP, SBP, SSO and SFSP';

    public events: string[] = [];
    public opened!: boolean;
    public isDrawerOpen!: boolean;
    public operationsView = false;
    public financeView = false;
    public sitesView = false;
    public deliveryView = 'chart';
    public optionsView = 'chart';
    public participationView = false;
    public patternsView = false;
    public improvedView = false;
    public summerView = false;
    public serviceView = false;

    private arrow: any;
    private drawerToggleEmitter: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    constructor(private renderer: Renderer2, private http: HttpClient) {}
    @HostListener('window:resize')
    onResize(event: any) {
        this.renderer.setAttribute(
            this.imageWrap?.nativeElement,
            'height',
            `${this.innerHeight()}`
        );
    }
    @HostListener('window:scroll')
    onScroll(event: any) {
        // console.log(this.scrollContainer.nativeElement.scrollTop);
        // const hero = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: '#content',
        //         start: 'top top',
        //         toggleActions: 'play restart none none',
        //         markers: false,
        //         scrub: true,
        //     },
        // });
        // const heroFade = hero.to('.nav-back2top', {
        //     opacity: 1,
        //     // delay: .35,
        //     duration: 0.35,
        //     ease: 'expo.out',
        // });
    }
    ngOnInit(): void {
        this.isDrawerOpen = false;
        this.arrow = gsap.timeline();
        this.arrow.to('.content-title-citation-arrow', {
            duration: 0.5,
            y: 5,
            repeat: -1,
            ease: Back.easeOut,
            yoyoEase: Back.easeOut,
        });
    }

    ngAfterViewInit() {
        // this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
        //     const hero = gsap.timeline({
        //         scrollTrigger: {
        //             trigger: '#chartTrigger',
        //             start: 'top 100%',
        //             toggleActions: 'play restart none none',
        //             markers: false,
        //             scrub: 1,
        //         },
        //     });
        //     const heroFade = hero.to('.content-main-heading', {
        //         opacity: 0,
        //         // delay: .35,
        //         duration: 0.35,
        //         ease: 'expo.out',
        //     });
        // });
    }
    ngAfterContentInit() {
        // const hero = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: '#chartTrigger',
        //         start: 'top center',
        //         toggleActions: 'play restart none none',
        //         markers: false,
        //         scrub: 1,
        //     },
        // });
        // const heroFade = hero.to('.content-main-heading', {
        //     opacity: 0,
        //     // delay: .35,
        //     duration: 0.35,
        //     ease: 'expo.out',
        // });
    }

    toggleNavDrawer(isDrawerOpen: boolean) {
        this.isDrawerOpen = isDrawerOpen;
        this.drawerToggleEmitter.emit(this.isDrawerOpen);
    }
    onNavLinkClicked($event: MouseEvent, el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
    participationToggle(value) {
        this.participationView = value.checked;
    }
    serviceToggle(value) {
        this.serviceView = value.checked;
    }
    operationsToggle(value) {
        this.operationsView = value.checked;
    }
    financeToggle(value) {
        this.financeView = value.checked;
    }
    sitesToggle(value) {
        this.sitesView = value.checked;
    }
    deliveryToggle(value) {
        this.deliveryView = value;
    }
    optionsToggle(value) {
        this.optionsView = value;
    }
    patternsToggle(value) {
        this.patternsView = value.checked;
    }
    improvedToggle(value) {
        this.improvedView = value.checked;
    }
    summerToggle(value) {
        this.summerView = value.checked;
    }

    participationFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.participationFilter = event.source.value;
            }
        }
    }

    serviceFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.serviceFilter = event.source.value;
            }
        }
    }

    operationsFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.programFilter = event.source.value;
            }
        }
    }

    financeFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.financeFilter = event.source.value;
            }
        }
    }
    summerFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.summerFilter = event.source.value;
            }
        }
    }

    sitesFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.sitesFilter = event.source.value;
            }
        }
    }

    deliveryFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.deliveryFilter = event.source.value;
            }
        }
    }

    optionsFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.optionsFilter = event.source.value;
            }
        }
    }

    patternsFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.patternsFilter = event.source.value;
            }
        }
    }

    improvedFilters(event: {
        isUserInput: any;
        source: { value: any; selected: any };
    }) {
        if (event.isUserInput) {
            if (event.source.selected === true) {
                this.improvedFilter = event.source.value;
            }
        }
    }

    private innerHeight(): number {
        return this.imageWrap?.nativeElement.clientHeight;
    }
}

/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
