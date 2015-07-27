var codeSanookServices = angular.module('codeSanookServices', []);

codeSanookServices
    .factory('User', function ($http, $q, $state) {
        var objReturn = {};

        objReturn.logIn = function (goToPage) {
            if (goToPage == undefined) {
                goToPage = '';
            }
            var deferred = $q.defer();
            var promise = deferred.promise;
            var req = {
                method: 'PUT',
                url: apiRoot + "/users/login",
                headers: getHeader(),
                data: JSON.stringify(
                    {
                        "userFacebookId": localStorage.userFacebookId,
                        "facebookAccessToken": localStorage.accessToken,
                        "latitude": localStorage.latitude,
                        "longitude": localStorage.longitude,
                        "devicePlatform": "android",
                        "clientVersion": clientVersion
                    })
            };
            $http(req)
                .success(function (result, status, headers, config) {
                    console.log("User LogIn Succeeded Result: %o", result);
                    localStorage.setItem("loggedInUserId", result.userId);
                    localStorage.setItem("apiKey", result.apiKey);
                    localStorage.setItem("isCorrectApiKey", 'true');
                    if (goToPage != '') {
                        $state.go(goToPage);
                    } else {
                        $state.go('tab.matchLatest',{matchId:0,type:'latest'});
                    }
                })
                .error(function (result, status, headers, config) {
                    console.log("User LogIn Failed Result: %o", result);
                    if (status === 412) {
                        objReturn.register();
                    } else {
                        //alert('Something Error!');
                    }
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };
        objReturn.fbLogIn = function (goToPage) {
            if (goToPage == undefined) {
                goToPage = '';
            }
            var deferred = $q.defer();
            var promise = deferred.promise;

            openFB.init({appId: facebookAppId});
            openFB.login(function (response) {
                if (response.status === 'connected') {
                    console.log('Facebook login succeeded, got access token: ' + response.authResponse.token);
                    localStorage.setItem("accessToken", response.authResponse.token);
                    openFB.api({
                        path: '/me',
                        params: {
                            access_token: localStorage.accessToken
                        },
                        success: function (data) {
                            console.log("fbLogIn Succeeded : o%", data);
                            localStorage.setItem("userFacebookId", data.id);
                            objReturn.logIn(goToPage).success(function () {
                                deferred.resolve();
                            });
                        },
                        error: function (error) {
                            console.log("fbLogIn Failed: o%", error);
                            deferred.reject();
                        }
                    });
                } else {
                    //alert('Facebook login failed: ' + response.error);
                    deferred.reject();
                }
            }, {scope: facebookPermissionScopes});
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };
        objReturn.register = function () {
            var req = {
                method: 'POST',
                url: apiRoot + "/users",
                headers: getHeader(),
                data: JSON.stringify(
                    {
                        "userFacebookId": localStorage.userFacebookId,
                        "facebookAccessToken": localStorage.accessToken,
                        "latitude": localStorage.latitude,
                        "longitude": localStorage.longitude,
                        "devicePlatform": "android",
                        "clientVersion": clientVersion
                    })
            };
            $http(req)
                .success(function (result) {
                    console.log("User Register Succeeded Result: %o", result);
                    localStorage.setItem("isFinishRegistration", 'false');

                    openFB.api({
                        //https://graph.facebook.com/me/friends?limit=1000&access_token=...
                        path: '/me/friends',
                        params: {
                            limit: 1000,
                            access_token: localStorage.accessToken
                        },
                        success: function (data) {
                            var frienIds=[];
                            $.each(data.data,function(i,e){
                                frienIds.push(e.id);
                            });
                            objReturn.rewardExistingFriends(frienIds);
                        },
                        error: function (error) {
                            //alert(error);
                        }
                    });

                    objReturn.logIn('onboarding.registration');
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                    console.log("User Register Failed jqXHR: %o", jqXHR);
                    console.log("User Register Failed textStatus: %s", textStatus);
                    console.log("User Register Failed errorThrown: %s", errorThrown);
                    var result = jqXHR.responseJSON;
                    objReturn.logIn();
                });
        };
        objReturn.get = function () {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var req = {
                method: 'GET',
                url: apiRoot + "/users/" + localStorage.loggedInUserId,
                headers: getHeader()
            };
            $http(req)
                .success(function (result, status, headers, config) {
                    console.log('getUser Succeeded: o%', result);
                    deferred.resolve(result);
                })
                .error(function (result, status, headers, config) {
                    console.log('getUser Failed: o%', result);
                    if (status === 401) {
                        localStorage.setItem("isCorrectApiKey", 'false');
                        deferred.reject('apiKeyFalse');
                    } else {
                        deferred.reject('error' + status);
                    }
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };
        objReturn.editProfile = function (data) {
            console.log('Profile Obj: o%', data);
            if (localStorage.getUser !== undefined) {
                var getUser = JSON.parse(localStorage.getUser);
                if (data.height !== undefined && (data.height < 140 || data.height > 220 || data.height == '')) {
                    data.height = getUser.height;
                }
                if (data.ethnicity !== undefined && data.ethnicity == '') {
                    data.ethnicity = getUser.ethnicity;
                }
                if (data.religion !== undefined && data.religion == '') {
                    data.religion = getUser.religion;
                }
                if (data.work !== undefined) {
                    if (data.work.occupation !== undefined && data.work.occupation == '') {
                        data.work.occupation = getUser.work.occupation;
                    }
                    if (data.work.employer !== undefined && data.work.employer == '') {
                        data.work.employer = getUser.work.employer;
                    }
                }
                if (data.educations !== undefined) {
                    $.each(data.educations, function (i, e) {
                        if (e.name == '') {
                            data.educations[i].name = getUser.educations[i].name;
                        }
                    });
                }
                if (data.aboutMe !== undefined && data.aboutMe == '') {
                    data.aboutMe = getUser.aboutMe;
                }
            }
            var deferred = $q.defer();
            var promise = deferred.promise;
            var req = {
                method: 'PUT',
                url: apiRoot + "/users/" + localStorage.loggedInUserId,
                headers: getHeader(),
                data: JSON.stringify(data)
            };
            $http(req)
                .success(function (result, status, headers, config) {
                    console.log("User Edit Profile Succeeded Result: %o", result);
                    deferred.resolve(result);
                })
                .error(function (result, status, headers, config) {
                    console.log("User Edit Profile Failed Result: %o", result);
                    deferred.reject(result);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };
        objReturn.uploadPhoto = function (base64Data, contentType) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var blob = base64toBlob(base64Data, contentType);

            var formData = new FormData();
            formData.append('uploadedFile', blob, 'abc.jpeg');
            formData.append('userId', localStorage.loggedInUserId);

            var req = {
                method: 'POST',
                url: apiRoot + "/profilephotos",
                headers: {'Content-Type': undefined},
                cache: false,
                data: formData
            };
            $http(req)
                .success(function (result, status, headers, config) {
                    console.log("User Upload Photo Succeeded Result: %o", result);
                    deferred.resolve(result);
                })
                .error(function (result, status, headers, config) {
                    console.log("User Upload Photo Failed Result: %o", result);
                    deferred.reject(result);
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };

        return objReturn;
    })

    .factory('Topic', function ($http, $q) {
        var objReturn = {};

        objReturn.getAllTopics = function (pageIndex,itemsPerPage) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var req = {
                method: 'GET',
                url: 'http://pro.codesanook.com/cs/api.ashx/posts/'+pageIndex+'/'+itemsPerPage+'?sort=asc&api_key=special-key',
                headers: getHeader()
            };
            $http(req)
                .success(function (result, status, headers, config) {
                    console.log("getAllTopics Succeeded Result: %o", result);
                    deferred.resolve(result);
                })
                .error(function (result, status, headers, config) {
                    console.log("getAllTopics Failed Result: %o", result);
                    console.log("getAllTopics Failed Status: %o", status);
                    deferred.reject();
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };


        objReturn.response = function (matchId, response) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var req = {
                method: 'PUT',
                url: apiRoot + "/matches/" + matchId,
                headers: getHeader(),
                data: JSON.stringify(
                    {
                        "userId": localStorage.loggedInUserId,
                        "userResponse": response
                    })
            };
            $http(req)
                .success(function (result) {
                    console.log("response " + response + " Succeeded Result: %o", result);
                    deferred.resolve(response);
                })
                .error(function (result) {
                    console.log("response " + response + " Failed Result: %o", result);
                    deferred.reject();
                });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        };

        return objReturn;
    })

    .factory('General', function (User) {
        var objReturn = {};

        return objReturn;
    });

function getHeader() {
    var header = {
        'apiKey': 'special-key',
        'userId': '123',
        'Content-Type': 'application/json; charset=UTF-8'
    };
    return header;
};

function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
};

function registerParsePushNoti(channel) {
    if(runningInCordova) {
        // You'll get the appId and Clinet Key from Parse.com
        parsePlugin.initialize(parseAppId, parseClientKey, function () {
            parsePlugin.subscribe(channel, function () {
                parsePlugin.getInstallationId(function (id) {
                    //alert(id);
                    //alert(channel);
                    //Now you can construct an object and save it to your own services, or Parse, and corrilate users to parse installations
                    /*var install_data = {
                     installation_id: id,
                     channels: ['SampleChannel']
                     }*/
                }, function (e) {
                    //alert('error');
                });
            }, function (e) {
                //alert('error');
            });
        }, function (e) {
            //alert('error');
        });
    }
};

function registerParsePushNoti2(channel) {
    if(runningInCordova) {
        //https://github.com/manishiitg/parse-push-plugin
        ParsePushPlugin.register({
                appId: parseAppId,
                clientKey: parseClientKey//,
                /*eventKey:"myEventKey"*/
            }, //will trigger receivePN[pnObj.myEventKey]
            function () {
                alert('successfully registered device!');
                ParsePushPlugin.getInstallationId(function (id) {
                    alert(id);
                }, function (e) {
                    alert('error');
                });

                ParsePushPlugin.getSubscriptions(function (subscriptions) {
                    alert(subscriptions);
                }, function (e) {
                    alert('error');
                });

                ParsePushPlugin.subscribe(channel, function (msg) {
                    alert('OK');
                }, function (e) {
                    alert('error');
                });

                ParsePushPlugin.on('receivePN', function (pn) {
                    alert('yo i got this push notification:' + JSON.stringify(pn));
                });


            }, function (e) {
                alert('error registering device: ' + e);
            });
    }
};

function geoLocation(){
    navigator.geolocation.getCurrentPosition(function(position) {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
    });
};