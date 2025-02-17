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
import { ProgramWaivers } from '../Types';

@Component({
    selector: 'app-improved-services-table',
    templateUrl: './improved-services-table.component.html',
    styleUrls: ['./improved-services-table.component.scss'],
})
export class ImprovedServicesTableComponent implements OnInit, OnChanges {
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
            .get('../../assets/data/improved-services-full.csv', {
                responseType: 'text',
            })
            .subscribe((data) => {
                const objs = d3.csvParse(data);
                this.data.source = objs;
                this.data.filter = this.data.source.map((d: ProgramWaivers) => {
                    let filtered = { ...d };
                    if (this.selectedProgram === 'NSLP') {
                        filtered = {
                            Factor: d.Factor,
                            Min: d.Min,
                            Max: d.Max,
                            NSLP: d.NSLP,
                        };
                    }
                    if (this.selectedProgram === 'SSO') {
                        filtered = {
                            Factor: d.Factor,
                            Min: d.Min,
                            Max: d.Max,
                            SSO: d.SSO,
                        };
                    }
                    if (this.selectedProgram === 'SBP') {
                        filtered = {
                            Factor: d.Factor,
                            Min: d.Min,
                            Max: d.Max,
                            SBP: d.SBP,
                        };
                    }
                    if (this.selectedProgram === 'SFSP') {
                        filtered = {
                            Factor: d.Factor,
                            Min: d.Min,
                            Max: d.Max,
                            SFSP: d.SFSP,
                        };
                    } else if (this.selectedProgram === 'CACFP') {
                        filtered = {
                            Factor: d.Factor,
                            Min: d.Min,
                            Max: d.Max,
                            CACFP: d.CACFP,
                        };
                    }
                    return filtered;
                });
                this.data.filter['columns'] = Object.keys(this.data.filter[0]);

                this.drawTable(this.data.filter);
            });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.data.filter['columns']) {
            this.filterData();
            this.updateTable(this.data.filter);
        } else {
            return null;
        }
    }

    drawTable(data) {
        const table = d3.select(this.tableContainer.nativeElement);
        const header = table
            .append('thead')
            .attr('class', 'imp-t')
            .append('tr');
        header
            .selectAll('th')
            .data(data.columns)
            .enter()
            .append('th')
            .attr('class', 'imp-head')
            .text((d) => d);

        const tablebody = table.append('tbody').attr('class', 'imp-tbody');
        const rows = tablebody.selectAll('tr').data(data).enter().append('tr');

        rows.selectAll('td')
            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Factor') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: d[key] };
                    }
                })
            )
            .enter()
            .append('td')
            .attr('class', 'imp-td')
            .text((d) => {
                if (d.key === 'Factor') {
                    return d.value;
                } else {
                    return (d.value * 100).toFixed(0);
                }
            });
    }
    updateTable(data) {
        d3.selectAll('.imp-head')
            .data(data.columns)
            .join()
            .text((d) => d);

        const tablebody = d3.select('.imp-tbody');
        const rows = tablebody.selectAll('tr').data(data).join();

        rows.selectAll('.imp-td')

            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Factor') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: d[key] };
                    }
                })
            )
            .join()
            .text((d) => {
                if (d.key === 'Factor') {
                    return d.value;
                } else {
                    return (d.value * 100).toFixed(0);
                }
            });
    }
    async filterData() {
        this.data.filter = this.data.source.map((d: ProgramWaivers) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'NSLP') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    NSLP: d.NSLP,
                };
            }
            if (this.selectedProgram === 'SSO') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    SSO: d.SSO,
                };
            }
            if (this.selectedProgram === 'SBP') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    SBP: d.SBP,
                };
            }
            if (this.selectedProgram === 'SFSP') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    SFSP: d.SFSP,
                };
            } else if (this.selectedProgram === 'CACFP') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    CACFP: d.CACFP,
                };
            }
            return filtered;
        });
        this.data.filter['columns'] = Object.keys(this.data.filter[0]);
    }
}
