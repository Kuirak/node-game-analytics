'use strict';
/**
 * Created by Drako on 07.04.2014.
 */
var app = angular.module('RTA',['ngSails','ui.router']);

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
        templateUrl:'/partials/editor.html'
    })
});
