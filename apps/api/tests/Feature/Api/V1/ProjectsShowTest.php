<?php

use App\Models\Project;
use App\Models\Technology;

it('shows a published project by slug with its technologies and body', function (): void {
    $project = Project::factory()->published()->create();
    $technology = Technology::factory()->create();
    $project->technologies()->attach($technology);

    $response = $this->getJson("/api/v1/projects/{$project->slug}");

    $response->assertOk()
        ->assertJson([
            'data' => [
                'title' => $project->title,
                'slug' => $project->slug,
                'summary' => $project->summary,
                'body' => $project->body,
                'repo_url' => $project->repo_url,
                'demo_url' => $project->demo_url,
            ],
        ])
        ->assertJsonFragment([
            'name' => $technology->name,
            'slug' => $technology->slug,
        ]);
});

it('returns 404 for an unpublished project', function (): void {
    $project = Project::factory()->unpublished()->create();

    $response = $this->getJson("/api/v1/projects/{$project->slug}");

    $response->assertNotFound();
});

it('returns 404 for a nonexistent slug', function (): void {
    $response = $this->getJson('/api/v1/projects/does-not-exist');

    $response->assertNotFound();
});
