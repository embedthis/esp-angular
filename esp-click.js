/*
    esp-click.js - The esp-click attribute to conditionally redirect to URLs if the user has the required abilities.

    <tag esp-click="URL" ... />
    <tag esp-click="abilities@URL" ... />
 */

angular.module('esp.click', [])
.directive('espClick', function (Esp, $location, $rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('espClick', function(val) {
                element.on('click', function() {
                    scope.$apply(function() {
                        var abilities;
                        var uri = attrs.espClick;
                        if (uri.indexOf("@") > 0) {
                            var parts = uri.split("@");
                            uri = parts[1];
                            abilities = parts[0].split(/[ ,]/);
                        }
                        if (abilities) {
                            if (Esp.can(abilities)) {
                                $location.path(uri);
                            } else {
                                /* Delay so that the feedback clear won't immediately erase */
                                $timeout(function() {
                                    $rootScope.feedback = { error: "Insufficient Privilege" };
                                }, 0, true);
                            }
                        } else {
                            $location.path(uri);
                        }
                    });
                });
            });
        }
    };
});
