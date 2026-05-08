<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'       => ['sometimes', 'required', 'string', 'max:255'],
            'email'      => [
                'sometimes', 'required', 'string', 'lowercase', 'email', 'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'bio'        => ['sometimes', 'nullable', 'string', 'max:500'],
            'phone'      => ['sometimes', 'nullable', 'string', 'max:30'],
            'addresses'  => ['sometimes', 'nullable', 'array'],
            'addresses.*.label'        => ['nullable', 'string', 'max:50'],
            'addresses.*.recipient'    => ['nullable', 'string', 'max:255'],
            'addresses.*.phone'        => ['nullable', 'string', 'max:30'],
            'addresses.*.full_address' => ['nullable', 'string', 'max:500'],
            'addresses.*.city'         => ['nullable', 'string', 'max:100'],
            'addresses.*.province'     => ['nullable', 'string', 'max:100'],
            'addresses.*.postal_code'  => ['nullable', 'string', 'max:10'],
            'addresses.*.is_primary'   => ['nullable', 'boolean'],
        ];
    }
}
