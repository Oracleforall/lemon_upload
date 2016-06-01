<?php namespace App\Http\Controllers\Support;

use App\Lemon\Repositories\System\SysAcl;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

/**
 * 管理员初始化文件
 * Class InitController
 * @package App\Http\Controllers\Desktop
 */
class InitController extends Controller {

	/**
	 * 本用户的角色 ID
	 * @var int
	 */
	protected $roleId = 0;

	public function __construct(Request $request) {
		parent::__construct();
		
		if ($this->route) {
			$title = SysAcl::getTitleCache('support', $this->route);
			\View::share([
				'_title' => $title,
			]);
		}
	}

}