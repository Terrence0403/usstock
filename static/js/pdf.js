$(document).ready(function () {
    $('.slider').slick({
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    });
});
$('.slider').on('afterChange', function (event, slick, currentSlide) {
    $('.slide-numbers .current').text(currentSlide + 1); // Adjust for 1-based indexing
});
