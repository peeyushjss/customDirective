(function () {
    'use strict';

    angular.module('widget.avgtalkduration')
            .factory('avgTalkduration', function ($http, $q, myWidgetRepository) {

                var service = {};
                var live_url;
                var api_arr = [];

                service.generateApi = function (api, method) {
                    if (angular.isDefined(api) && angular.isDefined(method)) {
                        var obj = {
                            "api": api,
                            "method": method
                        };
                        api_arr.push(obj);
                        api_arr = _.uniq(api_arr, function (item, key, a) {
                            return item.a;
                        });
                    } else {
                        return api_arr;
                    }
                };


                service.avg_talk_time = function (liveUrl) {
                    var self = this;
                    if (angular.isDefined(liveUrl)) {
                        live_url = liveUrl;
                    }
                    var deferred = $q.defer();
                    var ret = myWidgetRepository.checkData('avg_talk_time', deferred);
                    if (ret === 1) {
                        return $q.when(myWidgetRepository.getData('avg_talk_time'));
                    } else if (ret === 2) {
                        return deferred.promise;
                    } else {
                        if (live_url == 'true') {
                            var url = setting.global.url + setting.widget.avg_talk_time.api_url + '?buster=' + new Date().getTime();
                        } else {
                            url = '../data/widget/' + setting.widget.avg_talk_time.data_file + '?buster=' + new Date().getTime();
                        }
                        self.generateApi(url, 'get');
                        $http.get(url).success(function (result) {
                            myWidgetRepository.setData('avg_talk_time', result);
                            deferred.resolve(result);
                        }).error(function () {
                            deferred.reject('Error is occured!');
                        });
                        return deferred.promise;
                    }
                };

                service.getChartData = function (final_csq_name, live, cb) {
                    var self = this;
                    if (final_csq_name) {
                        var final_csq_namel = final_csq_name.split(",");
                    }
                    self.avg_talk_time(live).then(function (result) {
                        var obj = setting.widget.avg_talk_time.object;
                        var data = result[obj];
                        var name = setting.widget.avg_talk_time.fields.name;
                        var avgtalkduration = setting.widget.avg_talk_time.fields.avgtalkduration;
                        var callshandled = setting.widget.avg_talk_time.fields.callshandled;
                        var callsreceived = 0,
                                v = 0,
                                value = 0,
                                values = [],
                                total_sum = 0;

                        if (final_csq_namel) {
                            for (var a = 0; a < data.length; a++) {
                                var row = data[a];
                                for (var b = 0; b < final_csq_namel.length; b++) {
                                    if (final_csq_namel[b].replace(/([~!@#$%^&*()_+-=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_') == row[name].replace(/([~!@#$%^&*()_+-=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_')) {
                                        values.push(row);
                                    }
                                }
                            }
                        } else {
                            values = data;
                        }

                        for (var a = 0; a < values.length; a++) {
                            var new_data = values[a];
                            callsreceived = callsreceived + new_data[callshandled];
                            total_sum += (new_data[avgtalkduration] / 1000) * new_data[callshandled];
                        }

                        if (callsreceived > 0) {
                            v = total_sum / callsreceived;
                            value = v.toFixed(2);
                        } else {
                            value = 0;
                        }

                        if (cb) {
                            cb(value);
                        }
                    });
                };
                return service;
            });

})();