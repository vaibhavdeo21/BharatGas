<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file routes all web traffic to the React application via the single 
| Blade view. React Router will handle all frontend URL processing.
|
*/

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');