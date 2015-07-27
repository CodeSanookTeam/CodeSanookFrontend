var codeSanookControllers = angular.module('codeSanookControllers', ['codeSanookServices']);

codeSanookControllers
    .controller('TopicCtrl', function ($scope,Topic) {
        $scope.aaa='bbbv';
        Topic.getAllTopics(0,10).success(function(result){
            $scope.topics=result.posts;
        }).error(function(){

        });
    });
