"use strict";

// Combined Super Admin JavaScript
$(document).ready(function() {
    // Action handlers
    $("body").on("click", "[data-sa-action]", function(e) {
        e.preventDefault();
        var $this = $(this);
        var target = "";
        
        switch ($this.data("sa-action")) {
            case "search-open":
                $(".search").addClass("search--toggled");
                break;
            case "search-close":
                $(".search").removeClass("search--toggled");
                break;
            case "aside-open":
                target = $this.data("sa-target");
                $this.addClass("toggled");
                $("body").addClass("aside-toggled");
                $(target).addClass("toggled");
                $(".content, .header").append('<div class="sa-backdrop" data-sa-action="aside-close" data-sa-target=' + target + " />");
                break;
            case "aside-close":
                target = $this.data("sa-target");
                $("body").removeClass("aside-toggled");
                $('[data-sa-action="aside-open"], ' + target).removeClass("toggled");
                $(".content, .header").find(".sa-backdrop").remove();
                break;
            case "fullscreen":
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                break;
            case "print":
                window.print();
                break;
            case "login-switch":
                target = $this.data("sa-target");
                $(".login__block").removeClass("active");
                $(target).addClass("active");
                break;
            case "notifications-clear":
                e.stopPropagation();
                var $notifications = $(".top-nav__notifications .listview__item");
                var total = $notifications.length;
                var delay = 0;
                $this.fadeOut();
                $notifications.each(function() {
                    var $item = $(this);
                    setTimeout(function() {
                        $item.addClass("animated fadeOutRight");
                    }, delay += 150);
                });
                setTimeout(function() {
                    $notifications.remove();
                    $this.fadeIn();
                }, delay + 300);
                break;
            case "themes-open":
                $(".themes").addClass("toggled");
                break;
            case "themes-close":
                $(".themes").removeClass("toggled");
                break;
        }
    });

    // Dropdown functionality
    $("body").on("click", "[data-toggle='dropdown']", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        var $dropdown = $this.next(".dropdown-menu");
        
        // Close other dropdowns
        $(".dropdown-menu").not($dropdown).removeClass("show");
        
        // Toggle current dropdown
        $dropdown.toggleClass("show");
    });

    // Close dropdowns when clicking outside
    $(document).on("click", function(e) {
        if (!$(e.target).closest(".dropdown").length) {
            $(".dropdown-menu").removeClass("show");
        }
    });

    // Clock functionality
    function updateClock() {
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');
        
        $(".time__hours").text(hours);
        $(".time__min").text(minutes);
        $(".time__sec").text(seconds);
    }

    // Update clock every second
    updateClock();
    setInterval(updateClock, 1000);

    // Theme functionality
    $("body").on("click", ".themes__item", function(e) {
        e.preventDefault();
        var themeValue = $(this).data("sa-value");
        $("body").attr("data-sa-theme", themeValue);
        $(".themes__item").removeClass("active");
        $(this).addClass("active");
        
        // Store theme preference
        localStorage.setItem("sa-theme", themeValue);
    });

    // Load saved theme
    var savedTheme = localStorage.getItem("sa-theme");
    if (savedTheme) {
        $("body").attr("data-sa-theme", savedTheme);
        $(".themes__item").removeClass("active");
        $(".themes__item[data-sa-value='" + savedTheme + "']").addClass("active");
    }

    // Search functionality
    $(".search__text").on("input", function() {
        var searchTerm = $(this).val().toLowerCase();
        if (searchTerm.length > 0) {
            $(".search__helper").hide();
            $(".search__reset").show();
        } else {
            $(".search__helper").show();
            $(".search__reset").hide();
        }
    });

    // Mobile navigation
    if ($(window).width() < 1200) {
        $(".sidebar").addClass("toggled");
        $(".content").css("margin-left", "0");
    }

    // Responsive handling
    $(window).on("resize", function() {
        if ($(window).width() < 1200) {
            $(".sidebar").addClass("toggled");
            $(".content").css("margin-left", "0");
        } else {
            $(".sidebar").removeClass("toggled");
            $(".content").css("margin-left", "250px");
        }
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Video controls enhancement
    $('video').on('loadedmetadata', function() {
        $(this).closest('.video-container').addClass('loaded');
    });

    // Progress bar animations
    function animateProgressBars() {
        $('.progress-bar').each(function() {
            var $bar = $(this);
            var width = $bar.data('width') || $bar.attr('style').match(/width:\s*(\d+)%/);
            if (width) {
                $bar.css('width', '0%').animate({
                    width: width[1] + '%'
                }, 1000);
            }
        });
    }

    // Animate progress bars when they come into view
    $(window).on('scroll', function() {
        $('.progress-bar').each(function() {
            var $bar = $(this);
            var elementTop = $bar.offset().top;
            var elementBottom = elementTop + $bar.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                if (!$bar.hasClass('animated')) {
                    $bar.addClass('animated');
                    var width = $bar.attr('style').match(/width:\s*(\d+)%/);
                    if (width) {
                        $bar.css('width', '0%').animate({
                            width: width[1] + '%'
                        }, 1000);
                    }
                }
            }
        });
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof $.fn.tooltip !== 'undefined') {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // Initialize popovers if Bootstrap is available
    if (typeof $.fn.popover !== 'undefined') {
        $('[data-toggle="popover"]').popover();
    }

    // Form validation enhancement
    $('form').on('submit', function(e) {
        var $form = $(this);
        var isValid = true;
        
        $form.find('input[required], select[required], textarea[required]').each(function() {
            var $field = $(this);
            if (!$field.val()) {
                $field.addClass('is-invalid');
                isValid = false;
            } else {
                $field.removeClass('is-invalid');
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });

    // Remove validation classes on input
    $('input, select, textarea').on('input change', function() {
        $(this).removeClass('is-invalid');
    });

    // Card hover effects
    $('.card').hover(
        function() {
            $(this).addClass('shadow-lg').removeClass('shadow-sm');
        },
        function() {
            $(this).addClass('shadow-sm').removeClass('shadow-lg');
        }
    );

    // Loading states for buttons
    $('button[type="submit"]').on('click', function() {
        var $btn = $(this);
        var originalText = $btn.text();
        $btn.prop('disabled', true).text('Loading...');
        
        setTimeout(function() {
            $btn.prop('disabled', false).text(originalText);
        }, 2000);
    });

    // Auto-hide alerts
    $('.alert').each(function() {
        var $alert = $(this);
        if (!$alert.hasClass('alert-permanent')) {
            setTimeout(function() {
                $alert.fadeOut();
            }, 5000);
        }
    });

    // Back to top button
    var $backToTop = $('<button class="back-to-top" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: none; background: #007bff; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer;"><i class="zwicon-arrow-up"></i></button>');
    $('body').append($backToTop);

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            $backToTop.fadeIn();
        } else {
            $backToTop.fadeOut();
        }
    });

    $backToTop.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 800);
    });

    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Escape key closes modals/dropdowns
        if (e.keyCode === 27) {
            $('.dropdown-menu').removeClass('show');
            $('.themes').removeClass('toggled');
            $('.search').removeClass('search--toggled');
        }
        
        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 75) {
            e.preventDefault();
            $('.search').addClass('search--toggled');
            $('.search__text').focus();
        }
    });

    // Initialize page loader
    $(window).on('load', function() {
        $('.page-loader').fadeOut();
    });

    // Smooth page transitions
    $('a[href$=".html"]').on('click', function(e) {
        var href = $(this).attr('href');
        if (href && href !== window.location.pathname) {
            e.preventDefault();
            $('.page-loader').fadeIn();
            setTimeout(function() {
                window.location.href = href;
            }, 300);
        }
    });

    // Video presentation enhancements
    $('video').on('play', function() {
        $(this).closest('.card').addClass('video-playing');
    });

    $('video').on('pause', function() {
        $(this).closest('.card').removeClass('video-playing');
    });

    // Statistics counter animation
    function animateCounters() {
        $('.quick-stats__info h2').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            if (countTo) {
                $({ countNum: $this.text() }).animate({
                    countNum: countTo
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                        $this.text(this.countNum);
                    }
                });
            }
        });
    }

    // Trigger counter animation when in view
    $(window).on('scroll', function() {
        $('.quick-stats__info').each(function() {
            var $this = $(this);
            var elementTop = $this.offset().top;
            var elementBottom = elementTop + $this.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                if (!$this.hasClass('animated')) {
                    $this.addClass('animated');
                    animateCounters();
                }
            }
        });
    });

    // Print functionality
    window.printPage = function() {
        window.print();
    };

    // Share functionality
    window.sharePage = function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(function() {
                alert('Link copied to clipboard!');
            });
        }
    };

    // Download functionality
    window.downloadVideo = function() {
        var video = document.querySelector('video');
        if (video && video.src) {
            var link = document.createElement('a');
            link.href = video.src;
            link.download = 'baguio-networking-presentation.mp4';
            link.click();
        }
    };

    console.log('Super Admin scripts loaded successfully!');
});
