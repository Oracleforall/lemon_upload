<?php namespace App\Models;

/**
 * This file is part of Entrust,
 * a role & permission management solution for Laravel.
 * @license MIT
 * @package Zizaco\Entrust
 * @property integer        $id
 * @property integer        $account_id
 * @property string         $upload_path
 * @property string         $upload_extension
 * @property integer        $upload_filesize
 * @property string         $upload_mime
 * @property string         $upload_field
 * @property integer        $upload_width
 * @property integer        $upload_height
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @mixin \Eloquent
 */


class PluginImageUpload extends \Eloquent {

	/**
	 * The database table used by the model.
	 * @var string
	 */
	protected $table = 'plugin_image_upload';
	

	protected $fillable = [
		'md5',
		'upload_path',
		'upload_type',
		'upload_extension',
		'upload_filesize',
		'upload_mime',
		'image_type',
		'image_width',
		'image_height',
		'account_id',
	];

}
