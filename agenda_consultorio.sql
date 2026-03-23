-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-03-2026 a las 07:18:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agenda_consultorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendas`
--

CREATE TABLE `agendas` (
  `id` int(11) NOT NULL,
  `profesional_id` int(11) NOT NULL,
  `duracion_turno` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `especialidad_id` int(11) NOT NULL,
  `max_sobreturnos` int(11) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agendas`
--

INSERT INTO `agendas` (`id`, `profesional_id`, `duracion_turno`, `created_at`, `especialidad_id`, `max_sobreturnos`, `activo`) VALUES
(1, 1, 30, '2026-02-26 09:38:37', 2, 0, 1),
(2, 2, 30, '2026-02-26 11:11:40', 5, 2, 1),
(3, 3, 60, '2026-02-27 22:49:34', 6, 0, 1),
(4, 4, 30, '2026-02-27 22:50:55', 6, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda_horarios`
--

CREATE TABLE `agenda_horarios` (
  `id` int(11) NOT NULL,
  `agenda_id` int(11) NOT NULL,
  `dia_semana` tinyint(4) NOT NULL CHECK (`dia_semana` between 1 and 7),
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda_horarios`
--

INSERT INTO `agenda_horarios` (`id`, `agenda_id`, `dia_semana`, `hora_inicio`, `hora_fin`) VALUES
(4, 1, 1, '09:00:00', '21:00:00'),
(7, 3, 1, '09:00:00', '21:00:00'),
(8, 3, 2, '09:00:00', '21:00:00'),
(9, 3, 3, '09:00:00', '21:00:00'),
(10, 3, 4, '09:00:00', '21:00:00'),
(11, 3, 5, '09:00:00', '21:00:00'),
(12, 3, 6, '09:00:00', '13:00:00'),
(13, 4, 1, '09:00:00', '21:00:00'),
(14, 4, 2, '09:00:00', '21:00:00'),
(15, 4, 3, '09:00:00', '21:00:00'),
(16, 4, 4, '09:00:00', '21:00:00'),
(17, 4, 5, '09:00:00', '21:00:00'),
(18, 2, 1, '09:30:00', '21:00:00'),
(19, 2, 2, '09:00:00', '21:00:00'),
(20, 2, 3, '09:00:00', '12:30:00'),
(21, 2, 3, '16:00:00', '21:00:00'),
(22, 2, 4, '09:00:00', '21:00:00'),
(23, 2, 5, '09:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ausencias`
--

CREATE TABLE `ausencias` (
  `id` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profesional_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ausencias`
--

INSERT INTO `ausencias` (`id`, `fecha_inicio`, `fecha_fin`, `motivo`, `created_at`, `profesional_id`) VALUES
(1, '2026-03-24', '2026-03-26', 'viaje laboral', '2026-03-20 22:00:45', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`) VALUES
(3, 'Cardiología'),
(4, 'Dermatología'),
(5, 'Kinesiología'),
(6, 'Odontologia'),
(2, 'Pediatría'),
(8, 'Traumatología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `obra_social` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `dni`, `obra_social`, `contacto`, `created_at`) VALUES
(1, 'Lucas Fernandez', '33555997', 'Swiss Medical', 'fernandez19lucas13@gmail.com', '2026-02-26 06:55:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(150) DEFAULT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id`, `nombre_completo`, `matricula`, `nombre`, `apellido`, `especialidad`, `telefono`, `email`, `estado`, `created_at`) VALUES
(1, 'José Roberto', '2589546', '', '', NULL, NULL, NULL, 'activo', '2026-02-26 06:30:05'),
(2, 'Juan Carlos Bodoque', '1234', '', '', NULL, NULL, NULL, 'activo', '2026-02-26 06:57:28'),
(3, 'Laura Montero', '6644979', '', '', NULL, NULL, NULL, 'activo', '2026-02-26 07:16:59'),
(4, 'Jose Gonzalez', '753159', '', '', NULL, NULL, NULL, 'activo', '2026-02-26 07:17:26'),
(5, 'tulio tribiño', '7418523', '', '', NULL, NULL, NULL, 'activo', '2026-02-27 22:43:39'),
(6, 'Esteban Aguero', '32145469', '', '', NULL, NULL, NULL, 'activo', '2026-02-27 22:44:19'),
(7, 'Silvio Rodrigues', '8523641', '', '', NULL, NULL, NULL, 'activo', '2026-02-27 22:45:33'),
(8, 'Rosa Quinteros', '95368412', '', '', NULL, NULL, NULL, 'activo', '2026-02-27 22:46:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_especialidad`
--

CREATE TABLE `profesional_especialidad` (
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_especialidad`
--

INSERT INTO `profesional_especialidad` (`profesional_id`, `especialidad_id`) VALUES
(1, 2),
(2, 5),
(3, 6),
(4, 6),
(5, 3),
(5, 8),
(6, 4),
(7, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id`, `nombre`, `direccion`) VALUES
(1, 'Sucursal Norte', 'Zona Norte'),
(2, 'Sucursal Central', 'Zona Centro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `agenda_id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('pendiente','confirmado','cancelado','ausente','reprogramado') DEFAULT 'pendiente',
  `tipo_turno` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `agenda_id`, `paciente_id`, `profesional_id`, `especialidad_id`, `sucursal_id`, `fecha`, `hora`, `estado`, `tipo_turno`, `observaciones`, `created_at`) VALUES
(3, 2, 1, 2, 5, 1, '2026-03-23', '09:30:00', '', 'normal', NULL, '2026-03-21 00:09:09'),
(7, 2, 1, 2, 5, 1, '2026-03-23', '10:00:00', '', 'normal', NULL, '2026-03-22 06:13:23');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agendas`
--
ALTER TABLE `agendas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesional_id` (`profesional_id`);

--
-- Indices de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_agenda_horarios_agenda` (`agenda_id`);

--
-- Indices de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nombre` (`nombre`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD PRIMARY KEY (`profesional_id`,`especialidad_id`),
  ADD KEY `especialidad_id` (`especialidad_id`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profesional_id` (`profesional_id`,`fecha`,`hora`),
  ADD KEY `agenda_id` (`agenda_id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `fk_turno_especialidad` (`especialidad_id`),
  ADD KEY `fk_turno_sucursal` (`sucursal_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agendas`
--
ALTER TABLE `agendas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agendas`
--
ALTER TABLE `agendas`
  ADD CONSTRAINT `agendas_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  ADD CONSTRAINT `agenda_horarios_ibfk_1` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agenda_horarios` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agenda_horarios_agenda` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `fk_turno_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`),
  ADD CONSTRAINT `fk_turno_profesional` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `fk_turno_sucursal` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`),
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
