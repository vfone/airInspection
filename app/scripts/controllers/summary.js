'use strict';

/**
 * @ngdoc function
 * @name airInspectionApp.controller:AboutCtrl
 * @description
 * # SummaryCtrl
 * Controller of the airInspectionApp
 */

var urlPath = window.location.hash.substr(1).split('/');


angular.module('airInspectionApp')
    .controller('SummaryCtrl', function ($scope, $rootScope, $routeParams, $http) {


        //assign report info
       /* $scope.regno = $scope.$parent.global_regno;

        $(".report_info h3").html($scope.$parent.global_regno);
        $scope.surveyor = $scope.$parent.global_surveyor;

        $(".surveyor_info h4").html( $scope.$parent.global_surveyor);

        */
        //detect if _surveyor and _regno both assigned value
        $scope.todayDate = getTodayDate();
        //detect and write connection status
          var fakeNavigator = {};
          for (var i in navigator) {
            fakeNavigator[i] = navigator[i];
          }
          fakeNavigator.onLine = true;
          navigator = fakeNavigator;
          $scope.isOnline = window.navigator.onLine;
        if($scope.isOnline){
            $scope.connetionState = [{
                status: 'online',
                message: 'connected'
            }];
        }
        else{
            $scope.connetionState = [{
                status : 'offline',
                message: 'offline'
            }];
        }

        $scope.cfdump = "";
        //******** populate side nav
        var arrPendingReports = [];
        //get list of pending report
        for(var key in localStorage) {

            if((/^report_/).test(key)){
                //this is a pending report
                //get RegNo base on report id
                var obj = JSON.parse(getLocalStorage(key));

                var regNo = obj.RegNo;
                var surveyorId = obj.SurveyorId;

                arrPendingReports.push({"ReportID": key, "RegNo": regNo, "SurveyorId": surveyorId});
            }
        }
        $scope.pendingreports = arrPendingReports;
        $scope.hasReport = ($scope.pendingreports).length > 0;


        var urlOrigin = $routeParams.origin;
        var urlRptID = $routeParams.reportID;
        $scope.submitRptID = urlRptID;

        $scope.navClass = function (id) {
            return id === urlRptID ? 'active' : '';
        };

        $("#"+urlRptID).delay(30000).addClass("active");

        if(getLocalStorage(urlRptID) != null){
            //if global_ReportID exists means page came from working
            var data = JSON.parse(getLocalStorage(urlRptID));
            $scope.reportData = data['Records'];
            $scope.surveyor = data['Surveyor'];
            $scope.regno = data['RegNo'];
        }
        else{
            //no variable, go back to login
            window.location.href="#";
        }

        $scope.populateReport = function(reportID){
            $scope.submitRptID = reportID;
            //console.log("submitRptID: " + $scope.submitRptID);
            var feed = JSON.parse(getLocalStorage(reportID));
            $scope.reportData = feed['Records'];
            $("#summary .pendingreport ul li.active").removeClass("active");
            $("#"+reportID).addClass("active");
            //TODO: do I need to change URL as well?
            window.location.href="#/summary/from/"+urlOrigin+"/rptid/"+reportID;

        }
        function getTodayDate(){
            var today = new Date();
            var dd = today.getDate();
            var day = today.getDay();
            var mm = today.getMonth()+1; //January is 0!
            var MM = "Jan";
            var DAY = "MON";
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            }
            switch(mm) {
                case 1:
                    MM = "JAN";
                    break;
                case 2:
                    MM = "FEB";
                    break;
                case 3:
                    MM = "MAR";
                    break;
                case 4:
                    MM = "APR";
                    break;
                case 5:
                    MM = "MAY";
                    break;
                case 6:
                    MM = "JUN";
                    break;
                case 7:
                    MM = "JUL";
                    break;
                case 8:
                    MM = "AUG";
                    break;
                case 9:
                    MM = "SEP";
                    break;
                case 10:
                    MM = "OCT";
                    break;
                case 11:
                    MM = "NOV";
                    break;
                case 12:
                    MM = "DEC";
                    break;
            }
            switch(day) {
                case 0:
                    DAY = "SUN";
                    break;
                case 1:
                    DAY = "MON";
                    break;
                case 2:
                    DAY = "TUE";
                    break;
                case 3:
                    DAY = "WED";
                    break;
                case 4:
                    DAY = "THU";
                    break;
                case 5:
                    DAY = "FRI";
                    break;
                case 6:
                    DAY = "SAT";
            }
            if(mm<10){
                mm='0'+mm
            }
            today = dd+'-'+MM+'-'+yyyy + ' | '+ DAY;
            return today;
        };
        ;

        //logout
        $scope.logoutIt = function() {
            //logout, reset all global variable and go back to home
            $scope.$parent.global_surveyor = '';
            $scope.$parent.global_regno = '';
            $scope.$parent.global_surveyorId = '';
            $scope.$parent.global_aircraftId = '';
            $scope.$parent.global_aircraftTypeId = '';
            window.location.href="#";
            $rootScope.global_ReportID = "report_"+randomString(6,"*");
            $('.modal-backdrop').remove();
        }


        //remove report
        $scope.deleteIt = function(){
            if(getLocalStorage($scope.submitRptID) == null){
                //no record found
                $scope.error_message = "Report can't be found, should been deleted already!";
                //******** populate side nav
                arrPendingReports = [];
                //get list of pending report
                for(var key in localStorage) {
                    if((/^report_/).test(key)){
                        //this is a pending report
                        //get RegNo base on report id
                        var obj = JSON.parse(getLocalStorage(key));
                        var regNo = obj['RegNo'].toString();
                        var surveyor = obj['Surveyor'].toString();

                        arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                    }
                }
                $scope.pendingreports = arrPendingReports;
                $scope.hasReport = ($scope.pendingreports).length > 0;
                $scope.reportData = '';
                $scope.submitRptID = '';
                $('#errorModal').modal();
            }
            else{
                removeLocalStorage($scope.submitRptID);


                //******** populate side nav
                arrPendingReports = [];
                //get list of pending report
                for(var key in localStorage) {
                    if((/^report_/).test(key)){
                        //this is a pending report
                        //get RegNo base on report id
                        var obj = JSON.parse(getLocalStorage(key));
                        var regNo = obj['RegNo'].toString();
                        var surveyor = obj['Surveyor'].toString();

                        arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                    }
                }
                $scope.pendingreports = arrPendingReports;
                $scope.hasReport = ($scope.pendingreports).length > 0;
                $scope.reportData = '';
                $scope.submitRptID = '';
            }
        };

        //submit report
        $scope.submitIt = function(){
          //GET AUTH
          var loginObj = $.param({
              "grant_type": "password",
              "username": $scope.submitItUserName,
              "password": $scope.submitItPassword,
              "authcode": authcode
          });
          //console.log(loginObj);
          var res = $http({
            method: 'POST',
            url: authURL,
            data: loginObj,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });

          res.success(function(response, status, headers, config) {
            $scope.authFailed = false;
            $scope.accessToken = response.access_token;
            $scope.tokenType = response.token_type;
            $scope.loggedinName = response.userName;

            $('#submitModal').modal('hide');

            //POST data
            if(getLocalStorage($scope.submitRptID) == null){
              //no record found
              $scope.error_message = "Report can't be found, please try again!";

              //******** populate side nav
              arrPendingReports = [];
              //get list of pending report
              for(var key in localStorage) {
                if((/^report_/).test(key)){
                  //this is a pending report
                  //get RegNo base on report id
                  var obj = JSON.parse(getLocalStorage(key));
                  var regNo = obj['RegNo'].toString();
                  var surveyor = obj['Surveyor'].toString();

                  arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                }
              }
              $scope.pendingreports = arrPendingReports;
              $scope.hasReport = ($scope.pendingreports).length > 0;
              $scope.submitRptID = '';
              $('#errorModal').modal();
            }
            else {
              //only submit if $scope.posting == false, means post is NOT in progress
              if($scope.posting != true)
              {
                //submit here
                var dataObj = JSON.parse(getLocalStorage($scope.submitRptID));
                dataObj.SubmittedBy = $scope.loggedinName;
                console.log(JSON.stringify(dataObj));
                var res = $http({
                  method: 'POST',
                  url: postURL,
                  data: JSON.stringify(dataObj),
                  headers: {
                      'content-type': 'application/json',
                      'authorization': 'Bearer ' + $scope.accessToken
                  }
                });

                res.success(function(data, status, headers, config) {
                  console.log(data);

                  //once successful, remove report from local storage and re-populate side nav
                  removeLocalStorage($scope.submitRptID);
                  //******** populate side nav
                  arrPendingReports = [];
                  //get list of pending report
                  for(var key in localStorage) {
                    if((/^report_/).test(key)){
                      //this is a pending report
                      //get RegNo base on report id
                      var obj = JSON.parse(getLocalStorage(key));
                      var regNo = obj['RegNo'].toString();
                      var surveyor = obj['Surveyor'].toString();

                      arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                    }
                  }
                  $scope.pendingreports = arrPendingReports;
                  $scope.hasReport = ($scope.pendingreports).length > 0;
                  $scope.submitRptID = '';
                  $(".record-panel ul").html('');
                  $scope.posting = false;
                  $scope.success_message = "You report been submitted!";
                  $('#successModal').modal();

                });
                res.error(function(data, status, headers, config) {
                  console.log(data);
                  console.log(status);
                  $scope.posting = false;
                  $scope.error_message = data.Message;
                  $('#errorModal').modal();
                });
              }
            }
          });
          res.error(function(data, status, headers, config) {
            $scope.authFailed = true;
            $scope.failureMessage = data.error_description;
          });
        };

        //submit all reports
        $scope.submitAll = function() {
          //GET AUTH
          var loginObj = $.param({
            "grant_type": "password",
            "username": $scope.submitAllUserName,
            "password": $scope.submitAllPassword,
            "authcode": authcode
          });
          var res = $http({
            method: 'POST',
            url: authURL,
            data: loginObj,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });
          res.success(function (response, status, headers, config) {
            $scope.authFailed = false;
            $scope.accessToken = response.access_token;
            $scope.tokenType = response.token_type;
            $scope.loggedinName = response.userName;

            $('#submitAllModal').modal('hide');

            //POST Data
            if (getLocalStorage($scope.submitRptID) == null) {
              //no record found
              $scope.error_message = "Report can't be found, please try again!";

              //******** populate side nav
              arrPendingReports = [];
              //get list of pending report
              for (var key in localStorage) {
                if ((/^report_/).test(key)) {
                  //this is a pending report
                  //get RegNo base on report id
                  var obj = JSON.parse(getLocalStorage(key));
                  var regNo = obj['RegNo'].toString();
                  var surveyor = obj['Surveyor'].toString();

                  arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                }
              }
              $scope.pendingreports = arrPendingReports;
              $scope.hasReport = ($scope.pendingreports).length > 0;
              $scope.submitRptID = '';
              $('#errorModal').modal();
            }
            else {
              //only submit if $scope.posting == false, means post is NOT in progress
              if ($scope.posting != true) {

                for (var i = 0; i < $scope.pendingreports.length; i++) {
                  $scope.submitRptID = $scope.pendingreports[i].ReportID;
                  //submit here
                  var dataObj = JSON.parse(getLocalStorage($scope.submitRptID));
                  dataObj.SubmittedBy = $scope.loggedinName;
                  var res = $http({
                    method: 'POST',
                    url: postURL,
                    data: JSON.stringify(dataObj),
                    headers: {
                      'content-type': 'application/json',
                      'authorization': 'Bearer ' + $scope.accessToken
                    }
                  });
                  res.success(function(data, status, headers, config) {
                    console.log(data);

                    //once successful, remove report from local storage and re-populate side nav
                    removeLocalStorage($scope.submitRptID);
                    //******** populate side nav
                    arrPendingReports = [];
                    //get list of pending report
                    for(var key in localStorage) {
                      if((/^report_/).test(key)){
                        //this is a pending report
                        //get RegNo base on report id
                        var obj = JSON.parse(getLocalStorage(key));
                        var regNo = obj['RegNo'].toString();
                        var surveyor = obj['Surveyor'].toString();

                        arrPendingReports.push({"ReportID": key, "RegNo": regNo, "Surveyor": surveyor});
                      }
                    }
                    $scope.pendingreports = arrPendingReports;
                    $scope.hasReport = ($scope.pendingreports).length > 0;
                    $scope.submitRptID = '';
                    $(".record-panel ul").html('');
                    $scope.posting = false;
                    $scope.success_message = "You report been submitted!";
                    $('#successModal').modal();

                  });
                  res.error(function(data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                    $scope.posting = false;
                    $scope.error_message = data.Message;
                    $('#errorModal').modal();
                  });

                }
              }
            }

          });
          res.error(function (data, status, headers, config) {
            $scope.authFailed = true;
            $scope.failureMessage = data.error_description;
          });

        }
    });
