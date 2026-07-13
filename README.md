# Sistema POS para Panadería

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de un **Sistema POS (Point of Sale)** para una panadería, diseñado para gestionar las ventas diarias del negocio de forma rápida, segura y escalable.

El sistema permitirá registrar ventas, administrar productos, controlar inventario, generar recibos de compra y consultar reportes de ventas.

El proyecto será desarrollado utilizando tecnologías modernas, gratuitas y ampliamente utilizadas en la industria, con el objetivo de garantizar estabilidad, facilidad de mantenimiento y escalabilidad.

---

# Objetivos

## Objetivo General

Desarrollar un sistema POS web para la gestión integral de una panadería utilizando Angular, Spring Boot y PostgreSQL.

## Objetivos Específicos

* Gestionar productos.
* Gestionar categorías.
* Registrar ventas.
* Generar recibos de compra.
* Administrar clientes.
* Controlar inventario.
* Generar reportes.
* Gestionar usuarios y permisos.
* Facilitar futuras integraciones (Facturación electrónica, múltiples sucursales, etc.).

---

# Tecnologías del Proyecto

## Frontend

* Angular 20.x (Versión estable)
* TypeScript
* Angular Material
* HTML5
* CSS3
* RxJS

## Backend

* Java 21 LTS
* Spring Boot 3.5.x
* Spring Data JPA
* Spring Security
* JWT
* Hibernate
* Maven

## Base de Datos

* PostgreSQL 17.x

## Herramientas

* Visual Studio Code
* IntelliJ IDEA Community
* PostgreSQL
* pgAdmin 4
* Git
* GitHub
* Bruno (Pruebas API)

---

# Arquitectura

```text
Angular

      │

REST API

      │

Spring Boot

      │

PostgreSQL
```

Arquitectura basada en cliente-servidor utilizando una API REST.

---

# Módulos Iniciales

* Autenticación
* Usuarios
* Roles
* Productos
* Categorías
* Ventas (POS)
* Clientes
* Inventario
* Caja
* Reportes
* Configuración
* Impresión de recibos

---

# Funcionalidades

## Productos

* Crear productos
* Editar productos
* Eliminar productos
* Consultar productos

## Categorías

* Crear categorías
* Editar categorías
* Eliminar categorías

## Ventas

* Buscar productos
* Agregar productos al carrito
* Calcular subtotal
* Calcular total
* Registrar venta
* Generar recibo

## Inventario

* Entradas
* Salidas
* Existencias
* Kardex (Fase futura)

## Reportes

* Ventas del día
* Ventas por fechas
* Productos más vendidos
* Inventario

---

# Base de Datos

Motor seleccionado:

**PostgreSQL**

Razones:

* Gratuito.
* Código abierto.
* Uso comercial permitido.
* Alta estabilidad.
* Excelente integración con Spring Boot.
* Excelente rendimiento.
* Escalable.

---

# Estructura del Proyecto

```
panaderia-pos/

│

├── frontend/

│      └── Angular

│

├── backend/

│      └── Spring Boot

│

├── database/

│      ├── Scripts SQL

│      └── Migraciones Flyway

│

├── docs/

│      ├── Arquitectura

│      ├── Diagramas

│      └── Manual Técnico

│

└── README.md
```

---

# Metodología

Se trabajará bajo una metodología incremental.

Cada módulo deberá estar completamente terminado antes de iniciar el siguiente.

Cada funcionalidad incluirá:

* Desarrollo
* Pruebas
* Corrección
* Documentación

---

# Buenas Prácticas

* Clean Code.
* SOLID.
* Arquitectura en capas.
* Convenciones de nombres.
* Uso de DTO.
* Uso de Services.
* Uso de Repository.
* Uso de Exceptions personalizadas.
* Uso de Flyway para migraciones.
* Uso de Git Flow.

---

# Control de Versiones

Repositorio Git.

Ramas:

```
main
develop
feature/*
release/*
hotfix/*
```

---

# Convenciones

## Backend

```
controller
service
repository
entity
dto
mapper
config
security
exception
util
```

## Frontend

```
core
shared
layout
modules
services
guards
interceptors
models
interfaces
components
```

---

# Fases del Proyecto

## Fase 1

* Arquitectura
* Configuración del entorno
* Base de datos

## Fase 2

* Login
* Usuarios
* Roles

## Fase 3

* Productos
* Categorías

## Fase 4

* POS
* Ventas

## Fase 5

* Inventario

## Fase 6

* Reportes

## Fase 7

* Configuración

## Fase 8

* Pruebas

## Fase 9

* Despliegue

---

# Futuras Mejoras

* Facturación electrónica.
* Múltiples sucursales.
* Aplicación móvil.
* Dashboard administrativo.
* Estadísticas.
* Domicilios.
* Integración con códigos de barras.
* Integración con lectores biométricos.
* Integración con datáfonos.
* Integración con WhatsApp.

---

# Licencia

Proyecto privado para uso comercial del cliente.

---

# Estado del Proyecto

🟢 En fase de análisis y diseño.
