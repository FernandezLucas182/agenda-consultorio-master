-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2026 a las 04:44:55
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
  `activo` tinyint(1) DEFAULT 1,
  `sucursal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agendas`
--

INSERT INTO `agendas` (`id`, `profesional_id`, `duracion_turno`, `created_at`, `especialidad_id`, `max_sobreturnos`, `activo`, `sucursal_id`) VALUES
(1, 1, 30, '2026-02-26 09:38:37', 2, 0, 1, 1),
(2, 2, 30, '2026-02-26 11:11:40', 5, 2, 1, 1),
(3, 3, 60, '2026-02-27 22:49:34', 6, 0, 1, NULL),
(4, 4, 30, '2026-02-27 22:50:55', 6, 0, 1, NULL);

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
(47, 1, 1, '08:00:00', '12:00:00'),
(48, 1, 3, '08:00:00', '12:00:00'),
(49, 2, 2, '14:00:00', '18:00:00'),
(50, 2, 4, '14:00:00', '18:00:00'),
(51, 3, 1, '09:00:00', '13:00:00'),
(52, 4, 5, '10:00:00', '16:00:00');

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
  `agenda_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ausencias`
--

INSERT INTO `ausencias` (`id`, `fecha_inicio`, `fecha_fin`, `motivo`, `created_at`, `agenda_id`) VALUES
(2, '2026-01-07', '2026-01-31', 'Vacaciones', '2026-04-18 22:55:28', 1),
(3, '2026-06-05', '2026-06-05', 'Vacaciones', '2026-04-20 23:47:28', 2),
(4, '2026-04-23', '2026-04-24', 'viaje laboral', '2026-04-20 23:57:42', 1);

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
(10, 'Radiología'),
(8, 'Traumatología'),
(9, 'Urología');

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
(1, 'Lucas Fernandez', '33555997', 'Swiss Medical', 'fernandez19lucas13@gmail.com', '2026-02-26 06:55:26'),
(2, 'ester', '14059365', 'femesa', 'esterJL192634@gmail.com', '2026-03-22 21:37:23'),
(3, 'Gabriel Guzmán', '14789253', 'sancor', 'GGuzman@gmail.com', '2026-03-24 17:02:49'),
(4, 'olga Jaime', '24963145', 'dosep', '2665851475', '2026-04-15 01:26:13'),
(5, 'Manuel', '14758639', 'osde', 'manuelH@gmail.com', '2026-04-21 00:01:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id` int(11) NOT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id`, `matricula`, `nombre`, `apellido`, `dni`, `telefono`, `email`, `estado`, `created_at`) VALUES
(1, '258954699', 'Juan', 'Pérez', '39932820', '2664342592', 'juan.pérez1@gmail.com', 'activo', '2026-02-26 06:30:05'),
(2, '1234', 'Ana', 'Gómez', '27156222', '2664982373', 'ana.gómez2@gmail.com', 'activo', '2026-02-26 06:57:28'),
(3, '6644979', 'Carlos', 'Lopez', '36572856', '2664281771', 'carlos.lopez3@gmail.com', 'activo', '2026-02-26 07:16:59'),
(4, '753159', 'María', 'Fernandez', '30478278', '2664112297', 'maría.fernandez4@gmail.com', 'activo', '2026-02-26 07:17:26'),
(5, '7418523', 'Luis', 'Martinez', '29931581', '2664497712', 'luis.martinez5@gmail.com', 'activo', '2026-02-27 22:43:39'),
(6, '32145469', 'Sofía', 'Ramirez', '34395547', '2664345860', 'sofía.ramirez6@gmail.com', 'activo', '2026-02-27 22:44:19'),
(7, '8523641', 'Diego', 'Torres', '24131168', '2664291932', 'diego.torres7@gmail.com', 'activo', '2026-02-27 22:45:33'),
(8, '95368412', 'Lucía', 'Sosa', '28932287', '2664633968', 'lucía.sosa8@gmail.com', 'activo', '2026-02-27 22:46:25'),
(9, '7496158', 'Pedro', 'Gimenez', '32532949', '2664418008', 'pedro.gimenez9@gmail.com', 'activo', '2026-03-24 16:44:27'),
(10, '8436951', 'Valentina', 'Ruiz', '37735460', '2664436452', 'valentina.ruiz10@gmail.com', 'activo', '2026-04-08 03:10:24'),
(11, '8529314', 'Jorge', 'Acosta', '24177207', '2664930514', 'jorge.acosta11@gmail.com', 'activo', '2026-04-08 05:22:20'),
(12, '74125893325', 'Anibal', 'Farias', '22789363', '2665888888', 'anibalF@gmail.com', 'activo', '2026-04-16 23:23:09');

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
(1, 4),
(2, 5),
(3, 6),
(4, 6),
(5, 3),
(5, 8),
(6, 4),
(7, 3),
(8, 3),
(9, 9),
(10, 10),
(11, 4),
(12, 2),
(12, 5),
(12, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_sucursal`
--

CREATE TABLE `profesional_sucursal` (
  `id` int(11) NOT NULL,
  `profesional_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_sucursal`
--

INSERT INTO `profesional_sucursal` (`id`, `profesional_id`, `sucursal_id`) VALUES
(1, 1, 1),
(2, 2, 1);

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
  `sucursal_id` int(11) DEFAULT NULL,
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
(7, 2, 1, 2, 5, 1, '2026-03-23', '10:00:00', '', 'normal', NULL, '2026-03-22 06:13:23'),
(10, 2, 2, 2, 5, 1, '2026-03-23', '09:30:01', '', 'sobreturno', NULL, '2026-03-22 22:50:10'),
(11, 3, 1, 3, 6, 1, '2026-03-26', '09:00:00', '', 'normal', NULL, '2026-03-23 19:54:08'),
(13, 3, 1, 3, 6, 2, '2026-04-08', '19:00:00', '', 'normal', NULL, '2026-04-08 06:01:54'),
(14, 2, 1, 2, 5, 1, '2026-04-17', '14:00:00', '', 'normal', NULL, '2026-04-10 00:59:06'),
(15, 2, 1, 2, 5, 1, '2026-04-16', '16:00:00', '', 'normal', NULL, '2026-04-14 23:19:30'),
(16, 2, 1, 2, 5, 1, '2026-04-23', '16:00:00', '', 'normal', NULL, '2026-04-14 23:43:17'),
(17, 2, 1, 2, 5, NULL, '2026-04-29', '10:00:00', 'confirmado', 'normal', NULL, '2026-04-14 23:55:50'),
(18, 2, 1, 2, 5, 1, '2026-04-16', '16:30:01', '', 'sobreturno', NULL, '2026-04-15 01:25:22'),
(19, 2, 4, 2, 5, 1, '2026-04-21', '19:00:00', '', 'normal', NULL, '2026-04-15 01:27:17'),
(20, 2, 1, 2, 5, 1, '2026-04-14', '13:00:00', '', 'normal', NULL, '2026-04-18 21:52:07'),
(21, 1, 2, 1, 2, 1, '2026-05-18', '08:30:00', '', 'normal', NULL, '2026-05-05 01:51:30');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ausencias_agenda` (`agenda_id`);

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
-- Indices de la tabla `profesional_sucursal`
--
ALTER TABLE `profesional_sucursal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `profesional_id` (`profesional_id`,`sucursal_id`),
  ADD KEY `sucursal_id` (`sucursal_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `profesional_sucursal`
--
ALTER TABLE `profesional_sucursal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
-- Filtros para la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD CONSTRAINT `fk_ausencias_agenda` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`);

--
-- Filtros para la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesional_sucursal`
--
ALTER TABLE `profesional_sucursal`
  ADD CONSTRAINT `profesional_sucursal_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `profesional_sucursal_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

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
