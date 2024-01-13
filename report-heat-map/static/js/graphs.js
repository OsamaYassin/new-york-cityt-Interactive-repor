makeGraphs();

function makeGraphs(error, recordsJson) {

	function print_filter(filter) {
		var f = eval(filter);
		if (typeof (f.length) != "undefined") { } else { }
		if (typeof (f.top) != "undefined") { f = f.top(Infinity); } else { }
		if (typeof (f.dimension) != "undefined") { f = f.dimension(function (d) { return ""; }).top(Infinity); } else { }
		console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
	}

	var dd = [
		{timestamp:"2011-11-14T16:17:54Z","Longitude":120.23,"Latitude":35.97,"phone_brand_en":"Samsung","gender":"M","age_segment":"33-38","location":"Shandong"},
		{timestamp:"2011-11-14T16:17:54Z","Longitude":115.21,"Latitude":40.37,"phone_brand_en":"Huawei","gender":"M","age_segment":"29-32","location":"Hebei"},
		{timestamp:"2011-11-14T16:17:54Z","Longitude":113.67,"Latitude":34.79,"phone_brand_en":"vivo","gender":"M","age_segment":"29-32","location":"Henan"},
		{timestamp:"2011-11-14T16:17:54Z","Longitude":119.92,"Latitude":31.67,"phone_brand_en":"Huawei","gender":"M","age_segment":"39+","location":"Jiangsu"},
		{timestamp:"2011-11-14T16:17:54Z","Longitude":113.45,"Latitude":23.1,"phone_brand_en":"Samsung","gender":"F","age_segment":"23-26","location":"Guangdong"},
		{timestamp:"2011-11-14T16:17:54Z","Longitude":104.06,"Latitude":30.66,"phone_brand_en":"vivo","gender":"F","age_segment":"23-26","location":"Sichuan"},
	];

	//Clean data
	//var records = dd;
	var records = alldata;
	//var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

	records.forEach(function(d) {
		//d["timestamp"] = dateFormat.parse(d["timestamp"]);
		//d["timestamp"].setMinutes(0);
		//d["timestamp"].setSeconds(0);
		d.Longitude = +d.Longitude ;
		d.Latitude  = +d.Latitude ;
		d.COCA = +d.COCA;
		d.COCA_NOS = +d.COCA_NOS;
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(records);
	//console.log(ndx);
	//print_filter(ndx);
	console.log("------------------------");

	//Define Dimensions
//	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
//	var genderDim = ndx.dimension(function(d) { return d["gender"]; });
	//var ageSegmentDim = ndx.dimension(function(d) { return d["age_segment"]; });
	//var phoneBrandDim = ndx.dimension(function(d) { return d["phone_brand_en"]; });
	//var locationdDim = ndx.dimension(function(d) { return d["location"]; });

	// start my work data


	var COCADimension = ndx.dimension(function (d) { return d.area; });
	var groupDimentionCoca = COCADimension.group().reduceSum(function (d) { return d.COCA; })

	var COCANoSugerDimension = ndx.dimension(function (d) { return d.area; });
	var groupDimentionCocaNoSuger = COCANoSugerDimension.group().reduceSum(function (d) { return d.COCA_NOS; })


	var SPRITEDimension = ndx.dimension(function (d) { return d.area; });
	var groupDimentionSPRITE = SPRITEDimension.group().reduceSum(function (d) { return d.SPRITE; })



//*************************************************************************** */
	var productDimension = ndx.dimension(function (d) {  return  [d.COCA , d.COCA_NOS]  ; });
	var groupDimentionProduct = productDimension.group(function (d) {  return   d.COCA   ; }) ; // .reduceCount();

	//console.log(groupDimentionProduct)
	//console.log('ndx.groupAll.reduceSum.value: '+ ndx.groupAll().reduceSum(function (d) { return d.COCA  ; }).value() )
	print_filter('groupDimentionProduct');

//**************************************************************************** */

	var AreaDimension = ndx.dimension(function (d) { return d.area; });
	var groupDimentionArea = AreaDimension.group().reduceCount();

	//print_filter(groupDimentionArea);

	//End
	var allDim = ndx.dimension(function(d) {return d;});


	//Group Data
	/*var numRecordsByDate = dateDim.group();
	var genderGroup = genderDim.group();
	var ageSegmentGroup = ageSegmentDim.group();
	var phoneBrandGroup = phoneBrandDim.group();
	var locationGroup = locationdDim.group();*/
	var all = ndx.groupAll();


    //Charts
	var numberRecordsND = dc.numberDisplay("#number-records-nd");

	var cocaChart = dc.rowChart("#coca-segment-row-chart");
	var belediye = dc.pieChart("#belediye-brand-row-chart");
	var cocaNoChart = dc.rowChart("#coca-No-segment-row-chart");
	var SPRITEChart = dc.rowChart("#SPRITE-segment-row-chart");
/*	var timeChart = dc.barChart("#time-chart");//
	var genderChart = dc.rowChart("#gender-row-chart");
	var ageSegmentChart = dc.rowChart("#coca-No-segment-row-chart");
	var phoneBrandChart = dc.rowChart("#phone-brand-row-chart");
	var locationChart = dc.rowChart("#location-row-chart");*/



	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

		cocaChart
		.width(350)
		.height(200)
        .dimension(COCADimension)
        .group(groupDimentionCoca)
		.elasticX(true)
            .colors(d3.scale.category10())
        .label(function (d) { return d.key + "  " + d.value; })
        .ordering(function (d) { return -d.value })
		.xAxis().tickFormat(function (v) { return v }).ticks(3);

		cocaNoChart
		.width(350)
		.height(200)
        .dimension(COCANoSugerDimension)
        .group(groupDimentionCocaNoSuger)
		.elasticX(true)
            .colors(d3.scale.category10())
        .label(function (d) { return d.key + "  " + d.value; })
        .ordering(function (d) { return -d.value })
		.xAxis().tickFormat(function (v) { return v }).ticks(3);

		SPRITEChart
		.width(350)
		.height(200)
        .dimension(SPRITEDimension)
		.group(groupDimentionSPRITE)
		//.colors(["#f17041", "#c841f1", "#41c2f1" , "#33f344"])
            .colors(d3.scale.category10())
		.elasticX(true)
        .label(function (d) { return d.key + "  " + d.value; })
        .ordering(function (d) { return -d.value })
        .xAxis().tickFormat(function (v) { return v }).ticks(3);


		belediye
        .dimension(AreaDimension)
        .group(groupDimentionArea)
        .width(200)
		.height(200)
            .colors(d3.scale.category10())
		//.colors(["#f17041", "#c841f1", "#41c2f1" , "#33f344"])
        //.label(function (d) { return Math.round((d.value / total) * 100, 0) + '%'; })
        .legend(dc.legend().x(120).y(5).itemHeight(12).gap(5))
        .renderLabel(true)
        .renderTitle(true)
        .ordering(function (p) {
          return -p.value;
        });

	/*timeChart
		.width(650)
		.height(140)
		.margins({top: 10, right: 50, bottom: 20, left: 20})
		.dimension(dateDim)
		.group(numRecordsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.yAxis().ticks(4);

	genderChart
        .width(300)
        .height(100)
        .dimension(genderDim)
        .group(genderGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

	ageSegmentChart
		.width(300)
		.height(150)
        .dimension(ageSegmentDim)
        .group(ageSegmentGroup)
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

	phoneBrandChart
		.width(300)
		.height(310)
        .dimension(phoneBrandDim)
        .group(phoneBrandGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    locationChart
    	.width(200)
		.height(510)
        .dimension(locationdDim)
        .group(locationGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);*/

    var map = L.map('map');

	var drawMap = function(){

	    map.setView([15.5968644,32.5222254], 9);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d.Latitude ,d.Longitude , 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20,
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();

	//Update the heatmap if any dc chart get filtered
	dcCharts = [ cocaChart  ,belediye];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			});
			drawMap();
		});
	});

	dc.renderAll();

};
