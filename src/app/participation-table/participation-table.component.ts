import { HttpClient } from '@angular/common/http';
import {
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ProgramsByMonthOutlets } from '../Types';

@Component({
    selector: 'app-participation-table',
    templateUrl: './participation-table.component.html',
    styleUrls: ['./participation-table.component.scss'],
})
export class ParticipationTableComponent implements OnInit, OnChanges {
    @ViewChild('table', { static: true }) tableContainer: ElementRef;
    @Input() chartView = false;
    @Input() selectedProgram = '';

    public data = {
        source: [],
        filter: [],
    };

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http
            .get('../../assets/data/participation-outlets.csv', {
                responseType: 'text',
            })
            .subscribe((data) => {
                this.data.source = d3.csvParse(data);
                this.data.filter = this.data.source.map(
                    (d: ProgramsByMonthOutlets) => {
                        let filtered = { ...d };
                        if (
                            this.selectedProgram === 'NSLP, SBP, SSO and SFSP'
                        ) {
                            filtered = {
                                Month: new Date(d.Month + 1).toLocaleDateString(
                                    'en-us',
                                    { month: 'long' }
                                ),
                                NSLP: d.NSLP,
                                SBP: d.SBP,
                                SSO: d.SSO,
                                SFSP: d.SFSP,
                            };
                        } else {
                            filtered = {
                                Month: new Date(d.Month + 1).toLocaleDateString(
                                    'en-us',
                                    { month: 'long' }
                                ),
                                ChildCareCenters: d.ChildCareCenters,
                                FamilyDayCareHomes: d.FamilyDayCareHomes,
                            };
                        }
                        return filtered;
                    }
                );
                this.data.filter['columns'] = Object.keys(this.data.filter[0]);
                this.drawTable(this.data.filter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.data.filter['columns']) {
            this.filterData();
            this.drawTable(this.data.filter);
        } else {
            return null;
        }
    }

    drawTable(data) {
        d3.select('#participation-head').remove();
        d3.select('#participation-body').remove();
        const table = d3.select(this.tableContainer.nativeElement);
        // const filtered = data.splice(0, 3);
        const header = table
            .append('thead')
            .attr('id', 'participation-head')
            .append('tr');
        // const Months = [];
        // data.forEach((d) =>
        //     Months.push([d.Month, d.NSLP, d.SBP, d.SSO, d.SFSP])
        // );
        header
            .selectAll('th')
            .data(data.columns)
            .enter()
            .append('th')
            .attr('class', 'participation')
            .text((d) => {
                if (d === 'ChildCareCenters') {
                    return 'Child Care Centers';
                }
                if (d === 'FamilyDayCareHomes') {
                    return 'Family Day Care Homes';
                } else {
                    return d;
                }
            });

        const tablebody = table
            .append('tbody')
            .attr('id', 'participation-body');
        const rows = tablebody
            .selectAll('tr')
            // .data(data.splice(0, 5))
            .data(data)
            .enter()
            .append('tr');

        rows.selectAll('td')

            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Month') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: parseInt(d[key], 10) };
                    }
                })
            )
            .enter()
            .append('td')
            .text((d) => {
                if (d.key === 'Month') {
                    return d.value;
                } else {
                    return d.value.toLocaleString('en-US');
                }
            });
    }

    updateTable(data) {
        d3.selectAll('.participation')
            .data(data.columns)
            .join()
            .text((d) => d);
        const tablebody = d3.select('tbody');
        const rows = tablebody.selectAll('tr').data(data).join();

        rows.selectAll('td')

            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Month') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: parseInt(d[key], 10) };
                    }
                })
            )
            .join()
            .text((d) => {
                if (d.key === 'Month') {
                    return d.value;
                } else {
                    return d.value.toLocaleString('en-US');
                }
            });
    }
    async filterData() {
        this.data.filter = this.data.source.map((d: ProgramsByMonthOutlets) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                filtered = {
                    Month: new Date(d.Month + 1).toLocaleDateString('en-us', {
                        month: 'long',
                    }),
                    NSLP: d.NSLP,
                    SBP: d.SBP,
                    SSO: d.SSO,
                    SFSP: d.SFSP,
                };
            } else {
                filtered = {
                    Month: new Date(d.Month + 1).toLocaleDateString('en-us', {
                        month: 'long',
                    }),
                    ChildCareCenters: d.ChildCareCenters,
                    FamilyDayCareHomes: d.FamilyDayCareHomes,
                };
            }
            return filtered;
        });
        this.data.filter['columns'] = Object.keys(this.data.filter[0]);
    }
}
