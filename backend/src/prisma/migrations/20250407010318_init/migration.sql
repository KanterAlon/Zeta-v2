-- CreateTable
CREATE TABLE `Actividades` (
    `id_actividad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_actividad` VARCHAR(100) NOT NULL,
    `coef_actividad` DECIMAL(3, 2) NOT NULL,

    PRIMARY KEY (`id_actividad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActividadesUsuario` (
    `id_actividad_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_actividad` INTEGER NULL,
    `frecuencia_semanal` INTEGER NOT NULL,

    PRIMARY KEY (`id_actividad_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Articulos` (
    `id_articulo` INTEGER NOT NULL,
    `nombre_articulo` VARCHAR(50) NOT NULL,
    `img_portada_articulo` VARCHAR(50) NOT NULL,
    `autor` VARCHAR(50) NOT NULL,
    `texto_articulo` LONGTEXT NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriasArticulosBlog` (
    `id_categoria` INTEGER NOT NULL,
    `id_articulo` INTEGER NOT NULL,

    PRIMARY KEY (`id_categoria`, `id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriasDeArticulos` (
    `id_categoria` INTEGER NOT NULL,
    `nombre_categoria` VARCHAR(50) NOT NULL,
    `descripcion_categoria` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comentarios` (
    `id_comentario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_post` INTEGER NOT NULL,
    `id_usuario` INTEGER NULL,
    `contenido_comentario` TEXT NOT NULL,
    `fecha_comentario` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_comentario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImagenesDeArticulos` (
    `id_imagen` INTEGER NOT NULL,
    `src_imagen` CHAR(10) NOT NULL,

    PRIMARY KEY (`id_imagen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interacciones` (
    `id_interaccion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_post` INTEGER NULL,
    `id_comentario` INTEGER NULL,
    `tipo_interaccion` INTEGER NULL,
    `fecha_interaccion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_interaccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IntermediaArticulosImagenes` (
    `id_articulo` INTEGER NOT NULL,
    `id_imagen` INTEGER NOT NULL,

    PRIMARY KEY (`id_articulo`, `id_imagen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `accion` VARCHAR(200) NOT NULL,
    `fecha_accion` DATETIME(3) NOT NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificaciones` (
    `id_notificacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `mensaje` TEXT NOT NULL,
    `fecha_notificacion` DATETIME(3) NOT NULL,
    `leida` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_notificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patologias` (
    `id_patologia` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_patologia` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_patologia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id_post` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `titulo_post` VARCHAR(200) NULL,
    `contenido_post` TEXT NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL,
    `version` INTEGER NULL DEFAULT 1,
    `imagen_url` VARCHAR(50) NULL,

    PRIMARY KEY (`id_post`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `fecha_registro` DATETIME(3) NULL,
    `ultima_sesion` DATETIME(3) NULL,
    `edad` INTEGER NULL,
    `sexo` BOOLEAN NULL,
    `peso` DOUBLE NULL,
    `altura` DOUBLE NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuarios_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosPatologias` (
    `id_usuario` INTEGER NOT NULL,
    `id_patologia` INTEGER NOT NULL,

    PRIMARY KEY (`id_usuario`, `id_patologia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActividadesUsuario` ADD CONSTRAINT `ActividadesUsuario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActividadesUsuario` ADD CONSTRAINT `ActividadesUsuario_id_actividad_fkey` FOREIGN KEY (`id_actividad`) REFERENCES `Actividades`(`id_actividad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriasArticulosBlog` ADD CONSTRAINT `CategoriasArticulosBlog_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `Articulos`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriasArticulosBlog` ADD CONSTRAINT `CategoriasArticulosBlog_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `CategoriasDeArticulos`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentarios` ADD CONSTRAINT `Comentarios_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentarios` ADD CONSTRAINT `Comentarios_id_post_fkey` FOREIGN KEY (`id_post`) REFERENCES `Posts`(`id_post`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interacciones` ADD CONSTRAINT `Interacciones_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interacciones` ADD CONSTRAINT `Interacciones_id_post_fkey` FOREIGN KEY (`id_post`) REFERENCES `Posts`(`id_post`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interacciones` ADD CONSTRAINT `Interacciones_id_comentario_fkey` FOREIGN KEY (`id_comentario`) REFERENCES `Comentarios`(`id_comentario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IntermediaArticulosImagenes` ADD CONSTRAINT `IntermediaArticulosImagenes_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `Articulos`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IntermediaArticulosImagenes` ADD CONSTRAINT `IntermediaArticulosImagenes_id_imagen_fkey` FOREIGN KEY (`id_imagen`) REFERENCES `ImagenesDeArticulos`(`id_imagen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logs` ADD CONSTRAINT `Logs_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificaciones` ADD CONSTRAINT `Notificaciones_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPatologias` ADD CONSTRAINT `UsuariosPatologias_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPatologias` ADD CONSTRAINT `UsuariosPatologias_id_patologia_fkey` FOREIGN KEY (`id_patologia`) REFERENCES `Patologias`(`id_patologia`) ON DELETE RESTRICT ON UPDATE CASCADE;
