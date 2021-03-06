////////////////////////////////////////////////////////////////////////////////////
// Importing various modules
/////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1; 
var cypher = require('./cyphermod.js');
var jsonWriter = require('./jsonWriter.js');
// var http = require('http');
// var rp = require('request-promise');
// var got = require('got');

/////////////////////////////////////////////////////////////////////////////////////
// Setting up body parser to receive text and url-encoded format
//////////////////////////////////////////////////////////////////////////////////////
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


//////////////////////////////////////////////////////////////////////////////////////
// Posting data and feeding response into our form
///////////////////////////////////////////////////////////////////////////////////////
router.post('/getasset', function (req, res, next){
    var assetId = JSON.stringify(req.body.assetId);
    console.log("before matchedResult, this is assetId "+ assetId)

    // send the assetID and the response paramter as argument to cypher
    cypher.getAssetDetails(assetId, res);

});

//////////////////////////////////////////////////////////////////////////////
// Update asset details
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/update', function (req, res, next){
    var asset = req.body;
    console.log("@getasset:update assetId is :"+ asset.id)

    // send the assetID and the response paramter as argument to cypher
    cypher.updateAsset(asset);
    jsonWriter.updateAsset(asset);
});



//////////////////////////////////////////////////////////////////////////////
// Update project details
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/ProjectUpdate', function (req, res, next){
    var project = req.body;
     // send the assetID and the response paramter as argument to cypher
   jsonWriter.updateProject(project);
 });

//////////////////////////////////////////////////////////////////////////////
// delete asset completely
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/delete', function (req, res, next){
      var assetId = req.body.assetId;
      var projectId  = req.body.projectId;
          console.log("@getasset: delete fx assetId = "+ assetId)
          console.log("@getasset: delete fx projectId = "+ projectId)

    // send the assetID and the response paramter as argument to cypher
    // jsonWriter.deleteAsset(assetId, projectId)
    cypher.deleteAsset(assetId);
    jsonWriter.deleteAsset(assetId, projectId)
});



//////////////////////////////////////////////////////////////////////////////
// Create asset dependency
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/createDependency', function (req, res, next){
    var request = req.body;
    console.log("We are about to update this request body "+ req.body)

    // send the assetID and the response paramter as argument to cypher
    cypher.createDependency(request);
    jsonWriter.createDependency(request)
});

//////////////////////////////////////////////////////////////////////////////
// Create asset dependency
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/addInputs', function (req, res, next){
    var request = req.body;
    console.log("We are about to update this request body "+ req.body)
    // send the assetID and the response paramter as argument to cypher
    //cypher.addInputs(request);
    jsonWriter.addInputs(request)
});

//////////////////////////////////////////////////////////////////////////////
// Create asset visualization
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/createVisualization', function (req, res, next){
    var assetId = JSON.stringify(req.body.assetDeps);
    console.log("We are about to update this assetId "+ assetId)

    var assetId = assetDeps.asset.assetId
    var dependentsArray = assetDeps.dependents
    // send the assetID and the response paramter as argument to cypher
    cypher.createDependency(assetId, dependentsArra);
});


//////////////////////////////////////////////////////////////////////////////
// Create asset scenario
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/createScenario', function (req, res, next){
    var request = req.body;
    console.log("We are about to update this assetId "+ request)

    // create scenario objects
    cypher.createScenario(request, res);
});



//////////////////////////////////////////////////////////////////////////////
// Create graph from json project file
/////////////////////////////////////////////////////////////////////////////
router.post('/getasset/makeCypher', function (req, res, next){
    var request = req.body;
    // console.log("We are about to update this assetId "+ request)

    // create scenario objects
    cypher.createJson(request, res);
});

module.exports = router;