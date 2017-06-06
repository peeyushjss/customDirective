(function () {
    'use strict';

    angular.module('widget.avgtalkduration', [])
            .controller('avgtalkdurationCtrl',
                    function ($scope, chartSettings, $localStorage, $rootScope, $interval, avgTalkduration) {

//            var user = $localStorage.comstice_user;
                        var final_csq_name = [];
                        var selected_rep = [];
                        var promise_timeout;
                        var self = this;
                        self.user = $localStorage.comstice_user;
                        $scope.boxName = 'avgtalkduration';
                        $scope.WidgetTimeSettings = true;
                        $scope.showDebugicon = false;
                        $scope.threshholdSetting = false;
                        self.avgTalkduration = 0;

                        chartSettings.populateSettings_csqs($scope.boxName, function (data) {
                            $scope.popupSetting = data;
                        });

                        initalizeWidget();

                        self.showSetting = function () {
                            $scope.$broadcast('duallist', $scope.boxName);
                        };

                        chartSettings.getSavedSettings($scope.boxName, function (res) {
                            if (res != 'null' && res != 'undefined') {
                                selected_rep = res;
                            } else {
                                selected_rep = false;
                            }
                        });

                        $rootScope.$on('popup_selected', function () {
                            initalizeWidget();
                        });

                        function initalizeWidget() {
                            chartSettings.getWidgetName($scope.boxName, function (widget) {
                                if (widget.length > 0 && widget != 'null' && widget != 'undefined') {
                                    self.widgetName = widget;
                                } else {
                                    self.widgetName = "AVERAGE TALK TIME";
                                }
                            });
                            $scope.divWidth = $("#avgtalktime").closest("#divwidth").width();
                            $scope.divheight = $("#avgtalktime").closest("#divwidth").height();
                            $("#avgtalktime").closest("#divwidth").css("border", "none");
//                            chartSettings.isLoggedin(user, function () {
                            final_csq_name = false;
                            chartSettings.getSavedSettings($scope.boxName, function (res) {
                                if (res != 'null' && res != 'undefined') {
                                    selected_rep = res;
                                } else {
                                    selected_rep = false;
                                }
                                if (selected_rep.length > 0) {
                                    final_csq_name = selected_rep;
                                }
                                avgTalkduration.getChartData(final_csq_name, $scope.live, function (avgTalkduration) {
                                    chartSettings.getSaveThreshhold($scope.boxName + '_threshhold', function (resp) {
                                        if (resp && resp != 'null' && resp != 'undefined') {
                                            if (typeof resp == 'string')
                                                $scope.treshold = JSON.parse(resp);
                                            else
                                                $scope.treshold = resp;
                                            if ($scope.treshold.threshold1 >= 0 && avgTalkduration >= $scope.treshold.threshold1 && avgTalkduration < $scope.treshold.threshold2) {
                                                $("#avgtalktime").closest("#divwidth").css("background-color", "#FF8C00");
                                            } else if (avgTalkduration >= $scope.treshold.threshold2) {
                                                $("#avgtalktime").closest("#divwidth").css("background-color", "#FF6347");
                                            }
                                        }
                                        self.avgTalkduration = avgTalkduration;
                                    });
                                });
                            });
//                            });
                        }
                        self.refreshChart = function () {
                            promise_timeout = $interval(function () {
                                initalizeWidget();
                            }, 1000 * 10);
                        };
                        self.refreshChart();
                        $scope.$on('$destroy', function () {
                            $interval.cancel(promise_timeout);
                        });
                        self.debug = function () {
                            $("#" + $scope.boxName + "Y").modal('show');
                            $scope.apis = avgTalkduration.generateApi();
                            $scope.$broadcast($scope.boxName, {
                                data: $scope.apis
                            });
                        };
                        $scope.$on("unableDebug", function (event, response) {
                            $scope.showDebugicon = response.basicCheckValue;
                        });
                    });

})();