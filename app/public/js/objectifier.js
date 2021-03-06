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
}//----------------- end of create asset object ----------------------------


//////////////////////////////////////////////////////////////////////////////////////////
// CREATE SCENARIO

function CreateScenario(scenarioData){
  this.scenarioId = "_"+ newProject.id
  this.type = scenarioData.type;
  this.impactNode = scenarioData.assetId
  this.totalAssets = newProject.assetTotal;
  // get assets working state from the project
  this.previousOptimalAssets = Array.from(newProject.assetsWorkingState.optimal)
  this.previousFailedAssets  = Array.from(newProject.assetsWorkingState.failed)
  // get affect asset list from scenario result
  this.currentOptimalAssets = '';
  this.currentFailedAssets ='';
  this.assetAffected ='';

  // calculate percentage of system damaged
  this.degreeOfImpact =  function(){
    var degreeOfImpact = 0; // set degree of impact to zero
    if(this.assetAffected && this.totalAssets){ // if affected is true
      degreeOfImpact  = ((this.assetAffected.length / this.totalAssets.length) * 100)
    } 
    return degreeOfImpact; // return the degree of impact
  };

//set the vaues for current workingstates
  this.currentWorkingState =  function(scenarioData, assetList){
    // get the assets affected
    var xAssets = scenarioData

    this.assetAffected = []; // empty array collect assets affected

    // var optis = this.previousOptimalAssets // get optimal assets
    console.log("List of asset affected by scenario "+ JSON.stringify(xAssets))
    // create current assets from previously  assets
    this.currentFailedAssets =  Array.from(this.previousFailedAssets) 
    this.currentOptimalAssets = Array.from(this.previousOptimalAssets) // an  array to add current optimal assets
 
    // if the affected assets were in optimal state add to failed & affected
   for(var i=0; i< xAssets.length; i++){

        var returnState = getWorkingState(assetList, xAssets[i].id)

        if( returnState == 'optimal'){
           // create an object extracted from the list
          var addX = {id: xAssets[i]['id'], name: xAssets[i]['name'], type: xAssets[i]['type'] }
          this.assetAffected.push(addX)// put them in assets affected
          this.currentFailedAssets.push(xAssets[i]) // add them current failed assets
          var indexVal = findIndexValue(this.currentOptimalAssets, 'id', xAssets[i]['id'])
          this.currentOptimalAssets.splice(indexVal,1)
        }else{
          console.log("No asset was affected ")
        }
     }
  
  }// ------------------------end of currentWorkingState

}//----------------------------- end of create scenario object

