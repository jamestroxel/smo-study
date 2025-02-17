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
import { ProgramChallenges } from '../Types';

@Component({
    selector: 'app-meal-sites',
    templateUrl: './meal-sites.component.html',
    styleUrls: ['./meal-sites.component.scss'],
})
export class MealSitesComponent implements OnInit, OnChanges {
    @ViewChild('Chart', { static: true }) chartContainer: ElementRef;
    @ViewChild('legend', { static: true }) legendContainer: ElementRef;
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
    } = { top: 10, right: 35, bottom: 30, left: 600 };
    private readonly xScale: d3.ScaleLinear<number, number, never>;
    private readonly yScale: d3.ScaleBand<string>;

    constructor(private http: HttpClient) {
        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleBand();
    }

    @HostListener('window:resize')
    onResize(event: any) {
        const svg = d3.select(this.chartContainer?.nativeElement);

        this.xScale.range([0, this.innerWidth()]);
        this.yScale.range([0, this.innerHeight()]).padding(1);

        svg.select<SVGGElement>('#sites-x-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('transform', `translate(0,${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(-this.innerHeight()));

        svg.select<SVGGElement>('#sites-y-axis')
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .call(d3.axisLeft(this.yScale));

        svg.selectAll('.connector')
            .data(this.data.filter)
            .join()
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('x1', (d) => this.xScale(d.Min * 100).toFixed(0))
            .attr('x2', (d) => this.xScale(d.Max * 100).toFixed(0))
            .attr('y1', (d) => this.yScale(d.Factor))
            .attr('y2', (d) => this.yScale(d.Factor));

        svg.selectAll('.min')
            .data(this.data.filter)
            .join()
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('cx', (d) => this.xScale(d.Min * 100).toFixed(0))
            .attr('cy', (d) => this.yScale(d.Factor));

        svg.selectAll('.max')
            .data(this.data.filter)
            .join()
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('cx', (d) => this.xScale(d.Max * 100).toFixed(0))
            .attr('cy', (d) => this.yScale(d.Factor));

        svg.selectAll('.sites-filtered')
            .data(this.data.filter)
            .join()
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('cx', (d) =>
                this.xScale((Number(Object.values(d)[3]) * 100).toFixed(0))
            )
            .attr('cy', (d) => this.yScale(d.Factor));

        d3.selectAll('.domain').remove();
    }

    ngOnInit(): void {
        this.http
            .get('../../assets/data/meal-sites-full.csv', {
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

                this.drawLegend();
                this.drawChart(this.data.filter);
                this.updateChart(this.data.filter);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedProgram']) {
            this.filterData();
            this.updateChart(this.data.filter);
        }
        if (changes['chartView']) {
            this.filterData();
            this.updateChart(this.data.filter);
        }
    }
    drawChart(data) {
        const svg = d3.select(this.chartContainer?.nativeElement);
        const div = d3
            .select('mat-sidenav-container')
            .append('div')
            .attr('class', 'chart-toolTip')
            .attr('id', 'tt1');

        const contentGroup = svg
            .append('g')
            .attr('id', 'mealSites')
            .attr(
                'transform',
                `translate(${this.margin.left},${this.margin.top})`
            );

        this.xScale.domain([0, 100] as number[]).range([0, this.innerWidth()]);

        contentGroup
            .append('g')
            .attr('id', 'sites-x-axis')
            .attr('class', 'chart-axis-labels')
            .attr('transform', `translate(0,${this.innerHeight()})`)
            .call(d3.axisBottom(this.xScale).tickSize(-this.innerHeight()));

        this.yScale
            .domain(data.map((d) => d.Factor))
            .range([0, this.innerHeight()])
            .padding(1);

        contentGroup
            .append('g')
            .attr('id', 'sites-y-axis')
            .attr('class', 'chart-axis-labels')
            .call(d3.axisLeft(this.yScale))
            .selectAll('text')
            .attr('transform', `translate(${-this.margin.left + 10}, 0)`)
            .attr('text-anchor', 'start')
            .attr('dy', -5);

        contentGroup
            .selectAll('.connector')
            .data(data)
            .enter()
            .append('line')
            .attr('class', 'connector')
            .attr('x1', (d) => this.xScale(d.Min * 100))
            .attr('x2', (d) => this.xScale(d.Max * 100))
            .attr('y1', (d) => this.yScale(d.Factor))
            .attr('y2', (d) => this.yScale(d.Factor))
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        contentGroup
            .selectAll('.min')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'min')
            .attr('id', (d) => (d.Min * 100).toFixed(0))
            .attr('cx', (d) => this.xScale(d.Min * 100))
            .attr('cy', (d) => this.yScale(d.Factor))
            .attr('r', '3')
            .style('fill', '#046B5C');

        contentGroup
            .selectAll('.max')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'max')
            .attr('id', (d) => (d.Max * 100).toFixed(0))
            .attr('cx', (d) => this.xScale(d.Max * 100))
            .attr('cy', (d) => this.yScale(d.Factor))
            .attr('r', '3')
            .style('fill', '#046B5C');

        contentGroup
            .selectAll('.sites-filtered')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'sites-filtered')
            .attr('id', (d) => (d.SFAs * 100).toFixed(0))
            .attr('cx', (d) => this.xScale(d.SFAs * 100))
            .attr('cy', (d) => this.yScale(d.Factor))
            .attr('r', '5')
            .style('fill', 'white')
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        function mouseover(event, d) {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '10');
            div.transition().duration(200).style('opacity', 0.9);
            div.html(() => {
                if (Object.keys(d)[3] === 'SFSP_Sponsors') {
                    return `<span class="chart-toolTip-bold">SFSP Sponsors</span><br>${this.getAttribute(
                        'id'
                    )}%`;
                }
                if (Object.keys(d)[3] === 'non_SFA_sponsors') {
                    return `<span class="chart-toolTip-bold">Non-SFA SFSP Sponsors</span><br>${this.getAttribute(
                        'id'
                    )}%`;
                }
                if (Object.keys(d)[3] === 'SFAs') {
                    return `<span class="chart-toolTip-bold">NSLP, SBP, or SSO SFAs</span><br>${this.getAttribute(
                        'id'
                    )}%`;
                } else {
                    return `<span class="chart-toolTip-bold">CACFP Institutions</span><br>${this.getAttribute(
                        'id'
                    )}%`;
                }
            })
                .style('left', event.pageX + 'px')
                .style('top', event.pageY + 'px');
        }

        function mouseout() {
            d3.select(this)
                .transition()
                .ease(d3.easePolyInOut)
                .duration(200)
                .attr('r', '5');
            div.transition().duration(500).style('opacity', 0);
        }

        d3.selectAll('.sites-filtered')
            .on('mouseenter', mouseover)
            .on('touchstart', mouseover)
            .on('touchend', mouseout)
            .on('mouseleave', mouseout);

        d3.selectAll('.tick line').attr('stroke-width', 0.5);
        //.attr('stroke', '#5B6771');

        d3.selectAll('#sites-x-axis')
            .selectAll('text')
            .attr('text-anchor', 'start')
            .attr('dx', 5);
        d3.selectAll('#sites-x-axis')
            .selectAll('.tick line')
            .attr('stroke', '#5B6771')
            .attr('y1', 15);
        d3.selectAll('#sites-y-axis')
            .selectAll('.tick line')
            .attr('stroke', '#CCC')
            .attr('x1', -this.margin.left);
        d3.selectAll('.domain').remove();
    }
    updateChart(data) {
        const contentGroup = d3.select('#mealSites');

        this.xScale.range([0, this.innerWidth()]);

        this.yScale.range([0, this.innerHeight()]).padding(1);

        contentGroup
            .selectAll('.sites-filtered')
            .data(data)
            .join()
            .transition()
            .ease(d3.easePolyInOut)
            .duration(500)
            .attr('id', (d) => (Number(Object.values(d)[3]) * 100).toFixed(0))
            .attr('cx', (d) =>
                this.xScale((Number(Object.values(d)[3]) * 100).toFixed(0))
            );
    }
    drawLegend() {
        const legend = d3
            .select(this.legendContainer.nativeElement)
            .append('svg')
            .attr('height', '50px');

        const svg = legend.append('g');

        svg.append('line')
            .attr('class', 'connector')
            .attr('x1', 6)
            .attr('x2', 224)
            .attr('y1', 25)
            .attr('y2', 25)
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        svg.append('circle')
            .attr('class', 'min')
            .attr('cx', 6)
            .attr('cy', 25)
            .attr('r', '3')
            .style('fill', '#046B5C')
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        svg.append('circle')
            .attr('class', 'selected')
            .attr('cx', 112)
            .attr('cy', 25)
            .attr('r', '5')
            .style('fill', 'white')
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        svg.append('circle')
            .attr('class', 'max')
            .attr('cx', 220)
            .attr('cy', 25)
            .attr('r', '3')
            .style('fill', '#046B5C')
            .attr('stroke', '#046B5C')
            .attr('stroke-width', 2);

        svg.append('text')
            .attr('x', 1)
            .attr('y', 12)
            .attr('text-anchor', 'start')
            .attr('class', 'content-chart-legend-item-label')
            .html('Min');

        svg.append('text')
            .attr('x', 112)
            .attr('y', 12)
            .attr('text-anchor', 'middle')
            .attr('class', 'content-chart-legend-item-label')
            .html('Filtered LPOs');
        svg.append('text')
            .attr('x', 224)
            .attr('y', 12)
            .attr('text-anchor', 'end')
            .attr('class', 'content-chart-legend-item-label')
            .html('Max');
    }
    async filterData() {
        if (this.data.filter['columns']) {
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
        } else {
            return null;
        }
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
