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
    selector: 'app-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit, OnChanges {
    @ViewChild('chart', { static: true }) chartContainer: ElementRef;
    @ViewChild('legend', { static: true }) legendContainer: ElementRef;
    @Input() chartView = false;
    @Input() selectedProgram = '';

    public stackedData = [];

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
    private readonly xScale: d3.ScalePoint<string>;
    private readonly xTimeScale: d3.TimeScale<string>;
    private readonly yScale: d3.ScaleLinear<number, number, never>;

    constructor(private http: HttpClient) {
        this.xTimeScale = d3.scaleTime();
        this.yScale = d3.scaleLinear();
    }

    @HostListener('window:resize')
    onResize() {
        const ref = this;
        const svg = d3.select(this.chartContainer?.nativeElement);
        this.xTimeScale.range([0, this.innerWidth()]);
        this.yScale.domain([0, 700]).range([this.innerHeight(), 0]);

        const mouseG = d3.select('.mouse-over-effects');

        mouseG
            .select('.mouse-rect') // append a rect to catch mouse movements on canvas
            .attr('width', this.innerWidth()) // can't catch mouse events on a g element
            .attr('height', this.innerHeight())
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', () => {
                // on mouse out hide line, circles and text
                d3.select('.mouse-line').style('display', 'none');
            })
            .on('mouseover', () => {
                // on mouse in show line, circles and text
                d3.select('.mouse-line').style('display', null);
            })
            .on('mousemove', (event) => {
                // mouse moving over canvas
                const mouse = d3.pointer(event)[0];
                d3.select('.mouse-line').attr('d', () => {
                    let d = 'M' + mouse + ',' + this.innerHeight();
                    d += ' ' + mouse + ',' + 0;
                    return d;
                });
            });

        svg.select<SVGGElement>('#x-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('transform', `translate(0,${this.innerHeight()})`)
            .call(
                d3
                    .axisBottom(this.xTimeScale)
                    .tickSize(0)
                    .ticks(d3.timeMonth, 1)
                    .tickFormat(d3.timeFormat('%b'))
            );

        svg.select<SVGGElement>('#y-axis-service')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .call(
                d3.axisLeft(this.yScale).ticks(7).tickSize(-this.innerWidth())
            );

        svg.selectAll('.layers')
            .data(this.stackedData)
            .join()

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
            .attr(
                'd',
                d3
                    .area()
                    .x((d, i) => ref.xTimeScale(d.data.Month))
                    .y0((d) => ref.yScale(d[0] * 0.000001))
                    .y1((d) => ref.yScale(d[1] * 0.000001))
            );

        d3.selectAll('.domain').remove();
    }

    ngOnInit(): void {
        this.http
            .get('../../assets/data/meals-served-new-cacfp-outlets.csv', {
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
                                Month: d3.timeParse('%Y-%m-%d')(d.Month),
                            };
                        } else {
                            filtered = {
                                ChildCareCenters: d.ChildCareCenters,
                                FamilyDayCareHomes: d.FamilyDayCareHomes,
                                Month: d3.timeParse('%Y-%m-%d')(d.Month),
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
        const ref = this;
        const svg = d3.select(this.chartContainer?.nativeElement);
        const keys = data.columns.slice(0, data.columns.length - 1);
        const bisectDate = d3.bisector((d) => d.Month).left;
        const div = d3
            .select('.mat-sidenav-container')
            .append('div')
            .attr('class', 'chart-toolTip');

        const contentGroup = svg
            .append('g')
            .attr('id', 'stack')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            );

        this.xTimeScale
            .domain([
                d3.timeSecond.offset(new Date('2020-01-01 00:00:00'), -1500000),
                d3.timeSecond.offset(new Date('2020-09-01 00:00:00'), +1500000),
            ])
            .range([0, this.innerWidth()]);

        contentGroup
            .append('g')
            .attr('id', 'x-axis')
            .attr('class', 'chart-axis-labels')
            .attr('transform', `translate(0,${this.innerHeight()})`)
            .call(
                d3
                    .axisBottom(this.xTimeScale)
                    .tickSize(0)
                    .ticks(d3.timeMonth, 1)
                    .tickFormat(d3.timeFormat('%b'))
            );

        this.yScale.domain([0, 700]).range([this.innerHeight(), 0]);

        contentGroup
            .append('g')
            .attr('id', 'y-axis-service')
            .attr('class', 'chart-axis-labels')
            .attr('dy', '-12em')
            .call(
                d3.axisLeft(this.yScale).ticks(7).tickSize(-this.innerWidth())
            );

        this.stackedData = d3.stack().keys(keys)(data);

        contentGroup
            .selectAll('.layers')
            .data(this.stackedData)
            .enter()
            .append('path')
            .attr('class', 'layers')
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
            .attr(
                'd',
                d3
                    .area()
                    .x((d) => ref.xTimeScale(d.data.Month))
                    .y0((d) => ref.yScale(d[0] * 0.000001))
                    .y1((d) => ref.yScale(d[1] * 0.000001))
            );

        d3.selectAll('#y-axis-service').selectAll('text').attr('dy', -5);
        d3.selectAll('#y-axis-service .tick line')
            .attr('stroke', '#5B6771')
            .attr('stroke-width', 0.5)
            .attr('x1', -40);

        d3.selectAll('.domain').remove();

        const mouseG = contentGroup
            .append('g')
            .attr('class', 'mouse-over-effects');

        mouseG
            .append('path') // this is the black vertical line to follow mouse
            .attr('class', 'mouse-line')
            .style('stroke', 'black')
            .style('stroke-width', '0.5px')
            .style('display', 'none');

        mouseG
            .append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('class', 'mouse-rect')
            .attr('width', this.innerWidth()) // can't catch mouse events on a g element
            .attr('height', this.innerHeight())
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', () => {
                // on mouse out hide line, circles and text
                d3.select('.mouse-line').style('display', 'none');
            })
            .on('mouseover', () => {
                // on mouse in show line, circles and text
                d3.select('.mouse-line').style('display', null);
            })
            .on('mousemove', (event) => {
                // mouse moving over canvas
                const mouse = d3.pointer(event)[0];
                d3.select('.mouse-line').attr('d', () => {
                    // let d = 'M' + mouse + ',' + this.innerHeight();
                    // d += ' ' + mouse + ',' + 0;
                    // console.log(d);
                    // return d;

                    const x0 = ref.xTimeScale.invert(d3.pointer(event)[0]);
                    const i = bisectDate(data, x0, 1);
                    const d0 = data[i - 1];
                    const d = d0;
                    let l =
                        'M' +
                        ref.xTimeScale(d.Month) +
                        ',' +
                        this.innerHeight();
                    l += ' ' + ref.xTimeScale(d.Month) + ',' + 0;
                    return l;
                });
            });

        contentGroup
            .on('mouseover', () => {
                mouseG.style('display', null);
                div.transition().duration(500).style('opacity', 0.9);
            })
            .on('mouseout', () => {
                mouseG.style('display', 'none');
                div.transition().duration(500).style('opacity', 0);
            })
            .on('mousemove', (event) => {
                const x0 = ref.xTimeScale.invert(d3.pointer(event)[0]);

                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d = d0;

                div.transition().duration(200).style('opacity', 0.9);
                div.html(() => {
                    if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                        return `<p class="chart-toolTip-heading">${new Intl.DateTimeFormat(
                            'en-US',
                            {
                                month: 'long',
                            }
                        ).format(
                            d.Month
                        )}</p><br><span class="chart-toolTip-bold">SFSP:</span> ${parseFloat(
                            d['SFSP']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">SSO:</span> ${parseFloat(
                            d['SSO']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">SBP:</span> ${parseFloat(
                            d['SBP']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">NSLP:</span> ${parseFloat(
                            d['NSLP']
                        ).toLocaleString('en-US')}`;
                    } else {
                        return `<p class="chart-toolTip-heading">${new Intl.DateTimeFormat(
                            'en-US',
                            {
                                month: 'long',
                            }
                        ).format(
                            d.Month
                        )}</p><br><span class="chart-toolTip-bold">Family Day Care Homes:</span> ${parseFloat(
                            d['FamilyDayCareHomes']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">Child Care Centers:</span> ${parseFloat(
                            d['ChildCareCenters']
                        ).toLocaleString('en-US')}`;
                    }
                })
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY + 'px');
            });
    }
    updateChart(data) {
        const div = d3.select('.chart-toolTip');
        const ref = this;
        const svg = d3.select(this.chartContainer?.nativeElement);
        const keys = data.columns.slice(0, data.columns.length - 1);
        const contentGroup = d3.select('#stack');
        const layers = d3.selectAll('.layers');
        this.xTimeScale.range([0, this.innerWidth()]);

        this.yScale.range([this.innerHeight(), 0]);

        this.stackedData = d3.stack().keys(keys)(data);

        const bisectDate = d3.bisector((d) => d.Month).left;

        contentGroup
            .selectAll('.layers')
            .data(this.stackedData)
            .join(
                (enter) =>
                    enter
                        .append('path')
                        .attr('class', 'layers')
                        .style('opacity', 1)
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
                        .transition()
                        .duration(500)

                        .attr(
                            'd',
                            d3
                                .area()
                                .x((d, i) => ref.xTimeScale(d.data.Month))
                                .y0((d) => ref.yScale(d[0] * 0.000001))
                                .y1((d) => ref.yScale(d[1] * 0.000001))
                        ),
                (update) =>
                    update
                        .transition()
                        .duration(500)
                        .attr('class', 'layers')
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

                        .attr(
                            'd',
                            d3
                                .area()
                                .x((d, i) => ref.xTimeScale(d.data.Month))
                                .y0((d) => ref.yScale(d[0] * 0.000001))
                                .y1((d) => ref.yScale(d[1] * 0.000001))
                        ),
                (exit) =>
                    exit.transition().duration(500).style('opacity', 0).remove()
            );
        const mouseG = contentGroup
            .append('g')
            .attr('class', 'mouse-over-effects');

        mouseG
            .append('path') // this is the black vertical line to follow mouse
            .attr('class', 'mouse-line')
            .style('stroke', 'black')
            .style('stroke-width', '0.5px')
            .style('display', 'none');

        mouseG
            .append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('class', 'mouse-rect')
            .attr('width', this.innerWidth()) // can't catch mouse events on a g element
            .attr('height', this.innerHeight())
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', () => {
                // on mouse out hide line, circles and text
                d3.select('.mouse-line').style('display', 'none');
            })
            .on('mouseover', () => {
                // on mouse in show line, circles and text
                d3.select('.mouse-line').style('display', null);
            })
            .on('mousemove', (event) => {
                // mouse moving over canvas
                d3.select('.mouse-line').attr('d', () => {
                    const x0 = ref.xTimeScale.invert(d3.pointer(event)[0]);
                    const i = bisectDate(data, x0, 1);
                    const d0 = data[i - 1];
                    const d = d0;
                    let l =
                        'M' +
                        ref.xTimeScale(d.Month) +
                        ',' +
                        this.innerHeight();
                    l += ' ' + ref.xTimeScale(d.Month) + ',' + 0;
                    return l;
                });
            });

        contentGroup
            .on('mouseover', () => {
                mouseG.style('display', null);
                div.transition().duration(500).style('opacity', 0.9);
            })
            .on('mouseout', () => {
                mouseG.style('display', 'none');
                div.transition().duration(500).style('opacity', 0);
            })
            .on('mousemove', (event) => {
                const x0 = ref.xTimeScale.invert(d3.pointer(event)[0]);
                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d = d0;

                div.transition().duration(200).style('opacity', 0.9);
                div.html(() => {
                    if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                        return `<p class="chart-toolTip-heading">${new Intl.DateTimeFormat(
                            'en-US',
                            {
                                month: 'long',
                            }
                        ).format(
                            d.Month
                        )}</p><br><span class="chart-toolTip-bold">SFSP:</span> ${parseFloat(
                            d['SFSP']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">SSO:</span> ${parseFloat(
                            d['SSO']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">SBP:</span> ${parseFloat(
                            d['SBP']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">NSLP:</span> ${parseFloat(
                            d['NSLP']
                        ).toLocaleString('en-US')}`;
                    } else {
                        return `<p class="chart-toolTip-heading">${new Intl.DateTimeFormat(
                            'en-US',
                            {
                                month: 'long',
                            }
                        ).format(
                            d.Month
                        )}</p><br><span class="chart-toolTip-bold">Family Day Care Homes:</span> ${parseFloat(
                            d['FamilyDayCareHomes']
                        ).toLocaleString(
                            'en-US'
                        )}<br><span class="chart-toolTip-bold">Child Care Centers:</span> ${parseFloat(
                            d['ChildCareCenters']
                        ).toLocaleString('en-US')}`;
                    }
                })
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY + 'px');
            });

        d3.selectAll('#y-axis-service .tick line').attr('stroke-width', 0.5);

        d3.selectAll('.domain').remove();
    }

    drawLegend(data) {
        d3.selectAll('#service').remove();
        const legend = d3.select(this.legendContainer.nativeElement);

        legend
            .selectAll('div')
            .data(data.columns.slice(0, -1))
            .join()
            .append('div')
            .attr('class', 'content-chart-legend-item')
            .attr('id', 'service')
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

    async filterData() {
        this.data.filter = this.data.source.map((d: ProgramsByMonthOutlets) => {
            let filtered = { ...d };
            if (this.selectedProgram === 'NSLP, SBP, SSO and SFSP') {
                filtered = {
                    NSLP: d.NSLP,
                    SBP: d.SBP,
                    SSO: d.SSO,
                    SFSP: d.SFSP,
                    Month: d3.timeParse('%Y-%m-%d')(d.Month),
                };
            } else {
                filtered = {
                    ChildCareCenters: d.ChildCareCenters,
                    FamilyDayCareHomes: d.FamilyDayCareHomes,
                    Month: d3.timeParse('%Y-%m-%d')(d.Month),
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
