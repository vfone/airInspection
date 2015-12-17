'use strict';

/**
 * @ngdoc overview
 * @name airInspectionApp
 * @description
 * # airInspectionApp
 *
 * Main module of the application.
 */


var app = angular
  .module('airInspectionApp', [
    'ngAnimate',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/working', {
        templateUrl: 'views/workingboard.html',
        controller: 'WorkingCtrl'
      })
      .when('/summary/from/:origin?/rptid/:reportID?', {
        templateUrl: 'views/summaryboard.html',
        controller: 'SummaryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


//Add this to have access to a global variable
app.run(function ($rootScope) {
    $rootScope.global_surveyor = '';
    $rootScope.global_regno = '';
    $rootScope.global_port = '';
    $rootScope.global_surveyorId = '';
    $rootScope.global_aircraftId = '';
    $rootScope.global_aircraftTypeId = '';
    $rootScope.global_portId = '';
    $rootScope.global_ItemTypeId = '';
    $rootScope.global_ReportID = "report_"+randomString(6,"*");
    $rootScope.global_PendingID = '';
});

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('*') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~!@#$%^&*()_+-={}[]:;<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}

//var lookupURL = "http://cms.365cloudservices.com/api/offline/lookup";
var lookupURL = "http://cmsapi.cocodemo.com/api/lookups";
var localJsonVersion = getLocalStorage("JsonVersion"); //local time stamp
var authURL = "http://cmsapi.cocodemo.com/token";
var postURL = "http://cmsapi.cocodemo.com/api/surveys";
var passcode = "7678";
var authcode = "1234567890";


//function check local storage
if(getLocalStorage("JsonVersion") == null){
    //no lookup data locally,write to local
    writeLookUpToLocal(lookupURL);
}
else{
    //compare json version
    compareJsonVersion(lookupURL);
}
function writeLookUpToLocal(url){

    $.getJSON(url, function(data) {
        //split lookup to smaller section
        //console.log(url);
        //console.log(data);
        setLocalStorage('Surveyors', JSON.stringify(data.Surveyors));
        setLocalStorage('AircraftTypes', JSON.stringify(data.AircraftTypes));
        setLocalStorage('Aircrafts', JSON.stringify(data.Aircrafts));
        setLocalStorage('Locations', JSON.stringify(data.Locations));
        setLocalStorage('Zones', JSON.stringify(data.Zones));
        setLocalStorage('Categories', JSON.stringify(data.Categories));
        setLocalStorage('CategoriesItemTypes', JSON.stringify(data.CategoriesItemTypes));
        setLocalStorage('ItemTypes', JSON.stringify(data.ItemTypes));
        setLocalStorage('Items', JSON.stringify(data.Items));
        setLocalStorage('Conditions', JSON.stringify(data.Conditions));
        setLocalStorage('Actions', JSON.stringify(data.Actions));
        setLocalStorage('Ports', JSON.stringify(data.Ports));

        //override local json version
        setLocalStorage('JsonVersion', JSON.stringify(data.JsonVersion));
        localJsonVersion = getLocalStorage("timestamp"); //update local time stamp
        console.log("override local: " + localJsonVersion + "; live: "+ getLocalStorage("timestamp"));
    })
    .done(function() {location.reload();})
    .fail(function() {alert( "getLookup error" );})
    .always(function() {});

}
function compareJsonVersion(url){
    $.getJSON(url, function(data) {
        var liveJsonVersion = JSON.stringify(data.JsonVersion);
        if(localJsonVersion != liveJsonVersion){
            //JSON been updated, local data need to be updated
            writeLookUpToLocal(lookupURL);
        }
    })
    .done(function() {})
    .fail(function() {
            alert( "getTimeStamp error, live JSON is down!" );
    })
    .always(function() {});
}
function setLocalStorage(k,v){
    localStorage.setItem(k, v);
}
function getLocalStorage(k){
    return localStorage.getItem(k);
}
function removeLocalStorage(k){
    localStorage.removeItem(k);
}
function clearLocalStorage(){
    localStorage.clear();
}
function setSessionStorage(k,v){
  sessionStorage.setItem(k, v);
}
function getSessionStorage(k){
  return sessionStorage.getItem(k);
}
function removeSessionStorage(k){
  sessionStorage.removeItem(k);
}
