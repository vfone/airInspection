'use strict';

/**
 * @ngdoc function
 * @name airInspectionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the airInspectionApp
 */
angular.module('airInspectionApp')
  .controller('MainCtrl', function ($scope) {
    if($("#txt_dataUpdated").val()=="true"){
        localtion.reload();
        $("#txt_dataUpdated").val('false');
    }
    $scope.surveyors = JSON.parse(getLocalStorage('Surveyors'));
    $scope.aircrafts = JSON.parse(getLocalStorage('Aircrafts'));

    //when text input focus display dropdown list
    $(".login_box .input input").focusin(function(){

       $(".login_box .input .optionDropdown").slideUp();
    }).keyup(function(){

        if($(this).val().length >= 2)
        {
            $(this).parent('.input').find(".optionDropdown").slideDown();
        }
        else{
            $(this).parent('.input').find(".optionDropdown").slideUp();
        }
    });
    $scope.assignToAircraft = function(el, val, val2, val3){
        $('#'+el).parents('.input').find('input').val(val);
        $('#'+el).parents('.input').css("border", "none");

        //assign global aircraftTypeId
        $scope.$parent.global_aircraftTypeId = val2;
        $scope.$parent.global_aircraftId = val3;

        $('#'+el).parents('.input').find(".optionDropdown").slideUp();
    };
    $scope.assignToSurveyor = function(el, val, val2){
        $('#'+el).parents('.input').find('input').val(val);
        $('#'+el).parents('.input').css("border", "none");

        //assign global aircraftTypeId
        $scope.$parent.global_surveyorId = val2;

        $('#'+el).parents('.input').find(".optionDropdown").slideUp();
    };
    $scope.goToWorking = function(){
        //check if survey and regno been selected
        if($("#txt_surveyor").val()!= "" && $("#txt_regno").val() != "" && $scope.$parent.global_aircraftTypeId != "" && $scope.$parent.global_surveyorId != ""){
            $scope.$parent.global_surveyor = $("#txt_surveyor").val();
            $scope.$parent.global_regno = $("#txt_regno").val();

            window.location.href="#working";
        }
        else{
            if($scope.$parent.global_surveyorId == "")
            {
                $("#txt_surveyor").val('');
                $("#txt_surveyor").parent(".input").css("border", "1px solid red");
            }
            else{
                $("#txt_surveyor").parent(".input").css("border", "none");
            }
            if($scope.$parent.global_aircraftTypeId == "")
            {
                $("#txt_regno").val('');
                $("#txt_regno").parent(".input").css("border", "1px solid red");
            }
            else{
                $("#txt_regno").parent(".input").css("border", "none");
            }
            if($("#txt_surveyor").val() == "")
            {
                $("#txt_surveyor").parent(".input").css("border", "1px solid red");
            }
            else{
                $("#txt_surveyor").parent(".input").css("border", "none");
            }
            if($("#txt_regno").val() == "")
            {
                $("#txt_regno").parent(".input").css("border", "1px solid red");
            }
            else{
                $("#txt_regno").parent(".input").css("border", "none");
            }
        }
    };
    //check if any pending report in local storage
        var arrPendingReports = [];
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
        if(arrPendingReports.length > 0){
            $(".report_dock h2").hide();
            $(".report_dock div").show();
        }
        else{
            $(".report_dock h2").show();
            $(".report_dock div").hide();
        }
    //goSummary
        $scope.goSummary = function(reportID){
            $scope.$parent.global_PendingID = reportID;
            window.location.href="#/summary/from/login/rptid/"+reportID;
        };

  });

