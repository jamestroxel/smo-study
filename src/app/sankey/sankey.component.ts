import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import {
    sankey,
    sankeyLeft,
    sankeyLinkHorizontal,
    sankeyRight,
} from 'd3-sankey';
// import sankeyTest from '../../assets/data/sankeyTest.json';
import sankeyTest from '../../assets/data/sankeyTest-smo.json';

@Component({
    selector: 'app-sankey',
    templateUrl: './sankey.component.html',
    styleUrls: ['./sankey.component.scss'],
})
export class SankeyComponent implements OnInit {
    public marginTop = 25;
    public marginBottom = 25;
    public marginLeft = 25;
    public marginRight = 25;
    public width = 400 - this.marginLeft - this.marginRight;
    public height = 400 - this.marginTop - this.marginBottom;
    public data = sankeyTest;
    public sankeyLinkHorizontal = sankeyLinkHorizontal;
    public sankeyLeft = sankeyLeft;
    public sankey = sankey;
    public axis = d3
        .scaleTime()
        .domain([new Date('2020-01-01'), new Date('2020-5-01')])
        .range([0, this.width]);
    constructor() {}

    get sankeyData() {
        if (this.data === null) {
            return null;
        }
        const sankeyGenerator = sankey()
            .nodeSort((a, b) => b.value - a.value)
            .linkSort(null)
            .nodeAlign(sankeyRight)
            .nodeWidth(5)
            .nodePadding(10)
            .extent([
                [0, 5],
                [
                    this.width,
                    this.height - (this.marginTop + this.marginBottom),
                ],
            ]);

        return (({ nodes, links }) =>
            sankeyGenerator({
                nodes: nodes.map((d) => Object.assign({}, d)),
                links: links.map((d) => Object.assign({}, d)),
            }))(this.data);
    }
    get nodes() {
        if (this.sankeyData) {
            return this.sankeyData.nodes;
        } else {
            return null;
        }
    }
    get links() {
        if (this.sankeyData) {
            return this.sankeyData.links;
        } else {
            return null;
        }
    }

    ngOnInit(): void {
        this.sankeyNodes();
        this.drawAxis(this.axis);
    }

    xLabel(d) {
        return d.x0 < this.width / 2 ? d.x1 + 6 : d.x0 - 6;
    }
    yLabel(d) {
        return (d.y1 + d.y0) / 2;
    }
    labelAnchor(d) {
        return d.x0 < this.width / 2 ? 'start' : 'end';
    }

    sankeyNodes() {
        const svg = d3.select('#sankey');
        svg.selectAll('rect').data(this.sankeyData.nodes).attr('fill', 'black');
    }
    drawAxis(axisRef) {
        d3.select('#sankeyAxis')
            .attr('class', 'chart-axis-labels')
            .attr(
                'transform',
                'translate(0' + ',' + (this.height - this.marginTop) + ')'
            )
            .call(
                d3
                    .axisBottom(axisRef)
                    .ticks(d3.timeMonth)
                    .tickSize(-this.height)
                    .tickFormat(d3.timeFormat('%B'))
            )
            .attr('x1', '100%');
        d3.selectAll('.tick line').attr('stroke-width', 0.5);
        //.attr('stroke', '#5B6771');
        d3.select('.domain').remove();
    }

    sankeyLinkPath(link) {
        // this is a drop in replacement for d3.sankeyLinkHorizontal()
        // well, without the accessors/options
        const sx = link.source.x1;
        const tx = link.target.x0 + 1;
        const sy0 = link.y0 - link.width / 2;
        const sy1 = link.y0 + link.width / 2;
        const ty0 = link.y1 - link.width / 2;
        const ty1 = link.y1 + link.width / 2;

        const halfx = (tx - sx) / 2;

        const path = d3.path();
        path.moveTo(sx, sy0);

        let cpx1 = sx + halfx;
        let cpy1 = sy0;
        let cpx2 = sx + halfx;
        let cpy2 = ty0;
        path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, tx, ty0);
        path.lineTo(tx, ty1);

        cpx1 = sx + halfx;
        cpy1 = ty1;
        cpx2 = sx + halfx;
        cpy2 = sy1;
        path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, sx, sy1);
        path.lineTo(sx, sy0);
        return path.toString();
    }
    sankeyFill(element) {
        if (element.name === 'NSLP') {
            return '#0B2949';
        }
        if (element.name === 'SBP') {
            return '#D02B27';
        }
        if (element.name === 'SSO') {
            return '#5B6771';
        }
        if (element.name === 'SFSP') {
            return '#F1B51C';
        } else {
            return '#17A673';
        }
    }
    // csvSankey() {
    //   const sankeydata = {"nodes" : [], "links" : []};

    //   this.data.forEach(function (d) {
    //     sankeydata.nodes.push({ "name": d.source });
    //     sankeydata.nodes.push({ "name": d.target });
    //     sankeydata.links.push({ "source": d.source,
    //                       "target": d.target,
    //                       "value": +d.value });
    //   });

    //     // return only the distinct / unique nodes
    //   sankeydata.nodes = Array.from(
    //       d3.group(sankeydata.nodes, d => d.name),
    //     ([value]) => (value)
    //     );

    //     // loop through each link replacing the text with its index from node
    //     sankeydata.links.forEach(function (d, i) {
    //       sankeydata.links[i].source = sankeydata.nodes
    //         .indexOf(sankeydata.links[i].source);
    //       sankeydata.links[i].target = sankeydata.nodes
    //         .indexOf(sankeydata.links[i].target);
    //     });

    //     // now loop through each nodes to make nodes an array of objects
    //     // rather than an array of strings
    //     sankeydata.nodes.forEach(function (d, i) {
    //       sankeydata.nodes[i] = { "name": d };
    //     });

    //     graph = sankey(sankeydata);

    // }
}
