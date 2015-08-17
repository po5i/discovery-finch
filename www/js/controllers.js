angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, oauthService, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = null;
  $scope.myself = null;
  $scope.cards = [];

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  /*$scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };*/

  $scope.connectButton = function(backend) {
      promiseB = oauthService.connectProvider(backend).then(function(data) {
      });

      promiseB.then(function(data){
          oauthService.getCurrentUser().then(function(data2){
            $scope.myself = data2;
          });  

          promiseC = oauthService.getSuggestions().then(function(data2){
            $scope.suggestions = data2;

            for(var i=0;i < 2;i++){ //$scope.suggestions.length
              oauthService.getSuggestionMembers($scope.suggestions[i].slug).then(function(data3){
                console.log(data3);
                for(var j=0;j < data3.users.length;j++){
                  $scope.cards.push(data3.users[j]);
                }
              })
            }
          });  
      });

      $scope.cardDestroyed = function(index) {
        $scope.cards.splice(index, 1);
      };

      $scope.cardSwiped = function(index) {
        //var newCard = // new card data
        //$scope.cards.push(newCard);
      };

      

      $scope.modal.hide();
  };

  // detectar requireLogin
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    if(("data" in toState)){
      //console.log(toState);
      var requireLogin = toState.data.requireLogin;

      if (requireLogin && (typeof $rootScope.authenticated === 'undefined')) {
        event.preventDefault();
        $rootScope.redirect = toState.name;
        // get me a login!
        $scope.modal.show();
      }
    }
  });

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
