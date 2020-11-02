/* global document */

 const ready = require('../../js/utils/documentReady.js');

// ready(function(){
//   
// });

document.addEventListener( 'DOMContentLoaded', function () {
      
    var splide =new Splide( '#new-product', {
          perPage: 4,
          perMove: 1,
          autoplay: false,
          } ).mount();
  } );


  const $ = require('jquery');  
  var productCardAttr = $('.attribute'); 
  var productCardArrow = $('.attribute-arrow');

  $('.attribute-arrow, .attribute span').on('click', function(){
      $('.attribute-arrow').toggleClass('attribute-arrow--open');
      $(this).parent(productCardAttr).find('.attribute__list').toggleClass('attribute__list--open');
  });

  $('.attribute__item').on('click', function(){
      var text = $(this).text();
    $(this).parent('.attribute__list').removeClass('attribute__list--open');
    $(this).parents(productCardAttr).find('.attribute-arrow').removeClass('attribute-arrow--open');
    $(this).parents('.attribute').find('span').text(text);
  });

  $('.deckription-link').on('click', function(){
    $(this).addClass('deckription-link--active');
    $(this).siblings('.edit-link').removeClass('edit-link--active');
    $(this).parents('.product-card__content').find('.deckription-tab').addClass('deckription-tab--open')
    $(this).parents('.product-card__content').find('.edit-tab').removeClass('edit-tab--open')   
  });
  $('.edit-link').on('click', function(){
    $(this).addClass('edit-link--active');
    $(this).siblings('.deckription-link').removeClass('deckription-link--active');
    $(this).parents('.product-card__content').find('.edit-tab').addClass('edit-tab--open')
    $(this).parents('.product-card__content').find('.deckription-tab').removeClass('deckription-tab--open')   
  });

  $('.some-ves').on('click', function(){
    $(this).parent('.product-card__ves-list').find('.some-ves-input').addClass('some-ves-input--open');
    $(this).parent('.product-card__ves-list').find('.close').addClass('close--open');
  });

  $('.product-card__ves-list .close').on('click', function(){
    $(this).parent('.product-card__ves-list').find('.some-ves-input').removeClass('some-ves-input--open');
    $(this).removeClass('close--open');
  });


  