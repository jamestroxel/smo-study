// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import * as d3 from 'd3';
// import { ProgramsByMonth } from '../Types';
// @Component({
//   selector: 'app-program-race',
//   templateUrl: './program-race.component.html',
//   styleUrls: ['./program-race.component.scss']
// })
// export class ProgramRaceComponent implements OnInit {
//   @ViewChild('chart', { static: true }) chartContainer: ElementRef;

//   private margin: {
//     top: number;
//     bottom: number;
//     left: number;
//     right: number;
//   } = { top: 10, right: 0, bottom: 30, left: 30 };

//   constructor(private http: HttpClient) { }

//   ngOnInit(): void {
//     this.http
//             .get(
//                 '../../assets/data/meal-service-race.csv',
//                 { responseType: 'text' }
//             )
//             .subscribe((data) => {
//                 const objs = d3.csvParse(data);

//                 this.drawChart(objs);
//             });
//   }
//   drawChart(data){
//     const svg = d3.select(this.chartContainer.nativeElement)
//     let duration = 250;
//     let n = 12;
//     let k = 10;
//     let programs = new Set(data.map(d => d.program))
//     let datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.month, d => d.program))
//     .map(([date, data]) => [new Date(date), data])
//     .sort(([a], [b]) => d3.ascending(a, b))
//     function rank(value) {
//       const data = Array.from(programs, program => ({program, value: value(program)}));
//       data.sort((a, b) => d3.descending(a.value, b.value));
//       for (let i = 0; i < data.length; ++i) data[i]['rank'] = Math.min(n, i);
//       return data;
//     }
//     const keyframes = function(){
//       const keyframes = [];
//       let ka, a, kb, b;
//       for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
//         for (let i = 0; i < k; ++i) {
//           const t = i / k;
//           keyframes.push([
//             new Date(ka * (1 - t) + kb * t),
//             rank(program => (a.get(program) || 0) * (1 - t) + (b.get(program) || 0) * t)
//           ]);
//         }
//       }
//       keyframes.push([new Date(kb), rank(program => b.get(program) || 0)]);
//       return keyframes;
//     }
//     console.log(keyframes())
//     // let nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.program)

//   }

//   private innerWidth(): number {
//       return (
//           this.chartContainer?.nativeElement.clientWidth -
//           this.margin.left -
//           this.margin.right
//       );
//   }

//   private innerHeight(): number {
//       return (
//           this.chartContainer?.nativeElement.clientHeight -
//           this.margin.top -
//           this.margin.bottom
//       );

//   }
// }
