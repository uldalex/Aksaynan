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
          breakpoints: {
            1024: {
              perPage: 4,
            },
            768: {
              perPage: 3,
            },
            600: {
              perPage: 1,
            },
          } 
          } ).mount();
  } );


  const $ = require('jquery');  
  var productCardAttr = $('.attribute'); 
  var productCardArrow = $('.attribute-arrow');

  $('.attribute span').on('click', function(){
      $(this).parent(productCardAttr).find('.attribute-arrow').toggleClass('attribute-arrow--open');
      $(this).parent(productCardAttr).find('.attribute__list').toggleClass('attribute__list--open');
  });
  $('.attribute-arrow').on('click', function(){
    $(this).toggleClass('attribute-arrow--open');
    $(this).parent(productCardAttr).find('.attribute__list').toggleClass('attribute__list--open');
});

$(document).mouseup(function (e){ // событие клика по веб-документу
  var div = $(".attribute__list"); // тут указываем ID элемента
  if (!div.is(e.target) // если клик был не по нашему блоку
      && div.has(e.target).length === 0) { // и не по его дочерним элементам
    div.removeClass('attribute__list--open');
    div.parent(productCardAttr).find('.attribute-arrow').removeClass('attribute-arrow--open');
  }
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
  
    $(document).mouseup(function (e){ // событие клика по веб-документу
      var div = $(".some-ves-input"); // тут указываем ID элемента
      if (!div.is(e.target) // если клик был не по нашему блоку
          && div.has(e.target).length === 0) { // и не по его дочерним элементам
        div.removeClass('some-ves-input--open');
      }
    });
 

  