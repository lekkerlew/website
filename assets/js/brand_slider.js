$(document).ready(function(){

if($('#brands_ee').length)
{
var brands_EE_Slider = $('#brands_ee');

brands_EE_Slider.owlCarousel(
{
loop:true,
autoplay:true,
autoplayTimeout:5000,
nav:false,
dots:false,
autoWidth:true,
items:8,
margin:42
});

if($('#brands_ee_prev').length)
{
var prev = $('#brands_ee_prev');
prev.on('click', function()
{
brands_EE_Slider.trigger('prev.owl.carousel');
});
}

if($('#brands_ee_next').length)
{
var next = $('#brands_ee_next');
next.on('click', function()
{
brands_EE_Slider.trigger('next.owl.carousel');
});
}
}



if($('#memberships_ee').length)
{
var memberships_EE_Slider = $('#memberships_ee');

memberships_EE_Slider.owlCarousel(
{
loop:true,
autoplay:true,
autoplayTimeout:5000,
nav:false,
dots:false,
autoWidth:true,
items:8,
margin:42
});

if($('#memberships_ee_prev').length)
{
var prev = $('#memberships_ee_prev');
prev.on('click', function()
{
memberships_EE_Slider.trigger('prev.owl.carousel');
});
}

if($('#memberships_ee_next').length)
{
var next = $('#memberships_ee_next');
next.on('click', function()
{
memberships_EE_Slider.trigger('next.owl.carousel');
});
}
}


});
