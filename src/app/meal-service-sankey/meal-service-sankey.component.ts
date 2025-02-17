// import { HttpClient } from '@angular/common/http';
// import {
//     Component,
//     ElementRef,
//     HostListener,
//     OnInit,
//     ViewChild,
// } from '@angular/core';
// import * as d3 from 'd3';
// import { sankey, sankeyLinkHorizontal, sankeyRight } from 'd3-sankey';

// @Component({
//     selector: 'app-meal-service-sankey',
//     templateUrl: './meal-service-sankey.component.html',
//     styleUrls: ['./meal-service-sankey.component.scss'],
// })
// export class MealServiceSankeyComponent implements OnInit {
//     @ViewChild('chart', { static: true }) chartContainer: ElementRef;

//     private data = [];
//     private graph = { nodes: [], links: [] };
//     private margin: {
//         top: number;
//         bottom: number;
//         left: number;
//         right: number;
//     } = { top: 10, right: 40, bottom: 30, left: 0 };
//     private readonly xScale: d3.ScaleTime<string>;
//     constructor(private http: HttpClient) {
//         this.xScale = d3.scaleTime();
//     }

//     @HostListener('window:resize')
//     onResize(event: any) {
//         const svg = d3.select(this.chartContainer?.nativeElement);

//         this.xScale.range([0, this.innerWidth()]);

//         svg.select<SVGGElement>('#sankeyAxis')
//             .transition()
//             .ease(d3.easePolyInOut)
//             .duration(500)
//             .attr(
//                 'transform',
//                 'translate(0' +
//                     ',' +
//                     (this.innerHeight() - this.margin.top) +
//                     ')'
//             )
//             .call(
//                 d3
//                     .axisBottom(this.xScale)
//                     .ticks(d3.timeMonth)
//                     .tickSize(-this.innerHeight())
//                     .tickFormat(d3.timeFormat('%B'))
//             )
//             .attr('x1', '100%');

//         svg.selectAll('.link')
//             .data(this.links)
//             .join()
//             .transition()
//             .ease(d3.easePolyInOut)
//             .duration(500)
//             .attr('d', sankeyLinkHorizontal())
//             .style('stroke-width', (d) => d.width);

//         svg.selectAll('.node')
//             .data(this.nodes)
//             .join()
//             .transition()
//             .ease(d3.easePolyInOut)
//             .duration(500)
//             .attr('transform', function (d) {
//                 return 'translate(' + d.x0 + ',' + d.y0 + ')';
//             });

//         d3.selectAll('.domain').remove();
//     }

//     ngOnInit(): void {
//         this.http
//             .get('../../assets/data/sankey-new-by-program-lunches.csv', {
//                 responseType: 'text',
//             })
//             .subscribe((data) => {
//                 const objs = d3.csvParse(data);
//                 objs.forEach((d) => {
//                     this.graph.nodes.push({
//                         name: d.source,
//                         program: d.program,
//                     });
//                     this.graph.nodes.push({
//                         name: d.target,
//                         program: d.program,
//                     });
//                     this.graph.links.push({
//                         source: d.source,
//                         target: d.target,
//                         value: +d.value,
//                     });
//                 });

//                 console.log(this.graph.nodes);
//                 this.drawChart(this.graph);
//             });
//     }
//     get sankeyData() {
//         if (this.graph === null) {
//             return null;
//         }
//         const sankeyGenerator = sankey()
//             .nodeSort((a, b) => b.value - a.value)
//             .linkSort(null)
//             .nodeAlign(sankeyRight)
//             .nodeWidth(5)
//             .nodePadding(10)
//             .extent([
//                 [0, 5],
//                 [
//                     this.innerWidth(),
//                     this.innerHeight() - (this.margin.top + this.margin.bottom),
//                 ],
//             ]);

//         return (({ nodes, links }) =>
//             sankeyGenerator({
//                 nodes: nodes.map((d) => Object.assign({}, d)),
//                 links: links.map((d) => Object.assign({}, d)),
//             }))(this.graph);
//     }
//     get nodes() {
//         if (this.sankeyData) {
//             return this.sankeyData.nodes;
//         } else {
//             return null;
//         }
//     }
//     get links() {
//         if (this.sankeyData) {
//             return this.sankeyData.links;
//         } else {
//             return null;
//         }
//     }

//     drawChart(data) {
//         const svg = d3.select(this.chartContainer?.nativeElement);

//         // format variables
//         // var formatNumber = d3.format(',.0f'), // zero decimal places
//         //     format = function (d) {
//         //         return formatNumber(d) + ' ' + units;
//         //     },
//         //     color = d3.scaleOrdinal(d3.schemeCategory10);

//         // append the svg object to the body of the page
//         const contentGroup = svg
//             .append('g')
//             .attr(
//                 'transform',
//                 `translate(${this.margin.left},${this.margin.top})`
//             );
//         this.xScale
//             .domain([new Date('2020-01-01'), new Date('2020-4-01')])
//             .range([0, this.innerWidth()]);

//         contentGroup
//             .append('g')
//             .attr('id', 'sankeyAxis')
//             .attr('class', 'chart-axis-labels')
//             .attr(
//                 'transform',
//                 'translate(0' +
//                     ',' +
//                     (this.innerHeight() - this.margin.top) +
//                     ')'
//             )
//             .call(
//                 d3
//                     .axisBottom(this.xScale)
//                     .ticks(d3.timeMonth)
//                     .tickSize(-this.innerHeight())
//                     .tickFormat(d3.timeFormat('%B'))
//             )
//             .attr('x1', '100%');
//         d3.selectAll('.tick line')
//             .attr('stroke-width', 0.5)
//             //.attr('stroke', '#5B6771');
//         d3.select('.domain').remove();

