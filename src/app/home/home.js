var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
 
};



/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.home', [
  'titleService',
'ngResource'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $routeProvider ) {
  $routeProvider.when( '/home', {
    controller: 'HomeCtrl',
    templateUrl: 'home/home.tpl.html'
  });
})


.directive('todoFocus', function todoFocus($timeout) {
        return function (scope, elem, attrs) {
                scope.$watch(attrs.todoFocus, function (newVal) {
                        if (newVal) {
                                $timeout(function () {
                                        elem[0].focus();
                                }, 0, false);
                        }
                });
        };
})

.directive('todoBlur', function () {
        return function (scope, elem, attrs) {
                elem.bind('blur', function () {
                        scope.$apply(attrs.todoBlur);
                });
        };
})
/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, titleService , $resource, $location, filterFilter, $http, $q) {
    var _ = window._;  
    $scope.options = {
        user:undefined
    };

    titleService.setTitle( 'Home' );
    console.log(3000);
    //var urlApiBase = 'http://localhost:port/api';
    //var urlApiBase = 'http://192.168.10.178:port/api';
    var urlApiBase = 'http://hidden-springs-9866.herokuapp.com/api';


    var portN = ':8080';
    var userApi = '/users/:userId';
    var User = $resource(urlApiBase + userApi, {port:portN}, { });
    
    var choreApi = '/chores/:choreId';
    var Chore = $resource(urlApiBase + choreApi, {port:portN}, { });
    console.log(4000);

    var scoreApi = '/scores/:scoreId';
    var Score = $resource(urlApiBase + scoreApi, {port:portN, scoreId:'@id'}, {
        update: {method:"PUT"}
     });

    var resultsApi = '/results';
    var Results = $resource(urlApiBase + resultsApi, {port:portN}, { });



    $scope.resultado = Results.get();

    var STORAGE_ID = 'todos-angularjs';
    //todoMVC 

    console.log(6000);

    //debugger;

    //Copied from todomvc

    $scope.newTodo = '';
    $scope.editedTodo = null;

    /*
    $scope.$watch('todos', function () {
        $scope.remainingCount = filterFilter(todos, { completed: false }).length;
        $scope.completedCount = todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
        todoStorage.put(todos);
    }, true);
    */

    if ($location.path() === '') {
        $location.path('/');
    }

    $scope.location = $location;


    console.log(7000);
    $scope.addTodo = function () {
        var newTodo = $scope.newTodo.trim();
        if (!newTodo.length) {
            return;
        }
        var newChore = new Chore({description:newTodo});
        
        newChore.$save({}, function(u, responseHeaders) {   
                console.log('save chore');
                console.log(u);
                console.log(responseHeaders);
                $scope.newTodo = '';
                updateAll();
        });

    };

    $scope.check = function (todo) {
        $scope.editedTodo = todo;
    };

    console.log(8000);
    $scope.doneEditing = function (todo) {
        $scope.editedTodo = null;
        todo.title = todo.title.trim();

        if (!todo.title) {
            //Chore.remove()
            $scope.removeTodo(todo);
        }
    };

    $scope.removeTodo = function (todo) {
        chores.splice(chores.indexOf(todo), 1);
    };

    var hardcoded_period = 3;
    var hardcoded_group = 1;

    $scope.setScoreDificulty = function (chore, points) {
        console.log('savingDificulty');
        console.log({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period, weight:points});
        if(chore.score.fakeScore){
            var newScore = new Score({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period, weight:points});
            newScore.$save({}, function(u, responseHeaders) {
                $scope.resultado = Results.get();
                updateAll();
                console.log('saved score');
                console.log(u);
            });
        }else{
            Score.get({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period}, function(resp){
                console.log('respuesta de get grupal');
                console.log(resp);
                
                Score.get({scoreId:resp.results[0].id}, function(respScore){
                    console.log('respuesta de get individual');
                    console.log(respScore);
                    respScore.weight = points;
                    respScore.$update({},function(){
                        $scope.resultado = Results.get();
                        updateAll();
                    });
                });
            });
        }
    };

    $scope.setLike = function (chore, points) {
        console.log('savingLike');
        if(chore.score.fakeScore){
            var newScore = new Score({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period, like:true});
            newScore.$save({}, function(u, responseHeaders) {
                $scope.resultado = Results.get();
                updateAll();
                console.log('saved score');
                console.log(u);
            });
        }else{
            Score.get({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period}, function(resp){
                console.log('respuesta de get grupal');
                console.log(resp);
                
                Score.get({scoreId:resp.results[0].id}, function(respScore){
                    console.log('respuesta de get individual');
                    console.log(respScore);
                    respScore.like = !chore.score.like;
                    respScore.$update({},function(){
                        $scope.resultado = Results.get();
                        updateAll();
                    });
                });
            });
        }
    };

    $scope.clearCompletedTodos = function () {
        $scope.chores = chores = chores.filter(function (val) {
            return !val.completed;
        });
    };

    console.log(9000);
    $scope.markAll = function (completed) {
        chores.forEach(function (todo) {
            todo.completed = completed;
        });
    };

    var extractAndSetId = function (obj){
        var url = obj.url;
        var objId = parseInt (url.substring(url.substring(0, url.length -1).lastIndexOf('/')+1, url.length), 10);
        obj.id = objId;
    };

   function setResources(type) {
       var d = $q.defer();
        switch(type){
            case 'Score':
                Score.get(function(resp) {
                    $scope.scores = resp.results;
                    d.resolve();
                });
                break;
            case 'Chore':
                Chore.get(function(resp) {
                    $scope.chores = resp.results;
                    _.each($scope.chores, extractAndSetId);
                    d.resolve();
               });
                break;
            case 'User':
                $scope.users = User.get(function (resp){
                    console.log('get de users');
                    console.log(resp);
                    $scope.users = resp.results; 
                    _.each($scope.users, extractAndSetId);
                    
                });
                break;
        }
       return d.promise;
    }

    setResources('User');

    
    var attachScoresToChores = function(){
        /*
        var userScores = _.filter($scope.scores, function(score){
            return (score.user === $scope.options.userId);
        });
        */
        _.each($scope.chores, function(chore){
            var choreScore = _.find($scope.scores, function(score) {
              //debugger;
              return (score.chore == chore.id) && (score.user == $scope.options.user.id);
            });
            console.log('foundScore!');
            console.log(choreScore); 
            if(typeof choreScore === 'undefined'){
                choreScore = {
                    chore: chore.id,
                    count: 0,
                    group: 1,
                    like: false,
                    period: 3,
                    user: $scope.options.user.id,
                    weight: 0,
                    fakeScore: true
                }; 
            }
            chore.score = choreScore;
        });
    };

    $scope.toggleDone = function(chore){
        console.log('toggleDone');
        if(chore.score.fakeScore){
            var newScore = new Score({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period, count:1});
            newScore.$save({}, function(u, responseHeaders) {
                $scope.resultado = Results.get();
                updateAll();
                console.log('saved score');
                console.log(u);
            });
        }else{
            Score.get({chore:chore.id, group:hardcoded_group, user:$scope.options.user.id, period:hardcoded_period}, function(resp){
                console.log('respuesta de get grupal');
                console.log(resp);
                
                Score.get({scoreId:resp.results[0].id}, function(respScore){
                    console.log('respuesta de get individual');
                    console.log(respScore);
                    
                    respScore.count = chore.score.count ? 0 : 1;
                    respScore.$update({},function(){
                        $scope.resultado = Results.get();
                        updateAll();
                    });
                });
            });
        }
        
    };


    var updateAll = function(){
        $q.all([
          setResources('Score'),
          setResources('Chore')
        ]).then(function(data) {
            console.log('Score & chore resolved!');    
            console.log('Chore');
            console.log($scope.chores);
            console.log('Score');
            console.log($scope.scores);
            attachScoresToChores();

        }); 
    };
    
    $scope.userChanged = function(){

        console.log('user changed!');
        updateAll();
        
    };

    updateAll();

})

;