//////////////////////////////////////////////////////////////////////////////////////////
// MAP INSTANCE OBJECT
function MapProjectInstance(mapCollector) {
  // generates a strings as id of the asset
  this.id = (Date.now().toString(36) + Math.random().toString(36).substr(5, 9)).toLowerCase();
  // if a name is not set for the project improvise
  
  this.name =  mapCollector.name || ''; //name is not given
  this.places = mapCollector.places || "";
  this.location = mapCollector.location || ""; // assign latLong values to object
  this.saved = "" // if name is not entered project is not saved

  this.assets = [];
  this.markers = [];
  this.assetsWorkingState = { // optimal / Failed
  	optimal:[],
  	failed:[]
  }

  
  this.assetTotal = 0;
  this.scenario = {
         // "type":"Extreme Wind",
         // "time":"12:47",
         // "assetApplied":{
         //    "name":"local Antennae",
         //    "id":"HJKOLPRE"
         //   workingStateBefore: 4;
         //   workingStateAfter: 0
         //   ScenarioEffect: (NoOfFailedAsset/Totalasset) x 100%
  };//--------------------------------------------------------------------

 this.resultVisualization = {
         // "displayType":"graph",
         // "valuesGenerrated":{}
  };//------------------------------------------------------------------

// set name and set the saved instance of the project
this.setName = function(name){
  if (!this.name) {
    this.name =  name || 'not_defined_'+ this.id
  }else{
    this.name = name // save name of the project
    this.save  = true; // set the saved project instance
  }

}
// call the set name function
this.setName(mapCollector.name)
// create asset from scratch
this.createAsset = function(asset, mapCollector){
    var asset  = new CreateAssetObject(asset, mapCollector)
    asset.projectId = this.id;
    this.addAsset(asset)
    return asset;
}//------------------------------------------------------------create asset

// this function adds and asset to the newProject instance
 this.addAsset = function(asset) {
      // create object to add to asset working state
      var addMe  = {id: asset.id, type: asset.type};
      // check if serviceprovided ppt of asset have been defined
  		if(typeof asset.serviceProvided != 'undefined'){
  			asset.serviceProvided = ''
  		}

	  	if(this.assets.push(asset)){
          // increment asset total
  	  		this.assetTotal += 1;
          // if asset working is already optimal
  		  	// if(asset.workingState == 'optimal'){
       //       this.assetsWorkingState.optimal.push(addMe);
       //    // if already in failed state
       //    }else if(asset.workingState == 'failed'){
       //       this.assetsWorkingState.failed.push(addMe);
  	  		// }else{// alternatively if not defined it must be failed
            asset.workingState = 'optimal';
            this.assetsWorkingState.optimal.push(addMe);
          // } // end of else

	  	}// end of asset push asset into array

  }//----------------------------- end of addAsset function ---> 

// get id of asset create scenario on that asset
this.createScenario = function(assetId){


}//--------------------------------------------------------


// This function adds dependent to the asset
this.addAssetDependents =  function(arr){
  var id = arr.assetId; // asset id
  var dependentsList = arr.dependency; // get dependency array
  var assetList = this.assets // list of assets from the project
  var indexVal =  returnItemIndex(assetList, id) // get index value of the asset
  console.log("we might get far")
  this.addArrayToObject(dependentsList, indexVal, 'dependents') // add dependency to object
} 


this.addArrayToObject = function(listToAdd, index, wereToAdd){
  var assetList = this.assets // get asset project list
  if(!assetList[index][wereToAdd]){// if dependent/input is not defined
      assetList[index][wereToAdd] = [];// define dependent/input list
      dependencyChangeOfState(assetList[index], wereToAdd) // change state to failed if dependency is added
      assetList[index][wereToAdd]= listToAdd //load assets
      this.changeState(assetList[index]) // check if state need to be changed

  } else if(assetList[index][wereToAdd]){ // if dependents/input exist
     for(i=0; i<listToAdd.length;i++){
       //check if dependent already exists
       if(!assetList[index][wereToAdd].includes(listToAdd[i])){ //check if item is already in list
         assetList[index][wereToAdd].push(listToAdd[i])
       }
     }// change asset state
    this.changeState(assetList[index])
  }
  else{
      interact(assetList[index].name + ' Assets working state is '+ assetList[index].workingState, "progress")
  }   
  // } // end of each function
} //---------------------------------- end of add dependents function


    // // FUNCTION: ERROR : To change working state of asset
    this.changeState = function(asset){ 
      if(asset.dependents && asset.inputs){
        if(asset.dependents.length == asset.inputs.length){
          // first change asset working state
          asset.workingState = 'optimal';
          // create a new  object
          var assX = {id: asset.id, type:asset.type }
          // include asset in optimal list
          this.assetsWorkingState.optimal.push(assX)
          // get index of the asset from failed asset List
          var indexVal = findIndexValue(this.assetsWorkingState.failed, "id", asset.id)
          // remove asset from failed state and push into optimal state
          this.assetsWorkingState.failed.splice(indexVal,1)

      }else if(asset.dependents.length > asset.inputs.length){
           // first change asset working state
           asset.workingState = 'failed';
            // create a new  object
           var assX = {id: asset.id, type:asset.type }
            // include asset in failed list
           this.assetsWorkingState.failed.push(assX)
           // check if asset is in optimal asset List
           if(checkArray(this.assetsWorkingState.optimal, "id", asset.id)){
              // get asset index value
              var indexVal = findIndexValue(this.assetsWorkingState.optimal, "id", asset.id)
              this.assetsWorkingState.optimal.splice(indexVal,1)// remove asset from optimal
           }
      }
    }else{ 
       // first change asset working state
           asset.workingState = 'failed';
            // create a new  object
           var assX = {id: asset.id, type:asset.type }
            // include asset in failed list
           this.assetsWorkingState.failed.push(assX)
           // check if asset is in optimal asset List
           if(checkArray(this.assetsWorkingState.optimal, "id", asset.id)){
              // get asset index value
              var indexVal = findIndexValue(this.assetsWorkingState.optimal, "id", asset.id)
              this.assetsWorkingState.optimal.splice(indexVal,1)// remove asset from optimal
           }
    }
  }//---------------------------------------------------------------------------

    // /// FUNCTION:ERROR : To add input if they match dependents 
    this.addInput = function(arr){
      var id = arr.assetId; // asset id
      var inputList = arr.dependency; // get dependency array
      var assetList = this.assets 
      var indexVal =  returnItemIndex(assetList, id) // get index value of the asset
      this.addArrayToObject(inputList, indexVal, 'inputs') // add inputs to object
      // this.changeState(assetList[indexVal]) //change asset states
  };//-----------------------------------------------------------------------------


}//------------------------End of Create Project------------------------------------------------