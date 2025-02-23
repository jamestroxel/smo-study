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
import { ProgramsByMonthOutlets } from '../Types';

@Component({
    selector: 'app-participation',
    templateUrl: './participation.component.html',
    styleUrls: ['./participation.component.scss'],
})
export class ParticipationComponent implements OnInit, OnChanges {
    @ViewChild('chart', { static: true }) chartContainer: ElementRef;
    @ViewChild('legend', { static: true }) legendContainer: ElementRef;
    @ViewChild('table', { static: true }) tableContainer: ElementRef;
    @Input() chartView = false;
    @Input() selectedProgram = '';

    public data = {
        source: [],
        filter: [],
    };

    public stackedData = [];

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

        svg.select<SVGGElement>('#x-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(0)
            .attr('transform', `translate(0, ${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(0));

        svg.select<SVGGElement>('#y-axis-participation')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .call(d3.axisLeft(this.yScale).tickSize(-this.innerWidth()));

        svg.selectAll('.groups')
            .attr('transform', (d) => `translate(${this.xScale(d.Month)}, 0)`)
            .selectAll('rect')
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
                                NSLP: d.NSLP,
                                SBP: d.SBP,
                                SSO: d.SSO,
                                SFSP: d.SFSP,
                                Month: d.Month,
                            };
                        } else {
                            filtered = {
                                ChildCareCenters: d.ChildCareCenters,
                                FamilyDayCareHomes: d.FamilyDayCareHomes,
                                Month: d.Month,
                            };
                        }
                        return filtered;
                    }
                );
                this.data.filter['columns'] = Object.keys(this.data.filter[0]);
                this.drawChart(this.data.filter);
                this.drawLegend(this.data.filter);
                if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                    this.updateChart(this.data.filter);
                } else {
                    this.drawStack(this.data.filter);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.data.filter['columns']) {
            this.filterData();
        } else {
            return null;
        }
        if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
            this.updateChart(this.data.filter);
        } else {
            this.drawStack(this.data.filter);
        }
        this.drawLegend(this.data.filter);
    }

    drawChart(data) {
        d3.selectAll('.groups').remove();
        const svg = d3.select(this.chartContainer?.nativeElement);
        const div = d3
            .select('.mat-sidenav-container')
            .append('div')
            .attr('class', 'chart-toolTip');
        const subgroups = data.columns.slice(0, data.columns.length - 1);

        const groups = data.map((d) => d.Month);

        const contentGroup = svg
            .append('g')
            .attr('id', 'fig1')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            );

        this.xScale.domain(groups).range([0, this.innerWidth()]).padding([0.2]);

        contentGroup
            .append('g')
            .attr('id', 'x-axis')
            .attr('class', 'chart-axis-labels')
            .attr('transform', `translate(0, ${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(0));

        this.yScale.domain([0, 27]).range([this.innerHeight(), 0]);

        contentGroup
            .append('g')
            .attr('id', 'y-axis-participation')
            .attr('class', 'chart-axis-labels')
            .call(d3.axisLeft(this.yScale).tickSize(-this.innerWidth()));

        this.xSubgroup
            .domain(subgroups)
            .range([0, this.xScale.bandwidth()])
            .padding([0.05]);

        contentGroup
            .append('g')
            .selectAll('g')
            .data(data)
            .join('g')
            .attr('class', 'groups')
            .attr('transform', (d) => `translate(${this.xScale(d.Month)}, 0)`)
            .selectAll('rect')
            .data((d) =>
                subgroups.map((key) => ({ key, value: parseInt(d[key], 10) }))
            )
            .join('rect')
            .attr('class', 'chart-bars')
            .attr('x', (d) => this.xSubgroup(d.key))
            .attr('y', (d) => this.yScale(d.value * 0.000001))
            .attr('width', this.xSubgroup.bandwidth())
            .attr(
                'height',
                (d) => this.innerHeight() - this.yScale(d.value * 0.000001)
            )
            .style('fill', (d) => {
                if (d.key === 'NSLP') {
                    return '#0B2949';
                }
                if (d.key === 'SBP') {
                    return '#D02B27';
                }
                if (d.key === 'SSO') {
                    return '#F1B51C';
                }
                if (d.key === 'SFSP') {
                    return '#5B6771';
                }
                if (d.key === 'ChildCareCenters') {
                    return '#9CCAB0';
                } else {
                    return '#17A673';
                }
            });

        function mouseover(event, d) {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '8');
            div.transition().duration(200).style('opacity', 0.9);
            div.html(
                `<span class="chart-toolTip-bold">${
                    d.key
                }</span><br>${d.value.toLocaleString('en-US')}`
            )
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '4');
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.chart-bars')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);

        d3.selectAll('#y-axis-participation').selectAll('text').attr('dy', -5);
        // d3.selectAll('#y-axis-participation')
        //     .selectAll('.tick line')
        //     .attr('x1', -40);

        d3.selectAll('#y-axis-participation .tick line')
            .attr('stroke-width', '0.25px')
            .attr('x1', -40)
            .attr('stroke', 'lightgray');

        d3.selectAll('.domain').remove();
    }

    drawStack(data) {
        d3.selectAll('.chart-bars').remove();
        const div = d3.select('.chart-toolTip');
        const svg = d3.select(this.chartContainer?.nativeElement);

        const subgroups = data.columns.slice(0, data.columns.length - 1);
        const groups = data.map((d) => d.Month);

        this.stackedData = d3.stack().keys(subgroups)(data);

        svg.append('g')
            .selectAll('g')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            )
            // Enter in the stack data = loop key per key = group per group
            .data(this.stackedData)
            .enter()
            .append('g')
            .attr('class', 'stacks')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            )
            .style('fill', (d) => {
                if (d.key === 'NSLP') {
                    return '#0B2949';
                }
                if (d.key === 'SBP') {
                    return '#D02B27';
                }
                if (d.key === 'SSO') {
                    return '#F1B51C';
                }
                if (d.key === 'SFSP') {
                    return '#5B6771';
                }
                if (d.key === 'ChildCareCenters') {
                    return '#9CCAB0';
                } else {
                    return '#17A673';
                }
            })
            .selectAll('rect')
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data((d) => d)
            .enter()
            .append('rect')
            .attr('class', 'chart-segments')
            .attr('x', (d) => this.xScale(d.data.Month))
            .attr('y', (d) => this.yScale(d[1] * 0.000001))
            .attr(
                'height',
                (d) =>
                    this.yScale(d[0] * 0.000001) - this.yScale(d[1] * 0.000001)
            )
            .attr('width', this.xScale.bandwidth());

