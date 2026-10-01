<?php

use App\Models\Project;
use App\Models\Technology;

it('lists only published projects', function (): void {
    $published = Project::factory()->published()->create();
    Project::factory()->unpublished()->create();

    $response = $this->getJson('/api/v1/projects');

    $response->assertOk();
    $slugs = collect($response->json('data'))->pluck('slug');

    expect($slugs)->toContain($published->slug)
        ->and($slugs)->toHaveCount(1);
});

it('does not include body in the list payload', function (): void {
    Project::factory()->published()->create();

    $response = $this->getJson('/api/v1/projects');

    $response->assertJsonMissingPath('data.0.body');
});

it('orders projects by sort_order', function (): void {
    $second = Project::factory()->published()->create(['sort_order' => 2]);
    $first = Project::factory()->published()->create(['sort_order' => 1]);

    $response = $this->getJson('/api/v1/projects');

    expect(collect($response->json('data'))->pluck('slug')->all())
        ->toBe([$first->slug, $second->slug]);
});

it('returns a stable order for projects sharing the same sort_order', function (): void {
    $older = Project::factory()->published()->create([
        'sort_order' => 1,
        'published_at' => now()->subDay(),
    ]);
    $newer = Project::factory()->published()->create([
        'sort_order' => 1,
        'published_at' => now(),
    ]);

    $first = $this->getJson('/api/v1/projects');
    $second = $this->getJson('/api/v1/projects');

    $expected = [$newer->slug, $older->slug];

    expect(collect($first->json('data'))->pluck('slug')->all())->toBe($expected)
        ->and(collect($second->json('data'))->pluck('slug')->all())->toBe($expected);
});

it('includes eager loaded technologies for each project', function (): void {
    $project = Project::factory()->published()->create();
    $technology = Technology::factory()->create();
    $project->technologies()->attach($technology);

    $response = $this->getJson('/api/v1/projects');

    $response->assertJsonFragment([
        'name' => $technology->name,
        'slug' => $technology->slug,
    ]);
});

it('paginates the projects list', function (): void {
    Project::factory()->published()->count(20)->create();

    $response = $this->getJson('/api/v1/projects');

    $response->assertOk()
        ->assertJsonStructure(['data', 'links', 'meta'])
        ->assertJsonCount(15, 'data');

    expect($response->json('meta.last_page'))->toBe(2);
});
