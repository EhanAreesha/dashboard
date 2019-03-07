import { Component, ElementRef, ViewChild} from '@angular/core';
import * as D3 from "d3";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { $$ } from 'protractor';
declare var $: any;

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    
    @ViewChild('courseContainer') courseContainer: ElementRef;
    idata: IData;
    colors = D3.scaleOrdinal(D3.schemeCategory10);

    constructor(private http: HttpClient,private router: Router, private _dashboardService: DashboardService) {
    }

    ngAfterViewInit() {
        this.idata = {bycourseData: [], bytrackData: [], bycourseRatingsData: [], bytrackRatingsData: [], bycourseSubscribedData: [], 
            bytrackSubscribedData: [], tempcsData: [], temptsData: [],
            tempttcData: [], temptttData: [], tempatcData: [], tempattData: []}
        this._dashboardService.getCourseCompletionDataByCourse().subscribe((data: CourseCompletionData[]) => {
            this.idata.bycourseData = data;
            this.setupCourse();
            this.buildSVGForCourse();
            this.buildPieForCourse();
        });
        this._dashboardService.getCourseCompletionDataByTrack().subscribe((data: CourseCompletionData[]) => {
            this.idata.bytrackData = data;
            this.setupTrack();
            this.buildSVGForTrack();
            this.buildPieForTrack();
        });
        this._dashboardService.getCandidateRatingsByCourse().subscribe((data: CandidateRatingsData[]) => {
            this.idata.bycourseRatingsData = data;
            this.setupCR();
            this.buildSVGForCR();
            this.buildPieForCR();
        });
        this._dashboardService.getCandidateRatingsByTrack().subscribe((data: CandidateRatingsData[]) => {
            this.idata.bytrackRatingsData = data;
            this.setupTR();
            this.buildSVGForTR();
            this.buildPieForTR();
        });
        this._dashboardService.getMostSubscribedByCourse().subscribe((data: MostSubscribedData[]) => {
            this.idata.bycourseSubscribedData = data;
            this.buildBarForMS();
        });
        this._dashboardService.getMostSubscribedByTrack().subscribe((data: MostSubscribedData[]) => {
            this.idata.bytrackSubscribedData = data;
            this.buildBarForMT();
        });
        this._dashboardService.getCandidateSatisficationDataByCourse().subscribe((data: CourseSatisficationData[]) => {
            data.forEach(element => {
                this.idata.tempcsData.push({"label": element.title, "value": element.avgScore})
            });
            this.buildHBarForCS();
        });
        this._dashboardService.getCandidateSatisficationDataByTrack().subscribe((data: CourseSatisficationData[]) => {
            data.forEach(element => {
                this.idata.temptsData.push({"label": element.title, "value": element.avgScore})
            });
            this.buildHBarForTS();
        });
        this._dashboardService.getTimeByCourse().subscribe((data: TimeTakenData[]) => {
            data.forEach(element => {
                element.candidates.forEach(obj => {
                    this.idata.tempttcData.push({"label": obj.candidateName, "value": obj.completionTime})
                });
            });
            this.buildBarForTTByCourse();
        });
        this._dashboardService.getTimeByTrack().subscribe((data: TimeTakenData[]) => {
            data.forEach(element => {
                element.candidates.forEach(obj => {
                    this.idata.temptttData.push({"label": obj.candidateName, "value": obj.completionTime})
                });
            });
            this.buildBarForTTByTrack();
        });
        this._dashboardService.getAggregatedTimeByCourse().subscribe((data: AggregatedTimeData[]) => {
            data.forEach(element => {
                element.courses.forEach(obj => {
                    this.idata.tempatcData.push({"label": obj.courseName, "value": obj.aggregatedTime})
                });
            });
            this.buildBarForATByCourse();
        });
        this._dashboardService.getAggregatedTimeByTrack().subscribe((data: AggregatedTimeData[]) => {
            data.forEach(element => {
                element.courses.forEach(obj => {
                    this.idata.tempattData.push({"label": obj.courseName, "value": obj.aggregatedTime})
                });
            });
            this.buildBarForATByTrack();
        });
    }

    // Course completion Data visualization by course
    private setupCourse(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        this.idata.cwidth = rect.width;
        this.idata.cheight = rect.height;
        this.idata.cradius = Math.min(this.idata.cwidth, this.idata.cheight) / 2;
    }

    private buildSVGForCourse(): void {
        this.idata.csvg = D3.select('#courseContainer')
        .append("svg")
        .append("g")
        .attr("transform", `translate(${this.idata.cwidth / 2},${this.idata.cheight / 2})`);
    }

    private buildPieForCourse(): void {
        let pie = D3.pie();
        let values = this.idata.bycourseData.map(data => data.value);
        let arcSelection = this.idata.csvg.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");
        this.populateCoursePie(arcSelection);
    }

    private populateCoursePie(arcSelection: any): void {
        let pieColor = this.colors;
        let arc = D3.arc()
            .outerRadius(this.idata.cradius - 10)
            .innerRadius(0);
        let label = D3.arc()
            .outerRadius(this.idata.cradius)
            .innerRadius(this.idata.cradius - 80);
        arcSelection.append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => {
                return pieColor(`${index}`);
            });
        arcSelection.append("text")
            .attr("transform", (datum: any) => {
                var _d = arc.centroid(datum);
                _d[0] *= 2.2;	
                _d[1] *= 2.2;	
                return "translate(" + _d + ")";
            })
            .attr("dy", ".30em")
            .text((datum, index) => this.idata.bycourseData[index].label+"\n"+ this.idata.bycourseData[index].value)
            .style("text-anchor", "middle");
    }

    // Course completion Data visualization by track
    private setupTrack(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        this.idata.twidth = rect.width;
        this.idata.theight = rect.height;
        this.idata.tradius = Math.min(this.idata.twidth, this.idata.theight) / 2;
    }

    private buildSVGForTrack(): void {
        this.idata.tsvg = D3.select('#trackContainer')
        .append("svg")
        .append("g")
        .attr("transform", `translate(${this.idata.twidth / 2},${this.idata.theight / 2})`);
    }

    private buildPieForTrack(): void {
        let pie = D3.pie();
        let values = this.idata.bytrackData.map(data => data.value);
        let arcSelection = this.idata.tsvg.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");
        this.populateTrackPie(arcSelection);
    }

    private populateTrackPie(arcSelection: any): void {
        let pieColor = this.colors;
        let arc = D3.arc()
            .outerRadius(this.idata.tradius - 10)
            .innerRadius(0);
        let label = D3.arc()
            .outerRadius(this.idata.tradius)
            .innerRadius(this.idata.tradius - 80);
        arcSelection.append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => {
                return pieColor(`${index}`);
            });
        arcSelection.append("text")
            .attr("transform", (datum: any) => {
                var _d = arc.centroid(datum);
                _d[0] *= 2.2;	
                _d[1] *= 2.2;	
                return "translate(" + _d + ")";
            })
            .attr("dy", ".30em")
            .text((datum, index) => this.idata.bytrackData[index].label+"\n"+ this.idata.bytrackData[index].value)
            .style("text-anchor", "middle");
    }
  
    // Candidate Ratings Data visualization by course
    private setupCR(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        this.idata.crwidth = rect.width;
        this.idata.crheight = rect.height;
        this.idata.crradius = Math.min(this.idata.crwidth, this.idata.crheight) / 2;
    }

    private buildSVGForCR(): void {
        this.idata.crsvg = D3.select('#crContainer')
        .append("svg")
        .append("g")
        .attr("transform", `translate(${this.idata.crwidth / 2},${this.idata.crheight / 2})`);
    }

    private buildPieForCR(): void {
        let pie = D3.pie();
        let values = this.idata.bycourseRatingsData.map(data => data.value);
        let arcSelection = this.idata.crsvg.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");
        this.populateCRPie(arcSelection);
    }

    private populateCRPie(arcSelection: any): void {
        let pieColor = this.colors;
        let arc = D3.arc()
            .outerRadius(this.idata.crradius - 10)
            .innerRadius(0);
        let label = D3.arc()
            .outerRadius(this.idata.crradius)
            .innerRadius(this.idata.crradius - 80);
        arcSelection.append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => {
                return pieColor(`${index}`);
            });
        arcSelection.append("text")
            .attr("transform", (datum: any) => {
                var _d = arc.centroid(datum);
                _d[0] *= 2.2;	
                _d[1] *= 2.2;	
                return "translate(" + _d + ")";
            })
            .attr("dy", ".30em")
            .text((datum, index) => this.idata.bycourseRatingsData[index].label+"\n"+ this.idata.bycourseRatingsData[index].value)
            .style("text-anchor", "middle");
    }

    // Candidate Ratings Data visualization by track
    private setupTR(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        this.idata.trwidth = rect.width;
        this.idata.trheight = rect.height;
        this.idata.trradius = Math.min(this.idata.trwidth, this.idata.trheight) / 2;
    }

    private buildSVGForTR(): void {
        this.idata.trsvg = D3.select('#trContainer')
        .append("svg")
        .append("g")
        .attr("transform", `translate(${this.idata.trwidth / 2},${this.idata.trheight / 2})`);
    }

    private buildPieForTR(): void {
        let pie = D3.pie();
        let values = this.idata.bytrackRatingsData.map(data => data.value);
        let arcSelection = this.idata.trsvg.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");
        this.populateTRPie(arcSelection);
    }

    private populateTRPie(arcSelection: any): void {
        let pieColor = this.colors;
        let arc = D3.arc()
            .outerRadius(this.idata.trradius - 10)
            .innerRadius(0);
        let label = D3.arc()
            .outerRadius(this.idata.trradius)
            .innerRadius(this.idata.trradius - 80);
        arcSelection.append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => {
                return pieColor(`${index}`);
            });
        arcSelection.append("text")
            .attr("transform", (datum: any) => {
                var _d = arc.centroid(datum);
                _d[0] *= 2.2;	
                _d[1] *= 2.2;	
                return "translate(" + _d + ")";
            })
            .attr("dy", ".30em")
            .text((datum, index) => this.idata.bytrackRatingsData[index].label+"\n"+ this.idata.bytrackRatingsData[index].value)
            .style("text-anchor", "middle");
    }

    // Most Subscribed Data visualization of Courses
    private buildBarForMS(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#msContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Most Subscribed")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.bycourseSubscribedData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.bycourseSubscribedData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Courses");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Most Subscribed");
         g.selectAll(".bar")
         .data(this.idata.bycourseSubscribedData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }

    // Most Subscribed Data visualization of Track
    private buildBarForMT(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#mtContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Most Subscribed")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.bytrackSubscribedData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.bytrackSubscribedData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Tracks");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Most Subscribed");
         g.selectAll(".bar")
         .data(this.idata.bytrackSubscribedData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }

    // Candidate Satisfication Data visualization of Course
    private buildHBarForCS(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 300
        };
        var width = rect.width - margin.left - margin.right;
        var height = rect.height - margin.top - margin.bottom;
        var svg = D3.select('#csContainer')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var x = D3.scaleLinear()
            .range([0, width])
            .domain([0, D3.max(this.idata.tempcsData, function (d) {
                return d.value;
            })]);
        var y = D3.scaleBand()
            .rangeRound([height, 0])
            .domain(this.idata.tempcsData.map(function (d) {
                return d.label;
            }));
        var yAxis = D3.axisLeft(y)
            .tickSize(0);
        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        var bars = svg.selectAll(".bar")
            .data(this.idata.tempcsData)
            .enter()
            .append("g")
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.label);
            })
            .attr("height", y.bandwidth()-20)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });
        bars.append("text")
            .attr("class", "label")
            .attr("y", function (d) {
                return y(d.label) + y.bandwidth()-20/ 2;
            })
            .attr("x", function (d) {
                return x(d.value) + 5;
            })
            .text(function (d) {
                return d.value;
            });

    }

    // Candidate Satisfication Data visualization of Track
    private buildHBarForTS(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 300
        };
        var width = rect.width - margin.left - margin.right;
        var height = rect.height - margin.top - margin.bottom;

        var svg = D3.select('#tsContainer')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = D3.scaleLinear()
            .range([0, width])
            .domain([0, D3.max(this.idata.temptsData, function (d) {
                return d.value;
            })]);
        var y = D3.scaleBand()
            .rangeRound([height, 0])
            .domain(this.idata.temptsData.map(function (d) {
                return d.label;
            }));
        var yAxis = D3.axisLeft(y)
            .tickSize(0);
        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        var bars = svg.selectAll(".bar")
            .data(this.idata.temptsData)
            .enter()
            .append("g")
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.label);
            })
            .attr("height", y.bandwidth()-20)
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });
        bars.append("text")
            .attr("class", "label")
            .attr("y", function (d) {
                return y(d.label) + y.bandwidth()-20/ 2 + 4;
            })
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });

    }

    // Time Taken Data visualization for Course by candidates
    private buildBarForTTByCourse(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#ttcContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Time Taken for each Course")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.tempttcData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.tempttcData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Candidates");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Completion Time");
         g.selectAll(".bar")
         .data(this.idata.tempttcData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }

    // Time Taken Data visualization for each Track by candidates
    private buildBarForTTByTrack(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#tttContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Time Taken for each Track")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.temptttData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.temptttData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Candidates");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Completion Time");
         g.selectAll(".bar")
         .data(this.idata.temptttData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }

    // Aggregated Time Data visualization by each Course
    private buildBarForATByCourse(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#atcContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Aggregated Time by each Course")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.tempatcData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.tempatcData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Courses");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Aggregated Time");
         g.selectAll(".bar")
         .data(this.idata.tempatcData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }

    // Time Taken Data visualization by Track
    private buildBarForATByTrack(): void {
        const rect = this.courseContainer.nativeElement.getBoundingClientRect();
        var margin = 200;
        var width = rect.width - margin;
        var height = rect.height - margin;
        var svg = D3.select('#attContainer')
        .append("svg");
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 25)
       .attr("y", 25)
       .attr("font-size", "18px")
       .text("Aggregated Time for each Track")
       var xScale = D3.scaleBand().range([0, width]).padding(0.4),
       yScale = D3.scaleLinear().range([height, 0]);
        var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
        xScale.domain(this.idata.tempattData.map(function(d) { return d.label; }));
        yScale.domain([0, D3.max(this.idata.tempattData, function(d) { return d.value; })]);
        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(D3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 150)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Courses");
         g.append("g")
         .call(D3.axisLeft(yScale).tickFormat(function(d){
             return "" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 5)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "green")
         .text("Aggregated Time");
         g.selectAll(".bar")
         .data(this.idata.tempattData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.label); })
         .attr("y", function(d) { return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { 
             return height - yScale(d.value); 
            });
    }
}