angular.module("TodoDirective", []).directive("todoTable", function() {
	return {
		restrict: "EA", // Attribute
		templateUrl: "templates/directives/todo-table.html"
	};
});