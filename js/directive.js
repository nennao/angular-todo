angular.module("TodoDirective", [])

	.directive("todoTable", function() {
		return {
			restrict: "EA", 
			templateUrl: "templates/directives/todo-table.html"
		};
	})

	.directive("todoNav", function() {
		return {
			restrict: "EA", 
			templateUrl: "templates/directives/todo-nav.html"
		};
	});