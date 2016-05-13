@extends('_layout.default')
@section('head-css')
	{!! Html::style('assets/css/1dailian/site.css') !!}
	{!! Html::style('assets/css/lemon/plugin.css') !!}
	{!! Html::style('assets/css/lemon/font-awesome.css') !!}
	{!! Html::style('assets/css/lemon/bt3.css') !!}
	{!! Html::style('assets/css/1dailian/landing.css') !!}
@endsection
@section('body-main')
	@include('_layout.inc.front_flash')
	@yield('dailian_site-main')
@endsection
@section('script-cp')
	<script>requirejs(['1dailian/front_cp']);</script>
@endsection