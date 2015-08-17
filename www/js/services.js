angular.module('oauthApp.services', []).factory('oauthService', function($q, $http, $rootScope, $state) {

    $rootScope.authorizationResult = false;
    
    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            //$rootScope.OAuth.initialize('BKgnpXxkgDUCmN_pi7o-8paHztg');   //ahora es en ionic platform ready
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
        },
        isReady: function() {
            return ($rootScope.authorizationResult);
        },
        
        connectProvider: function(backend) {
            var deferred = $q.defer();
            
            $rootScope.OAuth.popup(backend)
            .done(function(result) { //cache means to execute the callback if the tokens are already present
                
                    $rootScope.authorizationResult = result;
                    console.log(result);
                    var token;

                    //django
                    if(backend=="twitter")
                        token = "OAuthToken "+result.oauth_token+" "+result.oauth_token_secret;
                    else    //google or facebook
                        token = "OAuthToken "+result.access_token;


                    var api_backend;
                    if(backend=="google")
                        api_backend = "google-oauth2";
                    else
                        api_backend = backend;

                    
                    $http.defaults.useXDomain = true;
                    /*var loginPromise = $http.post($rootScope.api_url+'/api-token/login/' + api_backend + '/',"",{
                        headers: {'Authorization': token}
                    });

                    loginPromise.success(function(data, status, headers, config){
                        if(status > 400){
                            alert("Ha ocurrido un error "+status);
                        }
                        else{
                            //console.log(data);
                            deferred.resolve(data);

                            if(data.id){
                                $rootScope.auth_data = data;                                
                                $rootScope.authenticated = true;

                            }
                            else{
                                $rootScope.authorizationResult = false;
                            }
                        }   
                    });
                    loginPromise.error(function(data, status, headers, config){
                        console.error("Ha ocurrido un error");
                        console.error(data);
                        $rootScope.authorizationResult = false;
                        deferred.resolve(data);
                    });*/

                    deferred.resolve(result);
            })
            .fail(function (err) {
              //handle error with err
              alert("Ha ocurrido un error: "+err);
            });
            return deferred.promise;
        },
        
        
        clearCache: function() {
            $rootScope.authenticated = false;
            //OAuth.clearCache();
            $rootScope.authorizationResult = false;
            
            delete $rootScope.auth_data;
            delete $rootScope.authenticated;
        },

        getCurrentUser: function() {
            var deferred = $q.defer();

            var promise = $rootScope.authorizationResult.me().done(function(me) {
                deferred.resolve(me);
                console.log(me);
            }).fail(function(err) {
              //todo when the OAuth flow failed
            });
            return deferred.promise;
        },

        getSuggestions: function () {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = $rootScope.authorizationResult.get('/1.1/users/suggestions.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data);
                console.log(data);
            });
            //return the promise of the deferred object
            return deferred.promise;
        },

        getSuggestionMembers: function (slug) {
            console.log("consulting: "+slug)
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = $rootScope.authorizationResult.get('/1.1/users/suggestions/'+slug+'.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data);
                //console.log(data);
            });
            //return the promise of the deferred object
            return deferred.promise;
        },

        
    };
    
});

