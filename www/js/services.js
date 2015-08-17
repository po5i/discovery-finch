angular.module('oauthApp.services', []).factory('oauthService', function($q, $http, $rootScope, $state) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            //$rootScope.OAuth.initialize('BKgnpXxkgDUCmN_pi7o-8paHztg');   //ahora es en ionic platform ready
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
        },
        isReady: function() {
            return (authorizationResult);
        },
        
        connectProvider: function(backend) {
            var deferred = $q.defer();
            
            $rootScope.OAuth.popup(backend)
            .done(function(result) { //cache means to execute the callback if the tokens are already present
                
                    authorizationResult = result;
                    console.log(result);
                    var token;

                    //django
                    if(backend=="twitter")
                        token = "OAuthToken "+result.oauth_token+" "+result.oauth_token_secret;
                    else    //google or facebook
                        token = "OAuthToken "+result.access_token;

                    console.log("consulting me...");
                    result.me().done(function(me) {
                      //alert('Hello ' + me.name);
                      console.log(me);
                    }).fail(function(err) {
                      //todo when the OAuth flow failed
                    });

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
                                authorizationResult = false;
                            }
                        }   
                    });
                    loginPromise.error(function(data, status, headers, config){
                        console.error("Ha ocurrido un error");
                        console.error(data);
                        authorizationResult = false;
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
        
        /*getUser: function () {
            //create a deferred object using Angular's $q service
            var deferred = $q.defer();
            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data)
            });
            //return the promise of the deferred object
            return deferred.promise;
        },*/
        clearCache: function() {
            $rootScope.authenticated = false;
            //OAuth.clearCache();
            authorizationResult = false;
            
            delete $rootScope.auth_data;
            delete $rootScope.authenticated;
        },

        
    };
    
});

