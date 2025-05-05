-- DropIndex
DROP INDEX `ActividadesUsuario_id_actividad_fkey` ON `actividadesusuario`;

-- DropIndex
DROP INDEX `ActividadesUsuario_id_usuario_fkey` ON `actividadesusuario`;

-- DropIndex
DROP INDEX `CategoriasArticulosBlog_id_articulo_fkey` ON `categoriasarticulosblog`;

-- DropIndex
DROP INDEX `Comentarios_id_post_fkey` ON `comentarios`;

-- DropIndex
DROP INDEX `Comentarios_id_usuario_fkey` ON `comentarios`;

-- DropIndex
DROP INDEX `Interacciones_id_comentario_fkey` ON `interacciones`;

-- DropIndex
DROP INDEX `Interacciones_id_post_fkey` ON `interacciones`;

-- DropIndex
DROP INDEX `Interacciones_id_usuario_fkey` ON `interacciones`;

-- DropIndex
DROP INDEX `IntermediaArticulosImagenes_id_imagen_fkey` ON `intermediaarticulosimagenes`;

-- DropIndex
DROP INDEX `Logs_id_usuario_fkey` ON `logs`;

-- DropIndex
DROP INDEX `Notificaciones_id_usuario_fkey` ON `notificaciones`;

-- DropIndex
DROP INDEX `Posts_id_usuario_fkey` ON `posts`;

-- DropIndex
DROP INDEX `UsuariosPatologias_id_patologia_fkey` ON `usuariospatologias`;

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
