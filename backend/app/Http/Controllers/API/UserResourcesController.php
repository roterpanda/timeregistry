<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Models\User;
use App\Services\RegisterUserService;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Cookie;

class UserResourcesController extends BaseController
{

   public function getUserData(Request $request): JsonResponse
   {
       return response()->json([
           'name' => $request->user()->name,
           'verified' => $request->user()->hasVerifiedEmail(),
       ]);
   }

}
