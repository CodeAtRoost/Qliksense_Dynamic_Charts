/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );
	$('.charttype').click(function(){
	fetchVisual($(this).attr("id"));
	
	
	})
	//open apps -- inserted here --
	var app = qlik.openApp('Consumer Sales.qvf', config);

	var qDimDef=  {"qDef": {"qFieldDefs": [], "qFieldLabels": []}};
	var qMeasureDef={"qDef": {"qDef": "", "qLabel": ""}};
	var qMasterDimDef={"qLibraryId":"","qType":"dimension"};
	var qMasterMeasureDef={"qLibraryId":"","qType":"measure"};
	var Options={};
	
	var Dims=[
	{field:"Product Sub Group Desc", label:"Product Sub Group"}//,
	//{qLibraryId:"96247c2b-e08d-48ae-813d-d30349928998", qType:"dimension"}
	];	
	var Measures = [
	{field:"Sum( [Sales Quantity]*[Sales Price])",label:"Revenue(formula)"},
	{qLibraryId:"Wwmauk",qType:"measure"}];
	
	
	var RequestDimAndMeasures=[];
	fetchVisual('table');
	function fetchVisual(charttype){
	 RequestDimAndMeasures=[];
	for (var i = 0;i<Dims.length;i++)
	{
		var newDimDef;
		if (Dims[i].qLibraryId==null)
		{
			newDimDef=qDimDef;
			newDimDef.qDef.qFieldDefs.push(Dims[i].field);
			newDimDef.qDef.qFieldLabels.push(Dims[i].label);		
			RequestDimAndMeasures.push(newDimDef);
		}
		else
		{
			newDimDef=qMasterDimDef;
			newDimDef.qLibraryId=Dims[i].qLibraryId;	
			RequestDimAndMeasures.push(newDimDef);		
		}
	}
	for (var i = 0;i<Measures.length;i++)
	{
		var newMeasureDef;
		
		if (Measures[i].qLibraryId==null)
		{
			newMeasureDef= qMeasureDef;
			newMeasureDef.qDef.qDef=Measures[i].field;
			newMeasureDef.qDef.qLabel=Measures[i].label;		
			RequestDimAndMeasures.push(newMeasureDef);
		}
		else
		{
			newMeasureDef=qMasterMeasureDef;
			newMeasureDef.qLibraryId=Measures[i].qLibraryId;
			RequestDimAndMeasures.push(newMeasureDef);			
		}
	}
	
	
	app.visualization.create(charttype,RequestDimAndMeasures, Options).then(function(viz){
	$('#QV01').empty();
	viz.show("QV01");
	qlik.resize();
	
	});
	}

	//callbacks -- inserted here --
	function q(reply, app){}

	

	
	
} );
