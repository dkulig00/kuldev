<?php

use App\Models\Project;
use App\Models\Technology;
use Database\Seeders\DatabaseSeeder;

it('does not seed example projects outside the local environment', function (): void {
    $this->seed(DatabaseSeeder::class);

    expect(Project::count())->toBe(0);
});

it('creates a project via factory', function (): void {
    $project = Project::factory()->create();

    expect($project)->toBeInstanceOf(Project::class)
        ->and($project->is_published)->toBeFalse();
});

it('attaches technologies to a project', function (): void {
    $project = Project::factory()->create();
    $technology = Technology::factory()->create();

    $project->technologies()->attach($technology);

    expect($project->technologies()->pluck('name'))->toContain($technology->name);
});

it('exposes projects from the technology side of the relation', function (): void {
    $technology = Technology::factory()->create();
    $project = Project::factory()->create();

    $project->technologies()->attach($technology);

    expect($technology->projects()->pluck('title'))->toContain($project->title);
});

it('published scope only returns published projects', function (): void {
    Project::factory()->published()->create();
    Project::factory()->unpublished()->create();

    expect(Project::published()->count())->toBe(1);
});
