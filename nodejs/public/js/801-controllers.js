var codeSanookControllers = angular.module('codeSanookControllers', ['codeSanookServices']);

codeSanookControllers
    .controller('TopicCtrl', function ($scope,Topic) {
        Topic.getAllTopics(0,10).success(function(result){
            $scope.topics=result.posts;
        }).error(function(){

        });

        Topic.getTags().success(function(result){
            $scope.tags=result;
        }).error(function(){

        });
    })
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    });

function htmlToPlaintext(text) {
    return String(text).replace(/<[^>]+>/gm, '');
}