//         // return only the distinct / unique nodes
//         data.nodes = Array.from(
//             d3.group(data.nodes, (d) => d.name),
//             ([value]) => value
//         );

//         // loop through each link replacing the text with its index from node
//         data.links.forEach(function (d, i) {
//             data.links[i].source = data.nodes.indexOf(data.links[i].source);
//             data.links[i].target = data.nodes.indexOf(data.links[i].target);
//         });

//         // now loop through each nodes to make nodes an array of objects
//         // rather than an array of strings
//         data.nodes.forEach(function (d, i) {
//             console.log(data.nodes);
//             data.nodes[i] = { name: d };
//         });

//         // add in the links
//         contentGroup
//             .append('g')
//             .selectAll('.link')
//             .data(this.links)
//             .enter()
//             .append('path')
//             .attr('class', 'link')
//             .attr('d', sankeyLinkHorizontal())
//             .style('stroke-width', (d) => d.width)
//             .style('stroke', 'black')
//             .style('opacity', 0.75);
//         // .sort(function (a, b) {
//         //     return b.dy - a.dy;
//         // });

//         // add the link titles
//         // link.append('title').text(function (d) {
//         //     return (
//         //         d.source.month + ' → ' + d.target.month + '\n' + format(d.value)
//         //     );
//         // });

//         // add in the nodes
//         var node = contentGroup
//             .append('g')
//             .selectAll('.node')
//             .data(this.nodes)
//             .enter()
//             .append('g')
//             .attr('class', 'node')
//             .attr('transform', function (d) {
//                 return 'translate(' + d.x0 + ',' + d.y0 + ')';
//             });
//         console.log(this.nodes);
//         // add the rectangles for the nodes
//         node.append('rect')
//             .attr('height', function (d) {
//                 return d.y1 - d.y0;
//             })
//             .attr('width', function (d) {
//                 return d.x1 - d.x0;
//             })
//             .style('fill', (element) => {
//                 console.log(this.nodes);
//                 if (element.program === 'NSLP') {
//                     return '#0B2949';
//                 }
//                 if (element.program === 'SBP') {
//                     return '#D02B27';
//                 }
//                 if (element.program === 'SSO') {
//                     return '#5B6771';
//                 }
//                 if (element.program === 'SFSP') {
//                     return '#F1B51C';
//                 } else {
//                     return 'black';
//                 }
//             });
//         // .style('fill', function (d) {
//         //     return (d.color = color(d.month.replace(/ .*/, '')));
//         // })
//         // .style('stroke', function (d) {
//         //     return d3.rgb(d.color).darker(2);
//         // })
//         // .append('title')
//         // .text(function (d) {
//         //     return d.month + '\n' + format(d.value);
//         // });

//         // add in the title for the nodes
//         // node.append('text')
//         //     .attr('class', 'chart-axis-labels')
//         //     .text(function (d) {
//         //         console.log(d);
//         //         return d.name;
//         //     })
//         //     .attr('x', (d) =>
//         //         d.x0 < this.innerWidth() / 2 ? d.x1 + 6 : d.x0 - 6
//         //     )
//         //     .attr('y', function (d) {
//         //         return (d.y1 + d.y0) / 2;
//         //     })
//         //     .attr('dy', '.35em')
//         //     .attr('text-anchor', (d) =>
//         //         d.x0 < this.innerWidth() / 2 ? 'start' : 'end'
//         //     );
//         // .attr('transform', null)

//         // .filter(function (d) {
//         //     return d.x < this.innerWidth() / 2;
//         // })
//         // .attr('x', 6 + sankey.nodeWidth())
//         // .attr('text-anchor', 'start');
//         d3.selectAll('#sankeyAxis')
//             .selectAll('text')
//             .attr('text-anchor', 'start')
//             .attr('dx', 5);
//         d3.selectAll('#sankeyAxis').selectAll('.tick line').attr('stroke', '#5B6771').attr('y1', 15);
//     }
//     sankeyLinkPath(link) {
//         // this is a drop in replacement for d3.sankeyLinkHorizontal()
//         // well, without the accessors/options
//         const sx = link.source.x1;
//         const tx = link.target.x0 + 1;
//         const sy0 = link.y0 - link.width / 2;
//         const sy1 = link.y0 + link.width / 2;
//         const ty0 = link.y1 - link.width / 2;
//         const ty1 = link.y1 + link.width / 2;

//         const halfx = (tx - sx) / 2;

//         const path = d3.path();
//         path.moveTo(sx, sy0);

//         let cpx1 = sx + halfx;
//         let cpy1 = sy0;
//         let cpx2 = sx + halfx;
//         let cpy2 = ty0;
//         path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tx, ty0);
//         path.lineTo(tx, ty1);

//         cpx1 = sx + halfx;
//         cpy1 = ty1;
//         cpx2 = sx + halfx;
//         cpy2 = sy1;
//         path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, sx, sy1);
//         path.lineTo(sx, sy0);
//         return path.toString();
//     }
//     sankeyFill(element) {
//         if (element.program === 'NSLP') {
//             return '#0B2949';
//         }
//         if (element.program === 'SBP') {
//             return '#D02B27';
//         }
//         if (element.program === 'SSO') {
//             return '#5B6771';
//         }
//         if (element.program === 'SFSP') {
//             return '#F1B51C';
//         } else {
//             return '#17A673';
//         }
//     }
//     private innerWidth(): number {
//         return (
//             this.chartContainer?.nativeElement.clientWidth -
//             this.margin.left -
//             this.margin.right
//         );
//     }

//     private innerHeight(): number {
//         return (
//             this.chartContainer?.nativeElement.clientHeight -
//             this.margin.top -
//             this.margin.bottom
//         );
//     }
// }
