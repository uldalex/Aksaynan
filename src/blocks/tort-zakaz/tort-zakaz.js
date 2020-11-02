/* global document */

// const ready = require('../../js/utils/documentReady.js');

// ready(function(){
//   
// });
const $ = require('jquery');  
$('.tort-zakaz-cat').on('click' , function(){
    $('.cat').removeClass('active');
    var filter = $(this).data('cat');
    $(this).addClass('active');
    $(this).siblings('.tort-zakaz-cat').removeClass('active');
    $(filter).addClass('active');


});
