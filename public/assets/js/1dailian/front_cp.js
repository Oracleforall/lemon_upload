/**
 * 前台控制面板
 * @author     Mark <zhaody901@126.com>
 * @copyright  Copyright (c) 2013-2015 lemon team
 */
define(function (require) {
	var $ = require('jquery');
	var util = require('lemon/util');
	require('lemon/cp');
	var dialog = require('jquery.art-dialog');
	var moment = require('moment');
	require('pace');
	require('jquery.bt3');
	require('jquery.metis-menu');
	require('jquery.slim-scroll');
	var toastr = require('jquery.toastr');
	var helper = require('1dailian/helper');
	require('jquery.uniform');

	// inspinia 2.0
	$(function () {

		// bt3 提示
		$('[data-toggle="tooltip"]').tooltip();

		// Add body-small class if window less than 768px
		if ( $(this).width() < 769 ) {
			$('body').addClass('body-small')
		} else {
			$('body').removeClass('body-small')
		}

		// MetsiMenu
		$('#side-menu').metisMenu();

		// Collapse ibox function
		$('.collapse-link').click(function () {
			var ibox = $(this).closest('div.ibox');
			var button = $(this).find('i');
			var content = ibox.find('div.ibox-content');
			content.slideToggle(200);
			button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
			ibox.toggleClass('').toggleClass('border-bottom');
			setTimeout(function () {
				ibox.resize();
				ibox.find('[id^=map-]').resize();
			}, 50);
		});

		// Close ibox function
		$('.close-link').click(function () {
			var content = $(this).closest('div.ibox');
			content.remove();
		});

		// Close menu in canvas mode
		$('.close-canvas-menu').click(function () {
			$("body").toggleClass("mini-navbar");
			helper.smoothly_menu();
		});

		// Open close right sidebar
		$('.right-sidebar-toggle').click(function () {
			$('#right-sidebar').toggleClass('sidebar-open');
		});

		// Initialize slimscroll for right sidebar
		$('.sidebar-container').slimScroll({
			height : '100%',
			railOpacity : 0.4,
			wheelStep : 10
		});

		// Small todo handler
		$('.check-link').click(function () {
			var button = $(this).find('i');
			var label = $(this).next('span');
			button.toggleClass('fa-check-square').toggleClass('fa-square-o');
			label.toggleClass('todo-completed');
			return false;
		});

		// Minimalize menu
		$('.navbar-minimalize').click(function () {
			$("body").toggleClass("mini-navbar");
			helper.smoothly_menu();
		});

		// Tooltips demo
		$('.tooltip-demo').tooltip({
			selector : "[data-toggle=tooltip]",
			container : "body"
		});

		// Move modal to body
		// Fix Bootstrap backdrop issu with animation.css
		$('.modal').appendTo("body");

		// Full height of sidebar

		helper.fix_height();

		// Fixed Sidebar
		$(window).bind("load", function () {
			if ( $("body").hasClass('fixed-sidebar') ) {
				$('.sidebar-collapse').slimScroll({
					height : '100%',
					railOpacity : 0.9
				});
			}
		});

		// Move right sidebar top after scroll
		$(window).scroll(function () {
			if ( $(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav') ) {
				$('#right-sidebar').addClass('sidebar-top');
			} else {
				$('#right-sidebar').removeClass('sidebar-top');
			}
		});

		$(document).bind("load resize scroll", function () {
			if ( !$("body").hasClass('body-small') ) {
				helper.fix_height();
			}
		});

		$("[data-toggle=popover]").popover();

		// Add slimscroll to element
		$('.full-height-scroll').slimscroll({
			height : '100%'
		})

		// uniform
		var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
		if ( test.size() > 0 ) {
			test.each(function () {
				if ( $(this).parents(".checker").size() === 0 ) {
					$(this).show();
					$(this).uniform();
				}
			});
		}

	});

	// Minimalize menu when screen is less than 768px
	$(window).bind("resize", function () {
		if ( $(this).width() < 769 ) {
			$('body').addClass('body-small')
		} else {
			$('body').removeClass('body-small')
		}
	});

	// Local Storage functions
	// Set proper body class and plugins based on user configuration
	$(document).ready(function () {
		if ( util.local_storage_support() ) {

			var collapse = localStorage.getItem("collapse_menu");
			var fixedsidebar = localStorage.getItem("fixedsidebar");
			var fixednavbar = localStorage.getItem("fixednavbar");
			var boxedlayout = localStorage.getItem("boxedlayout");
			var fixedfooter = localStorage.getItem("fixedfooter");

			var body = $('body');

			if ( fixedsidebar == 'on' ) {
				body.addClass('fixed-sidebar');
				$('.sidebar-collapse').slimScroll({
					height : '100%',
					railOpacity : 0.9
				});
			}

			if ( collapse == 'on' ) {
				if ( body.hasClass('fixed-sidebar') ) {
					if ( !body.hasClass('body-small') ) {
						body.addClass('mini-navbar');
					}
				} else {
					if ( !body.hasClass('body-small') ) {
						body.addClass('mini-navbar');
					}

				}
			}

			if ( fixednavbar == 'on' ) {
				$(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
				body.addClass('fixed-nav');
			}

			if ( boxedlayout == 'on' ) {
				body.addClass('boxed-layout');
			}

			if ( fixedfooter == 'on' ) {
				$(".footer").addClass('fixed');
			}
		}

		$('.contact-box').each(function () {
			helper.animation_hover(this, 'pulse');
		});
	});
	
});