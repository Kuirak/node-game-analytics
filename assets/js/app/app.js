'use strict';
/**
 * Created by Drako on 07.04.2014.
 */
var app = angular.module('RTA',['sails.io','ui.router','d3','ngDragDrop']);

app.config(function($stateProvider,$locationProvider){
    $locationProvider.html5Mode(true);
    $stateProvider.state("home",{
        url:'/',
        controller:'MainController',
        templateUrl:'/partials/home.html'
    }).state("dashboard",{
        url:'/dashboard',
        templateUrl:'/partials/dashboard.html'
    }).state('editor',{
        url:'/editor',
        templateUrl:'/partials/editor.html',
        controller:'EditorController'
    }).state('types',{
        url:'/types',
        templateUrl:'/partials/types.html',
        controller:'TypeController',
        resolve:{
            types:function($sailsSocket){
                return $sailsSocket.get('/api/type');
            }
        }
    }).state('types.params',{
            url:'/:type',
            templateUrl:'/partials/types.params.html',
            controller:'TypeController'

    })
});

