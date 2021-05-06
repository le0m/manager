<?php
declare(strict_types=1);

namespace App\Identifier;

use Authentication\Identifier\AbstractIdentifier;
use BEdita\SDK\BEditaClient;
use BEdita\SDK\BEditaClientException;
use Cake\Log\LogTrait;
use Cake\Utility\Hash;
use Psr\Log\LogLevel;

/**
 * Identifier for authentication using BEdita 4 API /auth endpoint.
 */
class ApiIdentifier extends AbstractIdentifier
{
    use LogTrait;

    /**
     * Default configuration.
     *
     * - fields: the fields used for identify user
     * - apiClient: the instance of `\BEdita\SDK\BEditaClient`
     *
     * @var array
     */
    protected $_defaultConfig = [
        'fields' => [
            self::CREDENTIAL_USERNAME => 'username',
            self::CREDENTIAL_PASSWORD => 'password',
        ],
        'apiClient' => null,
    ];

    /**
     * @inheritDoc
     */
    public function identify(array $data)
    {
        /** @var \BEdita\SDK\BEditaClient $apiClient */
        $apiClient = $this->getConfig('apiClient');
        if (!($apiClient instanceof BEditaClient)) {
            $this->setError(__('Missing Client'));

            return null;
        }

        $errorReason = __('Username or password is incorrect');

        try {
            $result = $apiClient->authenticate(
                $data[$this->getConfig('fields.' . self::CREDENTIAL_USERNAME)],
                $data[$this->getConfig('fields.' . self::CREDENTIAL_USERNAME)]
            );
            if (empty($result['meta'])) {
                $this->setError($errorReason);

                return null;
            }
            $tokens = $result['meta'];
            $result = $apiClient->get('/auth/user', null, ['Authorization' => sprintf('Bearer %s', $tokens['jwt'])]);
        } catch (BEditaClientException $e) {
            $this->log('Login failed - ' . $e->getMessage(), LogLevel::INFO);
            $attributes = $e->getAttributes();
            if (!empty($attributes['reason'])) {
                $errorReason = $attributes['reason'];
            }
            $this->setError(__($errorReason));

            return null;
        }

        $user = $result['data']
            + compact('tokens')
            + Hash::combine($result, 'included.{n}.attributes.name', 'included.{n}.id', 'included.{n}.type');

        return $user;
    }

    /**
     * Add error message to `self::_errors`
     *
     * @param string $message The error message
     * @return void
     */
    protected function setError($message)
    {
        $this->_errors[] = $message;
    }
}
