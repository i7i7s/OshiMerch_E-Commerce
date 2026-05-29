<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MemberAutoTagService
{
    private string $apiUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app');
    }

    /**
     * Fetch all members from the JKT48 API, cached for 1 hour.
     *
     * @return array<int, array{code: string, name: string, nickname: string, type: string}>
     */
    public function getMembers(): array
    {
        return Cache::remember('jkt48_members_autotag', 3600, function () {
            try {
                $response = Http::timeout(5)->get("{$this->apiUrl}/api/members");

                if ($response->successful()) {
                    $json = $response->json();
                    if (isset($json['status']) && $json['status'] && isset($json['data'])) {
                        return $json['data'];
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('MemberAutoTagService: Failed to fetch members from API', [
                    'error' => $e->getMessage(),
                ]);
            }

            return [];
        });
    }

    /**
     * Detect a JKT48 member from a product title or description.
     *
     * Returns ['code', 'name', 'team'] if a match is found, or null otherwise.
     *
     * Strategy:
     * - Normalize the text to lowercase
     * - Sort members longest-name-first to prevent short nicknames (e.g. "Lia")
     *   from matching before full names (e.g. "Abigail")
     * - Check both full name and nickname with word-boundary regex
     *
     * @return array{code: string, name: string, team: string}|null
     */
    public function detect(string $title, string $description = ''): ?array
    {
        $members = $this->getMembers();

        if (empty($members)) {
            return null;
        }

        $text = strtolower($title . ' ' . $description);

        // Sort longest name first to prevent partial/short-name false positives
        usort($members, fn ($a, $b) => strlen($b['name'] ?? '') - strlen($a['name'] ?? ''));

        foreach ($members as $member) {
            $code     = $member['code'] ?? '';
            $fullName = $member['name'] ?? '';
            $nickname = $member['nickname'] ?? '';
            $type     = $member['type'] ?? '';

            if (empty($code) || empty($fullName)) {
                continue;
            }

            $team = $this->normalizeTeam($type);

            // Try nickname first (sellers tend to use short names in titles)
            if ($nickname && $this->wordMatch($text, $nickname)) {
                return ['code' => $code, 'name' => $fullName, 'team' => $team];
            }

            // Try full name parts (first name, last name, or full name)
            if ($this->wordMatch($text, $fullName)) {
                return ['code' => $code, 'name' => $fullName, 'team' => $team];
            }

            // Try first name only (e.g. "Freya" from "Freya Jayawardana")
            $parts = explode(' ', $fullName);
            if (count($parts) > 1 && $this->wordMatch($text, $parts[0])) {
                return ['code' => $code, 'name' => $fullName, 'team' => $team];
            }
        }

        return null;
    }

    /**
     * Check if a word/phrase appears in the text using word-boundary matching.
     * Case-insensitive.
     */
    private function wordMatch(string $text, string $word): bool
    {
        if (strlen(trim($word)) < 2) {
            return false;
        }

        $pattern = '/\b' . preg_quote(strtolower(trim($word)), '/') . '\b/u';

        return (bool) preg_match($pattern, $text);
    }

    /**
     * Normalize API team type to the value stored in the DB and used by the frontend.
     * API returns: PASSION | LOVE | DREAM | TRAINEE | JKT48_VIRTUAL
     * DB / frontend expects: PASSION | LOVE | DREAM | TRAINEE | VIRTUAL
     */
    private function normalizeTeam(string $type): string
    {
        return strtoupper($type) === 'JKT48_VIRTUAL' ? 'VIRTUAL' : strtoupper($type);
    }
}
