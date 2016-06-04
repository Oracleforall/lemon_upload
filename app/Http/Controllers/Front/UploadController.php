<?php namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Lemon\Repositories\Sour\LmEnv;
use App\Lemon\Repositories\Sour\LmUtil;
use App\Lemon\Repositories\System\SysCrypt;
use App\Lemon\Upload\Action\ActionImage;
use App\Lemon\Upload\System\SysUpload;
use App\Models\PluginImageKey;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;


/**
 * 服务接口
 * Class UploadController
 * @package App\Http\Controllers\Support
 */
class UploadController extends Controller {

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
		$field      = $request->input('field', 'image_file');
		$return_url = $request->input('return_url');
		\Log::debug($_REQUEST);
		$file       = \Input::file($field);
		if (is_null($file)) {
			$return = [
				'status'  => 'error',
				'msg' => '文件上传至服务器失败, 原因:网络过慢或图片超过 ' . LmUtil::formatBytes(UploadedFile::getMaxFilesize()),
			];
		} else {
			if (!$file->isValid()) {
				$return = [
					'status'  => 'error',
					'msg' => $file->getError(),
				];
			} else {
				$validator = \Validator::make($request->all(), [
					$field         => 'required',
					'upload_token' => 'required',
				], [
					$field . '.required'    => '图片参数不能为空',
					'upload_token.required' => 'upload_token不能为空',
				]);
				if ($validator->fails()) {
					return site_end('error', $validator->errors(), [
						'json' => true,
					]);
				}

				$sign = $request->input('upload_token');

				// 匹配
				$file  = \Input::file($field);
				$Image = new ActionImage();
				if ($Image->checkUpload($sign) && $Image->save($file)) {
					$return = [
						'status'      => 'success',
						'msg'     => '图片上传成功',
						'success'     => true,   // 兼容 fullAvatarEditor
						'url'         => $Image->getUrl(),
						'destination' => $Image->getDestination(),
					];
				} else {
					$return = [
						'status'  => 'error',
						'msg' => $Image->getError(),
					];
				}
			}
		}
		if ($return_url && LmUtil::isUrl($return_url)) {
			return response()->redirectTo($return_url . '?upload_return=' . base64_encode(json_encode($return)));
		} else {
			return response()->json($return);
		}
		// kindeditor
		// {"error" : 0,"url" : "' . $url . '"}
		// avatar
		// update avatar
		// thumb
		// url, path
	}

	/**
	 * 生成 upload_token
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getToken(Request $request) {
		$timestamp = $request->input('timestamp');
		$app_key   = $request->input('app_key');
		$version   = $request->input('version');
		$sign      = $request->input('sign');
		if (abs($timestamp - LmEnv::time()) > config('upload.expires')) {
			return response()->json([
				'status'  => 'error',
				'msg' => '服务器时差差距过大, 请重新设置',
			]);
		}
		$app_secret = PluginImageKey::getSecretByPublic($app_key);
		if (!$app_secret) {
			return response()->json([
				'status'  => 'error',
				'msg' => 'app key 不存在!',
			]);
		}
		$key = [
			'timestamp'  => $timestamp,
			'app_key'    => $app_key,
			'app_secret' => $app_secret,
			'version'    => $version,
		];

		$serverSign = SysCrypt::crypt($key);
		if ($serverSign != $sign) {
			return response()->json([
				'status'  => 'error',
				'msg' => '签名错误!',
			]);
		}
		return response()->json([
			'status'  => 'success',
			'msg' => '获取上传 token 成功',
			'data'    => [
				'upload_token' => SysUpload::genUploadToken($app_key),
			],
		]);
	}
}
