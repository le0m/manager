<?php
/**
 * BEdita, API-first content management framework
 * Copyright 2020 ChannelWeb Srl, Chialab Srl
 *
 * This file is part of BEdita: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * See LICENSE.LGPL or <http://gnu.org/licenses/lgpl-3.0.html> for more details.
 */
namespace App\Middleware;

use App\Application;
use Cake\Http\ServerRequest;
use Psr\Http\Message\ResponseInterface;

/**
 * Project middleware.
 *
 * Multi projects support (optional): detect current `_project` name in session and try to load matching config file from `config/projects` folder.
 * After that app plugins are loaded via configuration.
 */
class ProjectMiddleware
{
    /**
     * Application instance
     *
     * @var \App\Application
     */
    protected $Application;

    /**
     * Projects config base path
     *
     * @var string
     */
    protected $projectsConfigPath = CONFIG . 'projects' . DS;

    /**
     * Constructor
     *
     * @param \App\Application $app The application instance.
     * @param string|null $configPath Projects config path.
     */
    public function __construct(Application $app, ?string $configPath = null)
    {
        $this->Application = $app;
        if (!empty($configPath)) {
            $this->projectsConfigPath = $configPath;
        }
    }

    /**
     * Look for `_project` key in session, if found load configuration file.
     * Then call `Application::loadPluginsFromConfig()` to load plugins
     *
     * @param \Cake\Http\ServerRequest $request The request.
     * @param \Psr\Http\Message\ResponseInterface $response The response.
     * @param callable $next Callback to invoke the next middleware.
     *
     * @return \Psr\Http\Message\ResponseInterface A response
     */
    public function __invoke(ServerRequest $request, ResponseInterface $response, $next): ResponseInterface
    {
        $project = $this->detectProject($request);
        Application::loadProjectConfig((string)$project, $this->projectsConfigPath);
        $this->Application->loadPluginsFromConfig();

        return $next($request, $response);
    }

    /**
     * Detect project in use from session, if any
     * On empty session or missing project name `null` is returned
     *
     * @param \Cake\Http\ServerRequest $request The request.
     * @return string|null
     */
    protected function detectProject(ServerRequest $request): ?string
    {
        $session = $request->getSession();
        if (empty($session) || !$session->check('_project')) {
            return null;
        }

        return (string)$session->read('_project');
    }
}
