angular.module("RouteControllers", []) // TAKE OUT ALERTS AND CONSOLE LOGS
	.controller("HomeController", function($scope, store) {
		$scope.title = "Welcome to Angular Todo!";

		navState = function() {
			if (!store.get("authToken")) {
				$("#navUser").css("display", "none");
				$("#navLogin").css("display", "block");
				$("#navLogout").css("display", "none");
			}
			else {
				$("#navUser").css("display", "block").text(store.get("username"));
				$("#navLogin").css("display", "none");
				$("#navLogout").css("display", "block");
			}
		}
		navState();
	})

	.controller("RegisterController", function($scope, $location, UserAPIService, store) { 

		$scope.registrationUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.login = function() {
			UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
				$scope.token = results.data.token;
				store.set('username', $scope.registrationUser.username);
				store.set('authToken', $scope.token);
				$location.path("/todo");
				navState();
			}).catch(function(err) {
				console.log(err.data);
			});
			
		}

		$scope.submitForm = function() {
			if ($scope.registrationForm.$valid) {
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;
			
				UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
					$scope.data = results.data;
					alert("You have successfully registered to Angular Todo");
					$scope.login();
				}).catch(function(err) {
					alert("Oops! Something went wrong!");
					console.log(err)
				});
			}
		};
	})

	.controller("LoginController", function($scope, $location, UserAPIService, store) {
		$scope.loginUser = {};
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.submitForm = function() {
			if ($scope.loginForm.$valid) {
				$scope.loginUser.username = $scope.user.username;
				$scope.loginUser.password = $scope.user.password;

				UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results) {
					$scope.token = results.data.token;
					store.set('username', $scope.loginUser.username);
					store.set('authToken', $scope.token);
					$location.path("/todo");
				}).catch(function(err) {
					console.log(err.data);
				});
			}
		}
	})
	
	.controller("TodoController", function($scope, $location, $route, TodoAPIService, store) {
		if (!store.get("authToken")) {
			$location.path("/login");
		};

		navState();

		$scope.reloadRoute = function() {
			$route.reload();
		};
		
		var URL = "https://morning-castle-91468.herokuapp.com/";

		$scope.authToken = store.get("authToken");
		$scope.username = store.get("username");

		$scope.todos = [];

		TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
			$scope.todos = results.data || [];
		}).catch(function(err) {
			console.log(err)
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.username = $scope.username;
				$scope.todos.push($scope.todo);

				TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
					$("#todo-modal").modal("hide");
					$("#todo-modal").on("hidden.bs.modal", function() {
						$scope.reloadRoute();
					});
					
				}).catch(function(err){
					console.log(err)
				});

			}
		};

		$scope.editTodo = function(id) {
			$location.path("/todo/edit/" + id);
		};

		$scope.deleteTodo = function(id) {
			TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
				$scope.reloadRoute();
			}).catch(function(err) {
				console.log(err);
			});
		};
	})

	.controller("EditTodoController", function($scope, $location, $routeParams, TodoAPIService, store) {
		if (!store.get("authToken")) {
			$location.path("/login");
		};

		var id = $routeParams.id;
		var URL = "https://morning-castle-91468.herokuapp.com/";

		TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get("authToken")).then(function(results) {
			$scope.todo = results.data;
		}).catch(function(err) {
			console.log(err)
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.username = $scope.username;

				TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get("authToken")).then(function(results) {
					$location.path("/todo");
				}).catch(function(err) {
					console.log(err);
				})
			}
		} 
	})

	.controller("LogoutController", function($scope, store) {
		store.remove("username");
		store.remove("authToken");
		$scope.logoutmsg = "You have been logged out.";
		navState();
	});









