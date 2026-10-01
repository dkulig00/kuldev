<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $technologyNames = [
            'Laravel',
            'PHP',
            'PostgreSQL',
            'Next.js',
            'TypeScript',
            'Tailwind CSS',
            'Docker',
            'Pest',
        ];

        $technologies = collect($technologyNames)->mapWithKeys(
            fn (string $name): array => [$name => Technology::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name])]
        );

        $projects = [
            [
                'title' => 'kuldev.pl Portfolio',
                'summary' => 'Company website and portfolio with case studies and live demos.',
                'repo_url' => 'https://github.com/kuldev/kuldev-pl',
                'demo_url' => 'https://kuldev.pl',
                'sort_order' => 1,
                'stack' => ['Laravel', 'PHP', 'PostgreSQL', 'Next.js', 'TypeScript'],
            ],
            [
                'title' => 'Internal CRM',
                'summary' => 'Lightweight CRM for managing leads and client communication.',
                'repo_url' => 'https://github.com/kuldev/crm',
                'demo_url' => null,
                'sort_order' => 2,
                'stack' => ['Laravel', 'PHP', 'PostgreSQL', 'Tailwind CSS'],
            ],
            [
                'title' => 'Dev Toolkit CLI',
                'summary' => 'Command-line helper for bootstrapping Laravel and Next.js projects.',
                'repo_url' => 'https://github.com/kuldev/toolkit',
                'demo_url' => null,
                'sort_order' => 3,
                'stack' => ['PHP', 'Docker', 'Pest'],
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::query()->firstOrCreate(
                ['slug' => Str::slug($data['title'])],
                [
                    'title' => $data['title'],
                    'summary' => $data['summary'],
                    'repo_url' => $data['repo_url'],
                    'demo_url' => $data['demo_url'],
                    'sort_order' => $data['sort_order'],
                    'is_published' => true,
                    'published_at' => now(),
                ],
            );

            $project->technologies()->attach(
                collect($data['stack'])->map(function (string $name) use ($technologies): int {
                    $technology = $technologies->get($name);

                    if (! $technology instanceof Technology) {
                        throw new RuntimeException("Unknown technology in seeder stack: {$name}");
                    }

                    return $technology->id;
                }),
            );
        }
    }
}
