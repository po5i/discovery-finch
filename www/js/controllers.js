angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, oauthService, $rootScope, $state) {

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
  $scope.suggested = [];

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    if(!$rootScope.authenticated){
      $scope.modal.show();
    }
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
            var only = true;

            for(var i=0;i < 2;i++){ //$scope.suggestions.length
              oauthService.getSuggestionMembers($scope.suggestions[i].slug).then(function(data3){
                console.log(data3);
                for(var j=0;j < data3.users.length;j++){

                  data3.users[j].category = data3.name;
                  
                  if(only){
                    //push the first element
                    only = false;
                    $scope.cards.push(data3.users[j]);
                  }
                  else{
                    $scope.suggested.push(data3.users[j]);
                  }
                  
                }
              })
            }
          });  
      });

      $scope.modal.hide();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.cardSwiped = function(index) {
    newCard = $scope.suggested.shift();
    $scope.cards.push(newCard);
  };

  $scope.next = function(index) {
    $scope.cards.splice(index, 1);
    newCard = $scope.suggested.shift();
    $scope.cards.push(newCard);
  };

  $scope.follow = function(user_id) {
    oauthService.followUser(user_id).then(function(data){
    });  

  };

  $scope.favorite = function(user_id,owner_id) {
    oauthService.favoriteUser(user_id,owner_id).then(function(data){
    });  
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
