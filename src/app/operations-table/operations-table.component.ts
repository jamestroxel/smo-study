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
import { ProgramChallenges } from '../Types';

@Component({
    selector: 'app-operations-table',
    templateUrl: './operations-table.component.html',
    styleUrls: ['./operations-table.component.scss'],
})
export class OperationsTableComponent implements OnInit, OnChanges {
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
            .get('../../assets/data/operational-challenges-full.csv', {
                responseType: 'text',
            })
            .subscribe((data) => {
                const objs = d3.csvParse(data);
                this.data.source = objs;
                this.data.filter = this.data.source.map(
                    (d: ProgramChallenges) => {
                        let filtered = { ...d };
                        if (this.selectedProgram === 'NSLP, SBP, or SSO SFAs') {
                            filtered = {
                                Factor: d.Factor,
                                Min: d.Min,
                                Max: d.Max,
                                SFAs: d.SFAs,
                            };
                        }
                        if (this.selectedProgram === 'SFSP Sponsors') {
                            filtered = {
                                Factor: d.Factor,
                                Min: d.Min,
                                Max: d.Max,
                                SFSP_Sponsors: d.SFSP_Sponsors,
                            };
                        }
                        if (this.selectedProgram === 'Non-SFA SFSP Sponsors') {
                            filtered = {
                                Factor: d.Factor,
                                Min: d.Min,
                                Max: d.Max,
                                non_SFA_sponsors: d.non_SFA_sponsors,
                            };
                        } else if (
                            this.selectedProgram === 'CACFP Institutions'
                        ) {
                            filtered = {
                                Factor: d.Factor,
                                Min: d.Min,
                                Max: d.Max,
                                CACFP_Institutions: d.CACFP_Institutions,
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
            this.updateTable(this.data.filter);
        } else {
            return null;
        }
    }

    drawTable(data) {
        const table = d3.select(this.tableContainer.nativeElement);
        const header = table
            .append('thead')
            .attr('class', 'operations-t')
            .append('tr');
        header
            .selectAll('th')
            .data(data.columns)
            .enter()
            .append('th')
            .attr('class', 'operations-head')
            .text((d) => {
                if (d === 'SFSP_Sponsors') {
                    return 'SFSP Sponsors';
                }
                if (d === 'non_SFA_sponsors') {
                    return 'Non-SFA SFSP Sponsors';
                }
                if (d === 'SFAs') {
                    return 'NSLP, SBP, or SSO SFAs';
                }
                if (d === 'CACFP_Institutions') {
                    return 'CACFP Institutions';
                } else {
                    return d;
                }
            });

        const tablebody = table
            .append('tbody')
            .attr('class', 'operations-tbody');
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
            .attr('class', 'operations-td')
            .text((d) => {
                if (d.key === 'Factor') {
                    return d.value;
                } else {
                    return (d.value * 100).toFixed(0);
                }
            });
    }
    updateTable(data) {
        d3.selectAll('.operations-head')
            .data(data.columns)
            .join()
            .text((d) => {
                if (d === 'SFSP_Sponsors') {
                    return 'SFSP Sponsors';
                }
                if (d === 'non_SFA_sponsors') {
                    return 'Non-SFA SFSP Sponsors';
                }
                if (d === 'SFAs') {
                    return 'NSLP, SBP, or SSO SFAs';
                }
                if (d === 'CACFP_Institutions') {
                    return 'CACFP Institutions';
                } else {
                    return d;
                }
            });

        const tablebody = d3.select('.operations-tbody');
        const rows = tablebody.selectAll('tr').data(data).join();

        rows.selectAll('.operations-td')

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
        this.data.filter = this.data.source.map((d: ProgramChallenges) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'NSLP, SBP, or SSO SFAs') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    SFAs: d.SFAs,
                };
            }
            if (this.selectedProgram === 'SFSP Sponsors') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    SFSP_Sponsors: d.SFSP_Sponsors,
                };
            }
            if (this.selectedProgram === 'Non-SFA SFSP Sponsors') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    non_SFA_sponsors: d.non_SFA_sponsors,
                };
            } else if (this.selectedProgram === 'CACFP Institutions') {
                filtered = {
                    Factor: d.Factor,
                    Min: d.Min,
                    Max: d.Max,
                    CACFP_Institutions: d.CACFP_Institutions,
                };
            }
            return filtered;
        });
        this.data.filter['columns'] = Object.keys(this.data.filter[0]);
    }
}
