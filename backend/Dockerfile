FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y libpq-dev zip unzip git curl

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install

CMD php artisan serve --host=0.0.0.0 --port=8000
