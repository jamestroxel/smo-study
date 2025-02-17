import { HttpClient } from '@angular/common/http';
import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { SummerDataByProgram } from '../Types';

@Component({
    selector: 'app-summer-participation',
    templateUrl: './summer-participation.component.html',
    styleUrls: ['./summer-participation.component.scss'],
})
export class SummerParticipationComponent implements OnInit, OnChanges {
    @ViewChild('Chart', { static: true }) chartContainer: ElementRef;
    @ViewChild('legend', { static: true }) legendContainer: ElementRef;
    @ViewChild('table', { static: true }) tableContainer: ElementRef;
    @Input() chartView = false;
    @Input() selectedProgram = '';

    public data = {
        source: [],
        filter: [],
    };

    private margin: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    } = { top: 20, right: 0, bottom: 30, left: 30 };
    private readonly xScale: d3.ScaleBand<string>;
    private readonly xSubgroup: d3.ScaleBand<string>;
    private readonly yScale: d3.ScaleLinear<number, number, never>;

    constructor(private http: HttpClient) {
        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();
        this.xSubgroup = d3.scaleBand();
    }

    @HostListener('window:resize')
    onResize() {
        const svg = d3.select(this.chartContainer?.nativeElement);

        this.xScale.range([0, this.innerWidth()]).padding([0.2]);

        this.yScale.range([this.innerHeight(), 0]);

        this.xSubgroup.range([0, this.xScale.bandwidth()]).padding([0.05]);

        svg.select<SVGGElement>('#summer-x-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(0)
            .attr('transform', `translate(0, ${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(0));

        svg.select<SVGGElement>('#summer-y-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .call(
                d3.axisLeft(this.yScale).ticks(6).tickSize(-this.innerWidth())
            );

        svg.selectAll('.sum-groups')
            .attr('transform', (d) => `translate(${this.xScale(d.Program)}, 0)`)
            .selectAll('.sum-bars')
            .attr('x', (d) => this.xSubgroup(d.key))
            .attr('y', (d) => this.yScale(d.value * 0.000001))
            .attr('width', this.xSubgroup.bandwidth())
            .attr(
                'height',
                (d) => this.innerHeight() - this.yScale(d.value * 0.000001)
            );
        d3.selectAll('.domain').remove();
    }

    ngOnInit(): void {
        this.http
            .get('../../assets/data/participation-summer-by-program.csv', {
                responseType: 'text',
            })
            .subscribe((data) => {
                this.data.source = d3.csvParse(data);

                // this.data.filter = this.data.source.map((d: SummerDataByProgram) => {
                //     let filtered = { ...d };
                //     if (this.selectedProgram === 'Meals Served') {
                //         filtered = {
                //             serv_SFSP: d.serv_SFSP,
                //             serv_SSO: d.serv_SSO,
                //             Year: d.Year,
                //         };
                //     } else {
                //         filtered = {
                //             part_SFSP: d.part_SFSP,
                //             part_SSO: d.part_SSO,
                //             Year: d.Year,
                //         };
                //     }
                //     return filtered;
                // });
                this.data.filter = this.data.source.map(
                    (d: SummerDataByProgram) => {
                        let filtered = { ...d };
                        if (this.selectedProgram === 'Meals Served') {
                            filtered = {
                                serv_19: d.serv_19,
                                serv_20: d.serv_20,
                                Program: d.Program,
                            };
                        } else {
                            filtered = {
                                part_19: d.part_19,
                                part_20: d.part_20,
                                Program: d.Program,
                            };
                        }
                        return filtered;
                    }
                );
                this.data.filter['columns'] = Object.keys(this.data.filter[0]);
                this.drawChart(this.data.filter);
                this.drawLegend(this.data.filter);
                this.updateChart(this.data.filter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.data.filter['columns']) {
            this.filterData();
        } else {
            return null;
        }
        this.updateChart(this.data.filter);
        this.drawLegend(this.data.filter);
    }

    drawChart(data) {
        const svg = d3.select(this.chartContainer?.nativeElement);

        const div = d3
            .select('.mat-sidenav-container')
            .append('div')
            .attr('class', 'chart-toolTip');
        const subgroups = data.columns.slice(0, data.columns.length - 1);
        const groups = data.map((d) => d.Program);
        const contentGroup = svg
            .append('g')
            .attr('id', 'summerParticipation')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            );

        this.xScale.domain(groups).range([0, this.innerWidth()]).padding([0.2]);

        contentGroup
            .append('g')
            .attr('id', 'summer-x-axis')
            .attr('class', 'chart-axis-labels')
            .attr('transform', `translate(0, ${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(0));

        this.yScale
            .domain(
                this.selectedProgram === 'Child Participation'
                    ? [0, 5]
                    : [0, 180]
            )
            .range([this.innerHeight(), 0]);

        contentGroup
            .append('g')
            .attr('id', 'summer-y-axis')
            .attr('class', 'chart-axis-labels')
            .call(
                d3.axisLeft(this.yScale).ticks(6).tickSize(-this.innerWidth())
            );

        this.xSubgroup
            .domain(subgroups)
            .range([0, this.xScale.bandwidth()])
            .padding([0.05]);

        contentGroup
            .append('g')
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('class', 'sum-groups')
            .attr('transform', (d) => `translate(${this.xScale(d.Program)}, 0)`)
            .selectAll('rect')
            .data((d) =>
                subgroups.map((key) => ({ key, value: parseInt(d[key], 10) }))
            )
            .join('rect')
            .attr('class', 'sum-bars')
            .attr('x', (d) => this.xSubgroup(d.key))
            .attr('y', (d) => this.yScale(d.value * 0.000001))
            .attr('width', this.xSubgroup.bandwidth())
            .attr(
                'height',
                (d) => this.innerHeight() - this.yScale(d.value * 0.000001)
            )
            .style('fill', (d) => {
                if (d.key === 'part_20' || d.key === 'serv_20') {
                    return '#046B5C';
                } else {
                    return '#7FA29A';
                }
            });
        function mouseover(event, d) {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '8');
            div.transition().duration(200).style('opacity', 0.9);
            div.html(() => {
                if (d.key === 'part_20' || d.key === 'serv_20') {
                    return `<span class="chart-toolTip-bold">2020</span><br>${d.value.toLocaleString(
                        'en-US'
                    )}`;
                } else {
                    return `<span class="chart-toolTip-bold">2019</span><br>${d.value.toLocaleString(
                        'en-US'
                    )}`;
                }
            })
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this).transition().ease(d3.easePolyInOut).duration(200);
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.sum-bars')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);

        d3.selectAll('#summer-y-axis text').attr('dy', -5);
        d3.selectAll('#summer-y-axis .tick line')
            .attr('stroke', '#5B6771')
            .attr('x1', -40)
            .attr('stroke-width', 0.5);

        d3.selectAll('.domain').remove();
    }

    drawLegend(data) {
        d3.selectAll('#summerLegend').remove();
        const legend = d3.select(this.legendContainer.nativeElement);

        legend
            .selectAll('div')
            .data(data.columns.slice(0, -1))
            .join()
            .append('div')
            .attr('class', 'content-chart-legend-item')
            .attr('id', 'summerLegend')
            .append('div')
            .attr('class', 'content-chart-legend-item-marker')
            .style('background-color', (d) => {
                if (d === 'part_20' || d === 'serv_20') {
                    return '#046B5C';
                } else {
                    return '#7FA29A';
                }
            });
        legend
            .selectAll('.content-chart-legend-item')
            .data(data.columns.slice(0, -1))
            .join()
            .append('p')
            .attr('class', 'content-chart-legend-item-label')
            .html((d) => {
                if (d === 'part_20' || d === 'serv_20') {
                    return 'July 2020';
                } else {
                    return 'July 2019';
                }
            });
    }

    updateChart(data) {
        const div = d3.select('.chart-toolTip');
        const svg = d3.select(this.chartContainer?.nativeElement);
        const subgroups = data.columns.slice(0, data.columns.length - 1);
        const groups = data.map((d) => d.Program);
        const contentGroup = d3
            .selectAll('.sum-groups')
            .data(data)
            .join((enter) =>
                enter
                    .append('g')
                    .attr('class', 'sum-groups')
                    .attr(
                        'transform',
                        (d) => `translate(${this.xScale(d.Program)}, 0)`
                    )
            );

        this.xScale.domain(groups).range([0, this.innerWidth()]).padding([0.2]);

        this.yScale
            .domain(
                this.selectedProgram === 'Child Participation'
                    ? [0, 5]
                    : [0, 180]
            )
            .range([this.innerHeight(), 0]);

        this.xSubgroup
            .domain(subgroups)
            .range([0, this.xScale.bandwidth()])
            .padding([0.05]);

        svg.select('#summer-y-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .call(
                d3.axisLeft(this.yScale).ticks(6).tickSize(-this.innerWidth())
            );

        contentGroup
            .selectAll('.sum-bars')
            .data((d) =>
                subgroups.map((key) => ({ key, value: parseInt(d[key], 10) }))
            )
            .join(
                (enter) =>
                    enter
                        .append('rect')
                        .attr('class', 'sum-bars')
                        .attr('x', (d) => this.xSubgroup(d.key))
                        .attr('y', (d) => this.yScale(d.value * 0.000001))
                        .attr('width', this.xSubgroup.bandwidth())
                        .attr(
                            'height',
                            (d) =>
                                this.innerHeight() -
                                this.yScale(d.value * 0.000001)
                        )
                        .style('fill', (d) => {
                            if (d.key === 'part_20' || d.key === 'serv_20') {
                                return '#046B5C';
                            } else {
                                return '#7FA29A';
                            }
                        }),
                (update) =>
                    update
                        .transition()
                        .duration(500)
                        .attr('x', (d) => this.xSubgroup(d.key))
                        .attr('y', (d) => this.yScale(d.value * 0.000001))
                        .attr('width', this.xSubgroup.bandwidth())
                        .attr(
                            'height',
                            (d) =>
                                this.innerHeight() -
                                this.yScale(d.value * 0.000001)
                        )
                        .style('fill', (d) => {
                            if (d.key === 'part_20' || d.key === 'serv_20') {
                                return '#046B5C';
                            } else {
                                return '#7FA29A';
                            }
                        }),
                (exit) =>
                    exit.transition().duration(500).style('opacity', 0).remove()
            );

        function mouseover(event, d) {
            d3.select(this).transition().ease(d3.easePolyInOut).duration(200);
            div.transition().duration(200).style('opacity', 0.9);
            div.html(() => {
                if (d.key === 'part_20' || d.key === 'serv_20') {
                    return `<span class="chart-toolTip-bold">2020</span><br>${d.value.toLocaleString(
                        'en-US'
                    )}`;
                } else {
                    return `<span class="chart-toolTip-bold">2019</span><br>${d.value.toLocaleString(
                        'en-US'
                    )}`;
                }
            })
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this).transition().ease(d3.easePolyInOut).duration(200);
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.sum-bars')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);

        d3.selectAll('#summer-y-axis text').attr('dy', -5);
        d3.selectAll('#summer-y-axis .tick line')
            .attr('stroke', '#5B6771')
            .attr('x1', -40)
            .attr('stroke-width', 0.5);

        d3.selectAll('.domain').remove();
    }

    async filterData() {
        // this.data.filter = this.data.source.map((d: SummerData) => {
        //     let filtered = { ...d };
        //     if (this.selectedProgram === 'Meals Served') {
        //         filtered = {
        //             serv_SFSP: d.serv_SFSP,
        //             serv_SSO: d.serv_SSO,
        //             Year: d.Year,
        //         };
        //     } else {
        //         filtered = {
        //             part_SFSP: d.part_SFSP,
        //             part_SSO: d.part_SSO,
        //             Year: d.Year,
        //         };
        //     }
        //     return filtered;
        // });
        this.data.filter = this.data.source.map((d: SummerDataByProgram) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'Meals Served') {
                filtered = {
                    serv_19: d.serv_19,
                    serv_20: d.serv_20,
                    Program: d.Program,
                };
            } else {
                filtered = {
                    part_19: d.part_19,
                    part_20: d.part_20,
                    Program: d.Program,
                };
            }
            return filtered;
        });
        this.data.filter['columns'] = Object.keys(this.data.filter[0]);
    }

    private innerWidth(): number {
        return (
            this.chartContainer?.nativeElement.clientWidth -
            this.margin.left -
            this.margin.right
        );
    }

    private innerHeight(): number {
        return (
            this.chartContainer?.nativeElement.clientHeight -
            this.margin.top -
            this.margin.bottom
        );
    }
}
