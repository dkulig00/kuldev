<?php

it('returns ok status', function (): void {
    $response = $this->getJson('/api/health');

    $response->assertOk()->assertExactJson(['status' => 'ok']);
});
