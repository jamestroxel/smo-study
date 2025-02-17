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
import { SummerDataByProgram } from '../Types';

@Component({
    selector: 'app-summer-participation-table',
    templateUrl: './summer-participation-table.component.html',
    styleUrls: ['./summer-participation-table.component.scss'],
})
export class SummerParticipationTableComponent implements OnInit, OnChanges {
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
            .get('../../assets/data/participation-summer-by-program.csv', {
                responseType: 'text',
            })
            .subscribe((data) => {
                this.data.source = d3.csvParse(data);
                this.data.filter = this.data.source.map(
                    (d: SummerDataByProgram) => {
                        let filtered = { ...d };
                        if (this.selectedProgram === 'Meals Served') {
                            filtered = {
                                Program: d.Program,
                                serv_19: d.serv_19,
                                serv_20: d.serv_20,
                            };
                        } else {
                            filtered = {
                                Program: d.Program,
                                part_19: d.part_19,
                                part_20: d.part_20,
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
        d3.select('#summer-head').remove();
        d3.select('#summer-body').remove();
        const table = d3.select(this.tableContainer.nativeElement);
        // const filtered = data.splice(0, 3);
        const header = table
            .append('thead')
            .attr('id', 'summer-head')
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
            .attr('class', 'summer')
            .text((d) => {
                if (d === 'part_19' || d === 'serv_19') {
                    return 'July 2019';
                }
                if (d === 'part_20' || d === 'serv_20') {
                    return 'July 2020';
                } else {
                    return d;
                }
            });

        const tablebody = table.append('tbody').attr('id', 'summer-body');
        const rows = tablebody
            .selectAll('tr')
            // .data(data.splice(0, 5))
            .data(data)
            .enter()
            .append('tr');

        rows.selectAll('td')

            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Program') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: parseInt(d[key], 10) };
                    }
                })
            )
            .enter()
            .append('td')
            .text((d) => {
                if (d.key === 'Program') {
                    return d.value;
                } else {
                    return d.value.toLocaleString('en-US');
                }
            });
    }

    updateTable(data) {
        d3.selectAll('.summer')
            .data(data.columns)
            .join()
            .text((d) => d);
        const tablebody = d3.select('tbody');
        const rows = tablebody.selectAll('tr').data(data).join();

        rows.selectAll('td')

            .data((d) =>
                data.columns.map((key) => {
                    if (key === 'Program') {
                        return { key, value: d[key] };
                    } else {
                        return { key, value: parseInt(d[key], 10) };
                    }
                })
            )
            .join()
            .text((d) => {
                if (d.key === 'Program') {
                    return d.value;
                } else {
                    return d.value.toLocaleString('en-US');
                }
            });
    }
    async filterData() {
        this.data.filter = this.data.source.map((d: SummerDataByProgram) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'Meals Served') {
                filtered = {
                    Program: d.Program,
                    serv_19: d.serv_19,
                    serv_20: d.serv_20,
                };
            } else {
                filtered = {
                    Program: d.Program,
                    part_19: d.part_19,
                    part_20: d.part_20,
                };
            }
            return filtered;
        });
        this.data.filter['columns'] = Object.keys(this.data.filter[0]);
    }
}
