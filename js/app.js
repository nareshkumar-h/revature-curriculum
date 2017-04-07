var myApp = angular.module("myApp",['ngRoute']);
	myApp.config(function ($routeProvider) {
		 $routeProvider
	        .when("/viewcourse/:courseName", {
		        templateUrl: "partials/course.html",
		        controller: "CourseController"
	            })
            .when("/courses/:category", {
               templateUrl: "partials/courselist.html",
               controller: "CourseListController"
                 })
	    	.otherwise({
	    		redirectTo: "/courses/ALL"
	    	});
	});

	myApp.controller("CourseListController", function($scope,$http,  $route, $routeParams, $location) {
		var category = $routeParams.category;

         var url = "json/courses.json";
	    console.log("URL:" + url );

        var title  = "";
		 $http.get(url).then ( function (response) {
             console.log(JSON.stringify(response.data));
			var data  = response.data;
            localStorage.setItem("ALL_COURSES", JSON.stringify(data));
            var semesters = _.uniq( _.pluck( data , 'semester') );
            var courseMap = {} ;
            for ( var i in semesters) {
                var semNo = semesters[i];
                var courses = _.where( data, {"semester": semNo});
                if ( category ==='theory') {
                    courses = _.where ( courses, {"type": 'T'});
                    title = 'Theory Courses';
                }
                else if ( category ==='lab') {
                    courses = _.where ( courses, {"type":'L'});
                    title = 'Lab Courses';
                }
                else if ( category ==='sd') {
                    courses = _.where ( courses, {"type":'SD'});
                    title = 'Skill Development Courses';
                }
                else if ( category ==='project') {
                    courses = _.where ( courses, {"type":'P'});
                    title = 'Project Work';
                }
                else if ( category ==='ALL') {
                    title = 'All courses';
                }
                if ( courses.length > 0) {
                    courseMap[semNo] = courses;
                }
            }
            console.log("Semesters:" + semesters );

			$scope.courseMap = courseMap;	
            $scope.title = title;
            console.log(JSON.stringify(courseMap));		
		});

	});

    myApp.controller("MainController", function($scope,$location) {
		$scope.isActive = function (viewLocation) {
			console.log("ViewLocation:" + viewLocation );
			console.log("path:" + $location.path() );
	        return viewLocation === $location.path();
	    };

	});
	myApp.controller("CourseController", function($scope, $http, $route, $routeParams, $location ) {
		var courseCode = $routeParams.courseName;
		console.log("CourseController" + courseCode );

		$scope.isActive = function (viewLocation) {
			console.log("ViewLocation:" + viewLocation );
			console.log("path:" + $location.path() );
	        return viewLocation === $location.path();
	    };

	    var url = "json/" + courseCode + ".json";
	    console.log("URL:" + url );

        var courses = JSON.parse( localStorage.getItem("ALL_COURSES"));
        var courseObj = _.where(courses, {"code" : courseCode })[0];
        $scope.course =  courseObj;

		 $http.get(url).then ( function (response) {
			var data  = response.data;
			$scope.title = data.title;
            $scope.courseCode = courseCode;
			$scope.modules = data.modules;
		});
	});
	myApp.controller("MentorController", function($scope, $http, $route, $routeParams, $location ) {

		console.log("MentorController"  );

		$scope.isActive = function (viewLocation) {
			console.log("ViewLocation:" + viewLocation );
			console.log("path:" + $location.path() );
	        return viewLocation === $location.path();
	    };

	    var url = "json/mentors.json";
	    console.log("URL:" + url );

        
		 $http.get(url).then ( function (response) {
			var data  = response.data;
			$scope.title = data.title;
			$scope.trainers = data.trainers;
		});
	});


	/* $(document).ready ( function(){
		console.log("Loaded");

		$("#section-content").load("home.html");

		$("a").click ( function (e){
			e.preventDefault();
			var page= $(this).attr("href");
			console.log(page);
			var html = $.get(page);
			//alert(html);
			$("#section-content").load(page);

		});
	}); */

	 function updatePageContent( data) {
		var pageContent = "";
		var totalPoints = 0;
		for ( var i in data) {
			var obj = data[i];
			var moduleName = obj.name ;
			var topics = obj.topics;
			var points = 10* topics.length;
			totalPoints += points;
			pageContent+="<p><font color='blue'> <b> Module " + (parseInt(i) + 1 )+ ": " + moduleName + "( Points - " + points +")</b></font></p>";
			//pageContent+="<p><ul>";

			for ( var j in topics){
				var topicName = topics[j];
				pageContent+="<p>&nbsp;&nbsp;&nbsp;&nbsp;Topic " + (parseInt(j) + 1 ) + ": " + topicName + "</p>";
			}
			//pageContent+="</ul></p>";
			console.log(moduleName +":" + points);
		}
		//console.log(pageContent);
		console.log("TotalPoints:" + totalPoints);
		pageContent+= "<p><font color='blue'><b>TotalPoints: " + totalPoints +"</b></font></p>";
		$("#modules").html( pageContent);
	}

	/*function updatePageContent( data) {
		var pageContent = "<div class='single_post'><article><div class='art'>";
		for ( var i in data) {
			var obj = data[i];
			var moduleName = obj.name ;
			pageContent+="<header class=post_head'><h2><a href='#'>" + moduleName + "</a></h2></header>";
			//pageContent+="<p><ul>";
			var topics = obj.topics;
			for ( var j in topics){
				var topicName = topics[j];
				pageContent+="<p>&nbsp;&nbsp;&nbsp;&nbsp;Topic " + (parseInt(j) + 1 ) + ": " + topicName + "</p>";
			}
			//pageContent+="</ul></p>";
		}
		pageContent+="</div> </article></div>";
		console.log(pageContent);

		$("#modules").html( pageContent);
	} */
