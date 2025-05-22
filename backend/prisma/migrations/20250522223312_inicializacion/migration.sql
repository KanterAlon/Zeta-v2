-- CreateTable
CREATE TABLE "Actividades" (
    "id_actividad" SERIAL NOT NULL,
    "nombre_actividad" TEXT NOT NULL,
    "coef_actividad" DECIMAL(3,2) NOT NULL,

    CONSTRAINT "Actividades_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "ActividadesUsuario" (
    "id_actividad_usuario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_actividad" INTEGER,
    "frecuencia_semanal" INTEGER NOT NULL,

    CONSTRAINT "ActividadesUsuario_pkey" PRIMARY KEY ("id_actividad_usuario")
);

-- CreateTable
CREATE TABLE "Articulos" (
    "id_articulo" INTEGER NOT NULL,
    "nombre_articulo" TEXT NOT NULL,
    "img_portada_articulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "texto_articulo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articulos_pkey" PRIMARY KEY ("id_articulo")
);

-- CreateTable
CREATE TABLE "CategoriasArticulosBlog" (
    "id_categoria" INTEGER NOT NULL,
    "id_articulo" INTEGER NOT NULL,

    CONSTRAINT "CategoriasArticulosBlog_pkey" PRIMARY KEY ("id_categoria","id_articulo")
);

-- CreateTable
CREATE TABLE "CategoriasDeArticulos" (
    "id_categoria" INTEGER NOT NULL,
    "nombre_categoria" TEXT NOT NULL,
    "descripcion_categoria" TEXT NOT NULL,

    CONSTRAINT "CategoriasDeArticulos_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Comentarios" (
    "id_comentario" SERIAL NOT NULL,
    "id_post" INTEGER NOT NULL,
    "id_usuario" INTEGER,
    "contenido_comentario" TEXT NOT NULL,
    "fecha_comentario" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "ImagenesDeArticulos" (
    "id_imagen" INTEGER NOT NULL,
    "src_imagen" TEXT NOT NULL,

    CONSTRAINT "ImagenesDeArticulos_pkey" PRIMARY KEY ("id_imagen")
);

-- CreateTable
CREATE TABLE "Interacciones" (
    "id_interaccion" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_post" INTEGER,
    "id_comentario" INTEGER,
    "tipo_interaccion" INTEGER,
    "fecha_interaccion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interacciones_pkey" PRIMARY KEY ("id_interaccion")
);

-- CreateTable
CREATE TABLE "IntermediaArticulosImagenes" (
    "id_articulo" INTEGER NOT NULL,
    "id_imagen" INTEGER NOT NULL,

    CONSTRAINT "IntermediaArticulosImagenes_pkey" PRIMARY KEY ("id_articulo","id_imagen")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id_log" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "accion" TEXT NOT NULL,
    "fecha_accion" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "Notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "mensaje" TEXT NOT NULL,
    "fecha_notificacion" TIMESTAMP(3) NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "Patologias" (
    "id_patologia" SERIAL NOT NULL,
    "nombre_patologia" TEXT NOT NULL,

    CONSTRAINT "Patologias_pkey" PRIMARY KEY ("id_patologia")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id_post" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "titulo_post" TEXT,
    "contenido_post" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "version" INTEGER DEFAULT 1,
    "imagen_url" TEXT,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id_post")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3),
    "ultima_sesion" TIMESTAMP(3),
    "edad" INTEGER,
    "sexo" BOOLEAN,
    "peso" DOUBLE PRECISION,
    "altura" DOUBLE PRECISION,
    "password" TEXT,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "UsuariosPatologias" (
    "id_usuario" INTEGER NOT NULL,
    "id_patologia" INTEGER NOT NULL,

    CONSTRAINT "UsuariosPatologias_pkey" PRIMARY KEY ("id_usuario","id_patologia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- AddForeignKey
ALTER TABLE "ActividadesUsuario" ADD CONSTRAINT "ActividadesUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadesUsuario" ADD CONSTRAINT "ActividadesUsuario_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "Actividades"("id_actividad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasArticulosBlog" ADD CONSTRAINT "CategoriasArticulosBlog_id_articulo_fkey" FOREIGN KEY ("id_articulo") REFERENCES "Articulos"("id_articulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasArticulosBlog" ADD CONSTRAINT "CategoriasArticulosBlog_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "CategoriasDeArticulos"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios" ADD CONSTRAINT "Comentarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentarios" ADD CONSTRAINT "Comentarios_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "Posts"("id_post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacciones" ADD CONSTRAINT "Interacciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacciones" ADD CONSTRAINT "Interacciones_id_post_fkey" FOREIGN KEY ("id_post") REFERENCES "Posts"("id_post") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacciones" ADD CONSTRAINT "Interacciones_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "Comentarios"("id_comentario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediaArticulosImagenes" ADD CONSTRAINT "IntermediaArticulosImagenes_id_articulo_fkey" FOREIGN KEY ("id_articulo") REFERENCES "Articulos"("id_articulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediaArticulosImagenes" ADD CONSTRAINT "IntermediaArticulosImagenes_id_imagen_fkey" FOREIGN KEY ("id_imagen") REFERENCES "ImagenesDeArticulos"("id_imagen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPatologias" ADD CONSTRAINT "UsuariosPatologias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPatologias" ADD CONSTRAINT "UsuariosPatologias_id_patologia_fkey" FOREIGN KEY ("id_patologia") REFERENCES "Patologias"("id_patologia") ON DELETE RESTRICT ON UPDATE CASCADE;
