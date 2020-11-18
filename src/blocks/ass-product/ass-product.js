/* global document */

 const ready = require('../../js/utils/documentReady.js');

// ready(function(){
//   
// });
const $ = require('jquery');  
$('.ass-product__stores span, .store-arrow ').on('click', function(){
    $('.store-arrow').toggleClass('store-arrow--open');
    $('.ass-product__stores-list').toggleClass('ass-product__stores-list--open');
});

$('.ass-product__store').on('click', function(){
    var text = $(this).text();
  $('.ass-product__stores-list').removeClass('ass-product__stores-list--open');
  $('.store-arrow').removeClass('store-arrow--open');
  $(this).parents('.ass-product__sort').find('.ass-product__stores span').text(text);
});


$('.ass-product__stores-list li').on('click' , function(){
 $('.store').removeClass('active');
 var Tort = $('.ass-product__tort.active').data('tort');
 var filter = $(this).data('filter');
 $('.ass-product__stores-list li').removeClass('active');
 $(this).addClass('active')
 $(filter + Tort).addClass('active');
 $('.ass-product__sort').toggleClass('ass-product__sort--open')

});
$('.ass-product__tort').on('click' , function(){
    $('.store').removeClass('active');
    var Store = $('.ass-product__stores-list li.active').data('filter');
    var filter = $(this).data('tort');
    $(this).addClass('active');
    $(this).siblings('.ass-product__tort').removeClass('active');
    $(filter + Store).addClass('active');
    $('.ass-product__sort').toggleClass('ass-product__sort--open')


});

$('.ass-product__filter-toggler').on ('click', function(){
    $('.ass-product__sort').toggleClass('ass-product__sort--open')
})

