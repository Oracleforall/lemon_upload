<!DOCTYPE HTML>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	<title>@if ($_title) {!! $_title !!} - @endif {{ site('site_name') }}</title>
	@section('head-meta') @show
	@section('head-css') @show
	@include('_layout.inc.requirejs')
		<!--[if lt IE 9]>
	<script>require('h5shiv')</script>
	<![endif]-->
</head>
  @section('body-start')<body>@show

	@yield('body-main')

	@section('script-cp') @show
	</body>
</html>