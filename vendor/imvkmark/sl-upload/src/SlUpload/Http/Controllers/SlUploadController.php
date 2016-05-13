<?php namespace Imvkmark\SlUpload\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Imvkmark\SlUpload\Action\SlUploadImage;


/**
 * 服务接口
 * Class UploadController
 * @package App\Http\Controllers\Support
 */
class SlUploadController extends Controller {

	protected $action;

	/**
	 * 图片上传组件的后端
	 * @param Request $request
	 *    'kindeditor' => 'imgFile',
	 *    'avatar'     => '__avatar1',
	 *    'default'    => 'image_file',
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function postImage(Request $request) {
		$validator = \Validator::make($request->all(), [
			'image_file'   => 'required',
			'upload_token' => 'required',
		], [
			'image_file.required'   => '图片参数不能为空',
			'upload_token.required' => 'upload_token不能为空',
		]);
		if ($validator->fails()) {
			return site_end('error', $validator->errors(), [
				'json' => true,
			]);
		}
		$field = $request->input('field', 'image_file');
		$sign  = $request->input('upload_token');

		// 匹配
		$file  = \Input::file($field);
		$Image = new SlUploadImage();
		if ($Image->checkUpload($sign) && $Image->save($file)) {
			return site_end('success', '图片上传成功', [
				'json'        => true,
				'url'         => $Image->getUrl(),
				'destination' => $Image->getDestination(),
			]);
		} else {
			return site_end('error', $Image->getError(), [
				'json' => true,
			]);
		}
		// kindeditor
		// {"error" : 0,"url" : "' . $url . '"}
		// avatar
		// update avatar
		// thumb
		// url, path
	}

}
