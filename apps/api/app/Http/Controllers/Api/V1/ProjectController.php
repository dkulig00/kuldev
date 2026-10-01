<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectListResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $projects = Project::published()
            ->orderBy('sort_order')
            ->latest('published_at')
            ->orderBy('id')
            ->with('technologies')
            ->paginate();

        return ProjectListResource::collection($projects);
    }

    public function show(string $slug): ProjectResource
    {
        $project = Project::published()
            ->with('technologies')
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProjectResource($project);
    }
}
