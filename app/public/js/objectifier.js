////////////////////////////////////////////////////////////////////////////////////////
// ASSET OBJECT
	function CreateAssetObject(asset, mapCollector) {
	  // generates a strings as id of the asset
	  this.id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
	  this.name = asset.name;
	  this.type = asset.type;
	  this.sector = asset.sector;
	  this.coordLat = mapCollector.coordinates.lat;
	  this.coordLng = mapCollector.coordinates.lng;
	  this.subSector = asset.subSector;
	  this.workingState = ""; // optimal / not optimal / Failed
	  this.dependents = [];
	  this.inputs = [];
    this.output = [];
    

	};



//////////////////////////////////////////////////////////////////////////////////////////
// MAP INSTANCE OBJECT
function MapProjectInstance(mapCollector) {
  // generates a strings as id of the asset
  this.id = (Date.now().toString(36) + Math.random().toString(36).substr(5, 9)).toLowerCase();
  // if a name is not set for the project improvise
  this.name = mapCollector.name || 'not_defined_'+ this.id
  this.location = mapCollector.places;
  // this.coord = mapCollector.geocode;

  this.assets = [] 
  this.markers = [];
  this.assetsWorkingState = { // optimal / Failed
  	optimal:[],
  	failed:[]
  }

  
  this.assetTotal = 0,
  this.scenario = {
         // "type":"Extreme Wind",
         // "time":"12:47",
         // "assetApplied":{
         //    "name":"local Antennae",
         //    "id":"HJKOLPRE"
         },
 this.resultVisualization = {
         // "displayType":"graph",
         // "valuesGenerrated":{}


      }
// create asset from scratch
this.createAsset = function(asset, mapCollector){
    var asset  = new CreateAssetObject(asset, mapCollector)
    asset.projectId = this.id;
    this.addAsset(asset)
    return asset;
}

// this function adds and asset to the newProject instance
 this.addAsset = function(asset) {
      var addMe  = {};
      addMe.id = asset.id;
      addMe.type = asset.type;
     

  		if(typeof asset.serviceProvided != 'undefined'){
  			asset.serviceProvided = ''
  		}

	  	if(this.assets.push(asset)){
          // increment asset total
  	  		this.assetTotal += 1;
          // if asset working state is not defined
  		  	if((typeof asset.workingState != 'undefined') || (asset.workingState != '') ){
  		       asset.workingState = 'failed';
             this.assetsWorkingState.failed.push(addMe);
          }else{
  	  		   this.assetsWorkingState.optimal.push(addMe);

  	  		} // end of if else

	  	}// end of asset working state 

  }// end of addAsset function 

// This function adds dependent to the asset
this.addAssetDependents =  function(dependentsObj){
  var id = dependentsObj.assetId;
  var dependentsArray = dependentsObj.dependency;
  var assetsArr = this.assets
  var indexVal =  returnItemIndex(assetsArr, id) // get index value of the asset
  var dependents = this.assets[indexVal].dependents // get dependents array of the asset
  
       // dependentsArray.forEach(function(item, index){
        for(i=0; i<dependentsArray.length;i++){
               if(!dependents.includes(dependentsArray[i])){// check if dependent already exists
                 this.assets[indexVal].dependents.push(dependentsArray[i])
               }else{
                  console.log("Nothing new to add as dependents")
               }

           }// }) // end of each function
    } // end of add dependents function


}  