        function mouseover(event, d) {
            let subgroupName = d3.select(this.parentNode).datum().key;
            if (d3.select(this.parentNode).datum().key === 'ChildCareCenters') {
                subgroupName = 'Child Care Centers';
            } else {
                subgroupName = 'Family Day Care Homes';
            }
            const subgroupValue =
                +d.data[d3.select(this.parentNode).datum().key];

            d3.select(this).transition().ease(d3.easePolyInOut).duration(200);
            div.transition().duration(200).style('opacity', 0.9);
            div.html(
                `<span class="chart-toolTip-bold">${subgroupName}</span><br>${subgroupValue.toLocaleString(
                    'en-US'
                )}`
            )
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this).transition().ease(d3.easePolyInOut).duration(200);
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.chart-segments')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);
    }

    drawLegend(data) {
        d3.selectAll('#participation').remove();
        const legend = d3.select(this.legendContainer.nativeElement);

        legend
            .selectAll('div')
            .data(data.columns.slice(0, -1))
            .join()
            .append('div')
            .attr('class', 'content-chart-legend-item')
            .attr('id', 'participation')
            .append('div')
            .attr('class', 'content-chart-legend-item-marker')
            .style('background-color', (d) => {
                if (d === 'NSLP') {
                    return '#0B2949';
                }
                if (d === 'SBP') {
                    return '#D02B27';
                }
                if (d === 'SSO') {
                    return '#F1B51C';
                }
                if (d === 'SFSP') {
                    return '#5B6771';
                }
                if (d === 'ChildCareCenters') {
                    return '#9CCAB0';
                } else {
                    return '#17A673';
                }
            });
        legend
            .selectAll('.content-chart-legend-item')
            .data(data.columns.slice(0, -1))
            .join()
            .append('p')
            .attr('class', 'content-chart-legend-item-label')
            .html((d) => {
                if (d === 'ChildCareCenters') {
                    return 'Child Care Centers';
                }
                if (d === 'FamilyDayCareHomes') {
                    return 'Family Day Care Homes';
                } else {
                    return d;
                }
            });
    }

    updateChart(data) {
        d3.selectAll('.stacks').remove();
        const div = d3.select('.chart-toolTip');
        const svg = d3.select(this.chartContainer?.nativeElement);
        const subgroups = data.columns.slice(0, data.columns.length - 1);
        const groups = data.map((d) => d.Month);

        this.stackedData = d3.stack().keys(subgroups)(data);

        const contentGroup = d3
            .selectAll('.groups')
            .data(data)
            .join((enter) =>
                enter
                    .append('g')
                    .attr('class', 'groups')
                    .attr(
                        'transform',
                        (d) => `translate(${this.xScale(d.Month)}, 0)`
                    )
            );

        this.xScale.domain(groups).range([0, this.innerWidth()]).padding([0.2]);

        this.yScale.range([this.innerHeight(), 0]);

        this.xSubgroup
            .domain(subgroups)
            .range([0, this.xScale.bandwidth()])
            .padding([0.05]);

        contentGroup
            .selectAll('.chart-bars')
            .data((d) =>
                subgroups.map((key) => ({
                    key,
                    value: parseInt(d[key], 10),
                }))
            )
            .join(
                (enter) =>
                    enter

                        .append('rect')
                        .attr('class', 'chart-bars')
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
                            if (d.key === 'NSLP') {
                                return '#0B2949';
                            }
                            if (d.key === 'SBP') {
                                return '#D02B27';
                            }
                            if (d.key === 'SSO') {
                                return '#F1B51C';
                            }
                            if (d.key === 'SFSP') {
                                return '#5B6771';
                            }
                            if (d.key === 'ChildCareCenters') {
                                return '#9CCAB0';
                            } else {
                                return '#17A673';
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
                            if (d.key === 'NSLP') {
                                return '#0B2949';
                            }
                            if (d.key === 'SBP') {
                                return '#D02B27';
                            }
                            if (d.key === 'SSO') {
                                return '#F1B51C';
                            }
                            if (d.key === 'SFSP') {
                                return '#5B6771';
                            }
                            if (d.key === 'ChildCareCenters') {
                                return '#9CCAB0';
                            } else {
                                return '#17A673';
                            }
                        }),
                (exit) =>
                    exit.transition().duration(500).style('opacity', 0).remove()
            );

        function mouseover(event, d) {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '8');
            div.transition().duration(200).style('opacity', 0.9);
            div.html(
                `<span class="chart-toolTip-bold">${
                    d.key
                }</span><br>${d.value.toLocaleString('en-US')}`
            )
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '4');
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.chart-bars')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);

        d3.selectAll('#y-axis-participation .tick line')
            .attr('stroke-width', '0.25px')
            .attr('x1', -40)
            .attr('stroke', 'lightgray');

        d3.selectAll('.domain').remove();
    }

    async filterData() {
        this.data.filter = this.data.source.map((d: ProgramsByMonthOutlets) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                filtered = {
                    NSLP: d.NSLP,
                    SBP: d.SBP,
                    SSO: d.SSO,
                    SFSP: d.SFSP,
                    Month: d.Month,
                };
            } else {
                filtered = {
                    ChildCareCenters: d.ChildCareCenters,
                    FamilyDayCareHomes: d.FamilyDayCareHomes,
                    Month: d.Month,
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
