<?php namespace App\Http\Requests\Desktop;

use App\Http\Requests\Request;

class GameNameRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 * @return bool
	 */
	public function authorize() {
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 * @return array
	 */
	public function rules() {

		switch ($this->method()) {
			case 'GET':
			case 'DELETE': {
				return [];
			}
			case 'POST': {
				return [
					'game_name' => 'required|unique:game_name,game_name',
				];
			}
			default:
				break;
		}
	}


}
