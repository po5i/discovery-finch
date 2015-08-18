// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','oauthApp.services','ionic.contrib.ui.tinderCards','LocalStorageModule'])

.run(function($ionicPlatform, $rootScope, localStorageService, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(typeof window.OAuth !== 'undefined'){
      //alert(window.OAuth.getVersion());
      $rootScope.OAuth = window.OAuth;
      $rootScope.OAuth.initialize('FGNSDxRAba_MdHNNRUIKxoGapxs');
      var storage_backend = localStorageService.get('backend');
      if(storage_backend)
          authorizationResult = $rootScope.OAuth.create(storage_backend);
    }
    else{
      //console.log("not mobile");
      $.getScript( "lib/oauth.js", function() {
        $rootScope.OAuth = OAuth;        
        $rootScope.OAuth.initialize('FGNSDxRAba_MdHNNRUIKxoGapxs');
        var storage_backend = localStorageService.get('backend');
        if(storage_backend)
            authorizationResult = $rootScope.OAuth.create(storage_backend);
      });
    }

    $rootScope.authenticated = false;
    $rootScope.redirect = null;
  });

  
  // persistent session
  //var currentUser = localStorageService.get('authorizationResult');
  //if(currentUser){
  //  $rootScope.authorizationResult = currentUser;
  //  $rootScope.authenticated = true;
  //}

  //loading
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });
  
})

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

  localStorageServiceProvider.prefix = 'dfinch';

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      },
      data: {
        requireLogin: true
      }
    })

    /*.state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html'
        }
      },
      data: {
        requireLogin: false
      }
    })*/

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/browse');
});
