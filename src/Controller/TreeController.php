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
namespace App\Controller;

use BEdita\SDK\BEditaClientException;
use Cake\Utility\Hash;

/**
 * Tree controller.
 */
class TreeController extends AppController
{
    /**
     * Load tree data.
     *
     * @return void
     */
    public function treeJson($path): void
    {
        $this->request->allowMethod(['get']);
        try {
            if ($path) {
                $response = $this->apiClient->getObjects(sprintf('trees/%s', $path));
            } else {
                $response = $this->apiClient->getObjects('trees');
            }
        } catch (BEditaClientException $error) {
            $this->log($error, 'error');

            $this->set(compact('error'));
            $this->set('_serialize', ['error']);

            return;
        }

        $this->set((array)$response);
        $this->set('_serialize', array_keys($response));
    }

    /**
     * Load relation data.
     *
     * @return void
     */
    public function relationJson(): void
    {
        $this->request->allowMethod(['get']);
        $query = $this->Modules->prepareQuery($this->request->getQueryParams());
        $id = Hash::get($query, 'id');
        $relation = Hash::get($query, 'relation');

        try {
            if (empty($id) || empty($relation)) {
                return;
            }

            $response = $this->apiClient->get(sprintf('/folders/%s/relationships/%s', $id, $relation));
        } catch (BEditaClientException $error) {
            $this->log($error, 'error');

            $this->set(compact('error'));
            $this->set('_serialize', ['error']);

            return;
        }

        $this->set((array)$response);
        $this->set('_serialize', array_keys($response));
    }
}
