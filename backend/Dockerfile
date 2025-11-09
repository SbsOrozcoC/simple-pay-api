FROM php:8.2-fpm

# Instalar extensiones y utilidades
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev zip curl \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar solo los archivos necesarios para composer primero
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copiar el resto de los archivos
COPY . .

# Ejecutar scripts de post-instalación
RUN composer dump-autoload

# permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000FROM php:8.2-fpm

# Instalar extensiones y utilidades
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev zip curl \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar solo los archivos necesarios para composer primero
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copiar el resto de los archivos
COPY . .

# Ejecutar scripts de post-instalación
RUN composer dump-autoload

# permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0 --port=8000