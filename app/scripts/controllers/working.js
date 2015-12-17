'use strict';

/**
 * @ngdoc function
 * @name airInspectionApp.controller:AboutCtrl
 * @description
 * # WorkingCtrl
 * Controller of the airInspectionApp
 */

angular.module('airInspectionApp')
  .filter('baseOnCategoryID', function() {
        return function (items) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.CategoryId == this.categoryID) {
                    filtered.push(item);
                }
            }
            return filtered;
        };
  })
  .filter('baseOnCategoryAircraft', function() {
        return function (items) {
            var filtered = [];

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.CategoryId == this.categoryID && item.AircraftTypeId == this.$parent.global_aircraftTypeId) {
                    filtered.push(item);
                }
            }
            return filtered;
        };
  })
  .filter('baseOnItemTypeID', function() {
        return function (items) {
            var filtered = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.ItemTypeId == this.ItemTypeId) {
                    filtered.push(item);
                }
            }
            return filtered;
        };
  })
  .directive('callbackWhenItemRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$first){
                scope.$emit('FirstElem');
                //itemtypeid  = attrs.value;
                $("#txt_itemtypeid").val(attrs.value);
            }

        };
  })
  .controller('WorkingCtrl', function ($scope) {
    //detect if _surveyor and _regno both assigned value
    if($scope.$parent.global_surveyor =="" || $scope.$parent.global_surveyor == undefined || $scope.$parent.global_surveyor == null || $scope.$parent.global_regno=="" || $scope.$parent.global_regno== undefined || $scope.$parent.global_regno==null || $scope.$parent.global_port =="" || $scope.$parent.global_port == undefined || $scope.$parent.global_port == null){
        //console.log("No global surveyor or regno found!");
        window.location.href = "#";
    }
    else{
        //assign report info
        $scope.regno = $scope.$parent.global_regno;

        $(".report_info h3").html($scope.$parent.global_regno);
        $scope.surveyor = $scope.$parent.global_surveyor;

        $(".surveyor_info h4").html( $scope.$parent.global_surveyor);
        $scope.portno = $scope.$parent.global_port;
        $scope.portnoId = $scope.$parent.global_portId;
        $scope.todayDate = getTodayDate();
        //detect and write connection status

       //var fakeNavigator = {};
       // for (var i in navigator) {
       //   fakeNavigator[i] = navigator[i];
       // }
       // fakeNavigator.onLine = true;
       // navigator = fakeNavigator;
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
    }

    //assign scope
    $scope.locations = JSON.parse(getLocalStorage('Locations'));
    $scope.zones = JSON.parse(getLocalStorage('Zones'));
    $scope.categories = JSON.parse(getLocalStorage('Categories'));
    $scope.categoriesItemTypes = JSON.parse(getLocalStorage('CategoriesItemTypes'));
    //$scope.itemTypes = JSON.parse(getLocalStorage('ItemTypes'));
    $scope.items = JSON.parse(getLocalStorage('Items'));
    $scope.conditions = JSON.parse(getLocalStorage('Conditions'));
    $scope.actions = JSON.parse(getLocalStorage('Actions'));
    $scope.seatLetters = [
            {"Letter":"A"},
            {"Letter":"B"},
            {"Letter":"C"},
            {"Letter":"D"},
            {"Letter":"E"},
            {"Letter":"F"},
            {"Letter":"G"},
            {"Letter":"H"},
            {"Letter":"I"},
            {"Letter":"J"}
        ];
    $scope.seatNumbers = [
            {"Number":1},
            {"Number":2},
            {"Number":3},
            {"Number":4},
            {"Number":5},
            {"Number":6},
            {"Number":7},
            {"Number":8},
            {"Number":9},
            {"Number":10},
            {"Number":11},
            {"Number":12},
            {"Number":13},
            {"Number":14},
            {"Number":15},
            {"Number":16},
            {"Number":17},
            {"Number":18},
            {"Number":19},
            {"Number":20},
            {"Number":21},
            {"Number":22},
            {"Number":23},
            {"Number":24},
            {"Number":25},
            {"Number":26},
            {"Number":27},
            {"Number":28},
            {"Number":29},
            {"Number":30},
            {"Number":31},
            {"Number":32},
            {"Number":33},
            {"Number":34},
            {"Number":35},
            {"Number":36},
            {"Number":37},
            {"Number":38},
            {"Number":39},
            {"Number":40},
            {"Number":41},
            {"Number":42},
            {"Number":43},
            {"Number":44},
            {"Number":45},
            {"Number":46},
            {"Number":47},
            {"Number":48},
            {"Number":49},
            {"Number":50},
            {"Number":51},
            {"Number":52},
            {"Number":53},
            {"Number":54},
            {"Number":55},
            {"Number":56},
            {"Number":57},
            {"Number":58},
            {"Number":59},
            {"Number":60},
            {"Number":61},
            {"Number":62},
            {"Number":63},
            {"Number":64},
            {"Number":65},
            {"Number":66},
            {"Number":67},
            {"Number":68},
            {"Number":69},
            {"Number":70},
            {"Number":71},
            {"Number":72},
            {"Number":73},
            {"Number":74},
            {"Number":75},
            {"Number":76},
            {"Number":77},
            {"Number":78},
            {"Number":79},
            {"Number":80},
            {"Number":81},
            {"Number":82},
            {"Number":83},
            {"Number":84},
            {"Number":85},
            {"Number":86},
            {"Number":87},
            {"Number":88},
            {"Number":89},
            {"Number":90},
            {"Number":91},
            {"Number":92},
            {"Number":93},
            {"Number":94},
            {"Number":95},
            {"Number":96},
            {"Number":97},
            {"Number":98},
            {"Number":99},
            {"Number":100}
        ];
    $scope.categoryID = '';
    $scope.categoryName = '';
    $scope.ItemTypeId = '';

    $scope.populateDropDowns = function(cateID, cateNme, cateDisplaySeat){
        //reset form
        $(".active").removeClass("active");
        $("#category-"+ cateID).addClass("active");
        $scope.mySeatLetter = '';
        $scope.mySeatNumber = '';
        $scope.myComment = '';
        $("#radio_condition input:checked").attr('checked', false);
        $("#radio_action input:checked").attr('checked', false);
        $("#radio_airworthy input:checked").attr('checked', false);

        $scope.categoryID = cateID;
        $scope.categoryName = cateNme;
        $scope.displaySeat = cateDisplaySeat;
        //get first option base on cateID
        $.each($scope.categoriesItemTypes, function (index) {
            var itypeID = $scope.categoriesItemTypes[index].CategoryId;
            if ($scope.categoriesItemTypes[index].CategoryId == $scope.categoryID) {
                $scope.ItemTypeId = $scope.categoriesItemTypes[index].ItemTypeId;
                return false;
            }
        });
    }
    $scope.populateItemDescription = function(itemTypeID){
        $scope.ItemTypeId = itemTypeID;
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

    $scope.saveRecord = function(){
    var flag = true;
    //validation
    if($scope.categoryName == "")
    {
        flag = false;
        $scope.error_message = "Please select Category!";
        $('#errorModal').modal();

    }
    /*else if($scope.myZone == null || $scope.myZone == undefined || $scope.myZone == ""){
        flag = false;
        $scope.error_message = "Please select Zone!";
        $('#errorModal').modal();
    }*/
    else if($scope.myLocation == null || $scope.myLocation == undefined || $scope.myLocation == "" || $scope.myLocation == "999999"){
        flag = false;
        $scope.error_message = "Please select Location!";
        $('#errorModal').modal();
    }
    else if($scope.myItem == null || $scope.myItem == undefined || $scope.myItem == "" || $scope.myItem == "999999"){
        flag = false;
        $scope.error_message = "Please select Item!";
        $('#errorModal').modal();
    }
    else if($scope.myDescription == null || $scope.myDescription == undefined || $scope.myDescription == "" || $scope.myDescription == "999999"){
        flag = false;
        $scope.error_message = "Please select Description!";
        $('#errorModal').modal();
    }
    else if($scope.checkRadioText("#radio_condition") == null || $scope.checkRadioText("#radio_condition") == undefined || $scope.checkRadioText("#radio_condition") == ""){
        flag = false;
        $scope.error_message = "Please select Condition!";
        $('#errorModal').modal();
    }
    else if($scope.checkRadioText("#radio_action") == null || $scope.checkRadioText("#radio_action") == undefined || $scope.checkRadioText("#radio_action") == ""){
        flag = false;
        $scope.error_message = "Please select Action!";
        $('#errorModal').modal();
    }
    else if($scope.checkRadioText("#radio_airworthy") == null || $scope.checkRadioText("#radio_airworthy") == undefined || $scope.checkRadioText("#radio_airworthy") == ""){
        flag = false;
        $scope.error_message = "Please select Airworthiness!";
        $('#errorModal').modal();
    }
    //insert record to record panel
    if(flag){
        var li_len = $(".record-panel ul li").length;
        var html = "<li class='"+$scope.checkRadioText("#radio_airworthy")+"Airworthy' id='rec-"+li_len+"'>";
         html += "<span class='square'>"+ $scope.categoryName.substring(0, 2).toUpperCase() +"</span><span class='localtion'>"+$scope.myLocation.Code+"</span><span class='itemdesc'>"+$scope.myDescription.ItemDescription+"</span>";
         html += "<span class='condition "+$scope.checkRadioText("#radio_condition")+"'>"+$scope.checkRadioText("#radio_condition")+"</span><span class='action "+$scope.checkRadioText("#radio_action")+"'>"+$scope.checkRadioText("#radio_action")+"</span><span class='"+$scope.checkRadioText("#radio_airworthy")+"Airworthy'>"+ $scope.checkRadioText("#radio_airworthy").substring(0, 1).toUpperCase() +"</span>";
         html += "<span class='close openDeleteModal' data-toggle='modal' data-target='#deleteModal' data-id='rec-"+li_len+"'><i class='fa fa-times-circle'></i></span>";
         html += "<span class='comment'><strong>Comment: </strong>"+$scope.myComment+"</span>";
         html += "</li>";

        $(".record-panel ul").append(html);
        var seatL = '';
        var seatN = '';

        if(typeof $scope.mySeatLetter.Letter != 'undefined'){
            seatL = $scope.mySeatLetter.Letter;
        }
        if(typeof $scope.mySeatNumber.Number != 'undefined'){
            seatN = $scope.mySeatNumber.Number;
        }

        //check if any report been created for this session, otherwise create one and start inserting record into it
      //console.log(getLocalStorage(this.$parent.global_ReportID));

      if(getLocalStorage(this.$parent.global_ReportID) == null){
            var nowTime = new Date();
            var utcTime = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getDate(), +nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds(), nowTime.getUTCMilliseconds()).toISOString();

            //no report created, create one
            var record = '{"RegNo": "' + $scope.regno + '",';
            record += ' "PortNo": "' + $scope.portnoId + '",';
            record += ' "AircraftId": "' + $scope.$parent.global_aircraftId + '",';
            record += ' "AircraftTypeId": "' + $scope.$parent.global_aircraftTypeId + '",';
            record += '"SurveyorId": "' + $scope.$parent.global_surveyorId + '",';
            record += ' "Surveyor": "' + $scope.surveyor + '",';
            record += '"Records":[{';
            record += '"LocationId": "' + $scope.myLocation.LocationId + '",';
            record += '"Code":"'+ $scope.myLocation.Code + '",';
            record += '"SeatRow": "' + seatL + '",';
            record += '"SeatNo": "' +seatN + '",';
            record += '"CategoryID": "' + $scope.categoryID + '",';
            record += '"CategoryName":"' + $scope.categoryName + '",';
            record += '"ItemTypeID":"'+ $scope.myItem.ItemTypeId + '",';
            record += '"ItemType":"'+ $scope.myItem.ItemTypeDescription + '",';
            record += '"ItemID":"'+ $scope.myDescription.ItemId + '",';
            record += '"ItemDescription":"'+ $scope.myDescription.ItemDescription + '",';
            record += '"ConditionID":"'+$scope.checkRadioValue('#radio_condition')+'",';
            record += '"Condition":"'+ $scope.checkRadioText('#radio_condition') +'",';
            record += '"AirworthinessDefect":"'+$scope.checkRadioText('#radio_airworthy')+'",';
            record += '"ActionID":"'+$scope.checkRadioValue('#radio_action')+'",';
            record += '"Action":"'+ $scope.checkRadioText('#radio_action') + '",';
            record += '"Comment":"'+$scope.myComment+'"';
            record += '}],';
            record += '"CreatedDate":"'+utcTime+'",';
            record += '"SubmittedBy":"",';
            record += '"Status":"A"}';


            setLocalStorage(this.$parent.global_ReportID, record);
        }else{
            //TODO:get record insert in JSON
            var feed = JSON.parse(getLocalStorage(this.$parent.global_ReportID));
            var record ='{';
            record += '"LocationId": "' + $scope.myLocation.LocationId + '",';
            record += '"Code":"'+ $scope.myLocation.Code + '",';
            record += '"SeatRow": "' + seatL + '",';
            record += '"SeatNo": "' +seatN + '",';
            record += '"CategoryID": "' + $scope.categoryID + '",';
            record += '"CategoryName":"' + $scope.categoryName + '",';
            record += '"ItemTypeID":"'+ $scope.myItem.ItemTypeId + '",';
            record += '"ItemType":"'+ $scope.myItem.ItemTypeDescription + '",';
            record += '"ItemID":"'+ $scope.myDescription.ItemId + '",';
            record += '"ItemDescription":"'+ $scope.myDescription.ItemDescription + '",';
            record += '"ConditionID":"'+$scope.checkRadioValue('#radio_condition')+'",';
            record += '"Condition":"'+ $scope.checkRadioText('#radio_condition') +'",';
            record += '"AirworthinessDefect":"'+$scope.checkRadioText('#radio_airworthy')+'",';
            record += '"ActionID":"'+$scope.checkRadioValue('#radio_action')+'",';
            record += '"Action":"'+ $scope.checkRadioText('#radio_action') + '",';
            record += '"Comment":"'+$scope.myComment+'"';
            record += '}';

            //var record ='{"CategoryName":"' + $scope.categoryName + '", "ZoneName":"", "ZoneID":"999999", "SeatNo":"' + seatL+''+seatN + '", "Code":"'+ $scope.myLocation.Code + '", "LocationId":"'+ $scope.myLocation.LocationId + '", "ItemType":"'+ $scope.myItem.ItemTypeDescription + '","ItemTypeId":"'+ $scope.myItem.ItemTypeId + '", "ItemDescription":"'+ $scope.myDescription.ItemDescription + '", "ItemId":"'+ $scope.myDescription.ItemId + '", "Comment":"'+ $scope.myComment + '", "Condition":"'+ $scope.checkRadioText('#radio_condition') +  '","ConditionId":"'+ $scope.checkRadioValue('#radio_condition') +  '", "Action":"'+ $scope.checkRadioText('#radio_action') + '","ActionId":"'+ $scope.checkRadioValue('#radio_action') +  '", "AirworthinessDefect":"'+ $scope.checkRadioText('#radio_airworthy') +'"}';

            feed['Records'].push(JSON.parse(record));
            setLocalStorage(this.$parent.global_ReportID, JSON.stringify(feed));
        }
        //TODO:reset inputs
        $(".active").removeClass("active");
        $scope.categoryName = "";
        $scope.$apply;
        $scope.myZone = "999999";
        $scope.myLocation = "999999";
        $scope.myItem = "999999";
        $scope.myDescription = "999999";
        $('input:checked').prop('checked',false);
        $('#defaultAirworth').prop('checked', true);
        $scope.mySeatLetter= "";
        $scope.mySeatNumber = "";
        $scope.myComment = "";
    }
};

$scope.checkRadioText = function(el){
    return $(el + " input:checked + span").text();
};
$scope.checkRadioValue = function(el){
    return $(el + " input:checked").val();
};
$scope.cancelReport = function(){
    removeLocalStorage(this.$parent.global_ReportID);
    $scope.$parent.global_aircraftTypeId = '';
    $scope.$parent.global_surveyorId = '';
    $scope.redirectTO("#");
};
$scope.redirectTO = function(url){
    $('.modal-backdrop').remove();
    window.location.href = url;
};

var recID;
$(document).on("click", ".openDeleteModal", function(){
    recID = $(this).data('id');
});
//remove record
$scope.deleteIt = function(){
    //TODO: delete item here
    var idx = parseInt(recID.replace('rec-', ''));
    $(".record-panel ul li#"+recID).remove();
    //console.log(this.$parent.global_ReportID);
    //remove from JSON in local storage
    var feed = JSON.parse(getLocalStorage(this.$parent.global_ReportID));
    feed['Records'].splice(idx,1);
    if(feed['Records'].length >0) {
        setLocalStorage(this.$parent.global_ReportID, JSON.stringify(feed));
    }
    else{
        //no record, remove report
        removeLocalStorage(this.$parent.global_ReportID);
    }
};
//done report
$scope.doneReport = function(){
    if(getLocalStorage(this.$parent.global_ReportID) == null){
        //no record found
        $scope.error_message = "Please double check, seems no record found in this report!";
        $('#errorModal').modal();
    }
    else{
        $scope.redirectTO("#/summary/from/work/rptid/"+this.$parent.global_ReportID);
    }
}
$scope.extModal = function(){
  $scope.AircraftModel = "";
  var airtype = JSON.parse(getLocalStorage('AircraftTypes'));
  for(var i = 0; i < airtype.length; i++){
    if(airtype[i].AircraftTypeId == $scope.$parent.global_aircraftTypeId){
      $scope.AircraftModel = airtype[i].AircraftTypeDescription;
      //alert($scope.AircraftModel);
      $('#extModal').modal();
    }
  }



}
});
