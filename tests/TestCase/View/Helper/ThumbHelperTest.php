<?php
/**
 * BEdita, API-first content management framework
 * Copyright 2018 ChannelWeb Srl, Chialab Srl
 *
 * This file is part of BEdita: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * See LICENSE.LGPL or <http://gnu.org/licenses/lgpl-3.0.html> for more details.
 */

namespace App\Test\TestCase\View\Helper;

use App\ApiClientProvider;
use App\View\Helper\ThumbHelper;
use BEdita\SDK\BEditaClient;
use Cake\TestSuite\TestCase;
use Cake\View\View;

/**
 * {@see \App\View\Helper\ThumbHelper} Test Case
 *
 * @coversDefaultClass \App\View\Helper\ThumbHelper
 */
class ThumbHelperTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \App\View\Helper\ThumbHelper
     */
    public $Thumb;

    /**
     * {@inheritDoc}
     */
    public function setUp() : void
    {
        parent::setUp();

        // set api client in view for helper
        $this->_initApi();

        // create helper
        $this->Thumb = new ThumbHelper(new View());
    }

    /**
     * {@inheritDoc}
     */
    public function tearDown() : void
    {
        unset($this->Thumb);

        parent::tearDown();
    }

    /**
     * Init api client
     *
     * @return void
     */
    private function _initApi() : void
    {
        $apiClient = ApiClientProvider::getApiClient();
        $adminUser = getenv('BEDITA_ADMIN_USR');
        $adminPassword = getenv('BEDITA_ADMIN_PWD');
        $response = $apiClient->authenticate($adminUser, $adminPassword);
        $apiClient->setupTokens($response['meta']);
    }

    /**
     * Create image and media stream for test.
     * Return id
     *
     * @return int The image ID.
     */
    private function _image() : int
    {
        $apiClient = ApiClientProvider::getApiClient();

        $filename = 'test.png';
        $filepath = sprintf('%s/tests/files/%s', getcwd(), $filename);
        $response = $apiClient->upload($filename, $filepath);

        $streamId = $response['data']['id'];
        $response = $apiClient->get(sprintf('/streams/%s', $streamId));

        $type = 'images';
        $title = 'The test image';
        $attributes = compact('title');
        $data = compact('type', 'attributes');
        $body = compact('data');
        $response = $apiClient->createMediaFromStream($streamId, $type, $body);

        return $response['data']['id'];
    }

    /**
     * Data provider for `testUrl` test case.
     *
     * @return array
     */
    public function urlProvider() : array
    {
        return [
            'basic thumb default preset' => [
                [
                    'id' => null,
                    'preset' => null, // use default
                ],
                true,
            ],
            'thumb error, return null' => [
                [
                    'id' => 999999999999999999999999999999999999999999999,
                    'preset' => null, // use default
                ],
                false,
            ],
        ];
    }

    /**
     * Test `url()` method.
     *
     * @dataProvider urlProvider()
     * @covers ::url()
     * @param array $input The input array.
     * @param boolean $expected The expected boolean.
     * @return void
     */
    public function testUrl(array $input, $expected) : void
    {
        $id = empty($input['id']) ? $this->_image() : $input['id'];

        $result = $this->Thumb->url($id, $input['preset']);
        static::assertNotNull($expected);
    }
}