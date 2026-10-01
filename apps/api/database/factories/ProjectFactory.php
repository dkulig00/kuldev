<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = ucwords(implode(' ', [
            fake()->unique()->word(),
            fake()->word(),
            fake()->word(),
        ]));

        $body = implode("\n\n", [
            '# '.$title,
            fake()->paragraph(),
            fake()->paragraph(),
            fake()->paragraph(),
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'summary' => fake()->sentence(12),
            'body' => $body,
            'repo_url' => fake()->optional()->url(),
            'demo_url' => fake()->optional()->url(),
            'is_published' => false,
            'published_at' => null,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Indicate that the project is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes): array => [
            'is_published' => true,
            'published_at' => $attributes['published_at'] ?? now(),
        ]);
    }

    /**
     * Indicate that the project is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (): array => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
