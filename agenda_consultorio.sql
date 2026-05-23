-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-05-2026 a las 00:06:15
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
(1, 1, 10, '2026-02-26 09:38:37', 2, 3, 1, 1),
(2, 2, 30, '2026-02-26 11:11:40', 5, 2, 1, 1),
(3, 3, 60, '2026-02-27 22:49:34', 6, 0, 1, NULL),
(4, 4, 30, '2026-02-27 22:50:55', 6, 0, 1, NULL),
(6, 7, 40, '2026-05-06 05:45:28', 3, 0, 1, NULL),
(7, 1, 30, '2026-05-11 20:06:03', 2, 0, 1, 2),
(8, 8, 20, '2026-05-11 21:22:36', 3, 0, 1, 2),
(9, 5, 20, '2026-05-20 13:34:41', 3, 0, 1, 2),
(10, 13, 50, '2026-05-20 16:01:45', 11, 0, 1, 2),
(11, 10, 20, '2026-05-20 16:13:02', 10, 0, 1, 2),
(12, 14, 20, '2026-05-20 16:22:32', 8, 0, 1, 1),
(13, 9, 30, '2026-05-20 16:29:58', 9, 0, 1, 1),
(14, 6, 40, '2026-05-20 16:33:43', 4, 0, 1, 1),
(15, 1, 30, '2026-05-20 21:09:56', 4, 0, 1, 1),
(17, 2, 20, '2026-05-21 00:37:32', 5, 0, 1, 2),
(19, 5, 30, '2026-05-21 21:58:04', 8, 0, 1, 1);

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
(49, 2, 2, '14:00:00', '18:00:00'),
(50, 2, 4, '14:00:00', '18:00:00'),
(51, 3, 1, '09:00:00', '13:00:00'),
(52, 4, 5, '10:00:00', '16:00:00'),
(53, 6, 1, '09:00:00', '21:00:00'),
(54, 6, 2, '09:30:00', '19:00:00'),
(55, 6, 3, '09:00:00', '19:30:00'),
(56, 6, 4, '11:00:00', '20:00:00'),
(57, 6, 5, '11:30:00', '20:30:00'),
(58, 6, 6, '11:00:00', '18:30:00'),
(59, 7, 2, '09:00:00', '19:30:00'),
(60, 7, 4, '10:00:00', '19:30:00'),
(61, 7, 5, '09:00:00', '20:30:00'),
(62, 7, 6, '09:00:00', '13:00:00'),
(63, 8, 1, '09:00:00', '20:30:00'),
(64, 8, 2, '09:00:00', '20:30:00'),
(65, 8, 3, '09:00:00', '19:00:00'),
(66, 8, 4, '10:30:00', '18:00:00'),
(67, 8, 5, '09:30:00', '20:00:00'),
(74, 9, 1, '09:00:00', '12:30:00'),
(75, 9, 2, '09:30:00', '19:30:00'),
(76, 9, 3, '09:00:00', '12:00:00'),
(77, 9, 3, '16:00:00', '20:30:00'),
(78, 9, 4, '09:00:00', '20:30:00'),
(79, 9, 5, '09:30:00', '18:30:00'),
(80, 1, 1, '09:00:00', '12:00:00'),
(81, 1, 3, '09:00:00', '12:00:00'),
(82, 10, 1, '09:00:00', '20:30:00'),
(83, 10, 2, '09:00:00', '20:30:00'),
(84, 10, 3, '09:00:00', '16:00:00'),
(85, 10, 4, '09:00:00', '12:00:00'),
(86, 11, 1, '09:00:00', '17:30:00'),
(87, 11, 2, '17:00:00', '21:00:00'),
(88, 11, 3, '10:30:00', '21:00:00'),
(89, 12, 1, '09:00:00', '20:30:00'),
(90, 12, 2, '11:30:00', '20:00:00'),
(91, 12, 3, '09:00:00', '20:30:00'),
(92, 12, 4, '09:00:00', '20:00:00'),
(93, 12, 5, '10:00:00', '20:30:00'),
(94, 13, 1, '13:00:00', '20:00:00'),
(95, 13, 2, '10:30:00', '20:30:00'),
(96, 14, 1, '09:30:00', '20:30:00'),
(97, 14, 2, '16:00:00', '20:30:00'),
(98, 15, 1, '09:30:00', '20:00:00'),
(99, 17, 1, '11:00:00', '13:00:00'),
(100, 19, 3, '12:00:00', '16:00:00');

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
(4, '2026-04-23', '2026-04-24', 'viaje laboral', '2026-04-20 23:57:42', 1),
(5, '2026-09-15', '2026-09-17', 'congreso', '2026-05-22 23:49:19', 2),
(6, '2026-09-02', '2026-05-16', 'viaje laboral', '2026-05-23 18:59:16', 2),
(7, '2026-09-15', '2026-05-17', 'por que le dio ganas', '2026-05-23 19:29:07', 2),
(8, '2026-09-15', '2026-09-17', 'por que le dio ganas', '2026-05-23 19:30:13', 2),
(9, '2026-06-23', '2026-06-26', 'viaje', '2026-05-23 19:45:25', 7),
(10, '2026-05-21', '2026-05-24', 'por que si', '2026-05-23 20:10:18', 9);

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
(12, 'Gastroenterología'),
(11, 'Generalista'),
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
(5, 'Manuel', '14758639', 'osde', 'manuelH@gmail.com', '2026-04-21 00:01:00'),
(6, 'Josefina Duarte', '30569874', 'no', 'jose_fina@gmail.com', '2026-05-11 18:18:26'),
(7, 'Matilda', '41236589', 'no', 'matimatilda@gmail.com', '2026-05-11 18:24:22');

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
(1, '258954699', 'Juan', 'Pérez', '39932820', '2664342592', 'juan.perez11@gmail.com', 'activo', '2026-02-26 06:30:05'),
(2, '1234', 'Ana', 'Gómez', '27156222', '2664982373', 'ana.gomez2@gmail.com', 'activo', '2026-02-26 06:57:28'),
(3, '6644979', 'Carlos', 'Lopez', '36572856', '2664281771', 'carlos.lopez3@gmail.com', 'activo', '2026-02-26 07:16:59'),
(4, '753159', 'María', 'Fernandez', '30478278', '2664112297', 'maría.fernandez4@gmail.com', 'activo', '2026-02-26 07:17:26'),
(5, '7418523', 'Luis', 'Martinez', '29931581', '2664497712', 'luis.martinez5@gmail.com', 'activo', '2026-02-27 22:43:39'),
(6, '32145469', 'Sofía', 'Ramirez', '34395547', '2664345860', 'sofía.ramirez6@gmail.com', 'activo', '2026-02-27 22:44:19'),
(7, '8523641', 'Diego', 'Torres', '24131168', '2664291932', 'diego.torres7@gmail.com', 'activo', '2026-02-27 22:45:33'),
(8, '95368412', 'Lucía', 'Sosa', '28932287', '2664633968', 'lucía.sosa8@gmail.com', 'activo', '2026-02-27 22:46:25'),
(9, '7496158', 'Pedro', 'Gimenez', '32532949', '2664418008', 'pedro.gimenez9@gmail.com', 'activo', '2026-03-24 16:44:27'),
(10, '8436951', 'Valentina', 'Ruiz', '37735460', '2664436452', 'valentina.ruiz10@gmail.com', 'activo', '2026-04-08 03:10:24'),
(11, '8529314', 'Jorge', 'Acosta', '24177207', '2664930514', 'jorge.acosta11@gmail.com', 'activo', '2026-04-08 05:22:20'),
(12, '74125893325', 'Anibal', 'Farias', '22789363', '2665888888', 'anibalF@gmail.com', 'activo', '2026-04-16 23:23:09'),
(13, '55547841', 'Emiliano', 'Ferreyra', '24656892', '2665458585', 'EmilFerr@gmail.com', 'activo', '2026-05-05 04:17:04'),
(14, '7536986889', 'Luis', 'Carrizo', '19256784', '266789452', 'LuisC19@gmail.com', 'activo', '2026-05-11 17:41:18'),
(15, '25631478', 'Martin', 'Giuliani', '20456789', '2665874125', 'GiuMartin@gmail.com', 'activo', '2026-05-11 19:53:08');

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
(12, 9),
(13, 11),
(14, 8),
(15, 12);

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
(2, 2, 1),
(3, 7, 1),
(6, 7, 2);

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
  `estado` enum('pendiente','confirmado','cancelado','ausente','reprogramado','reprogramar','reservado') DEFAULT NULL,
  `tipo_turno` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `agenda_id`, `paciente_id`, `profesional_id`, `especialidad_id`, `sucursal_id`, `fecha`, `hora`, `estado`, `tipo_turno`, `observaciones`, `created_at`) VALUES
(3, 2, 1, 2, 5, 1, '2026-03-23', '09:30:00', 'pendiente', 'normal', NULL, '2026-03-21 00:09:09'),
(7, 2, 1, 2, 5, 1, '2026-03-23', '10:00:00', 'pendiente', 'normal', NULL, '2026-03-22 06:13:23'),
(10, 2, 2, 2, 5, 1, '2026-03-23', '09:30:01', 'pendiente', 'sobreturno', NULL, '2026-03-22 22:50:10'),
(11, 3, 1, 3, 6, 1, '2026-03-26', '09:00:00', 'pendiente', 'normal', NULL, '2026-03-23 19:54:08'),
(13, 3, 1, 3, 6, 2, '2026-04-08', '19:00:00', 'pendiente', 'normal', NULL, '2026-04-08 06:01:54'),
(14, 2, 1, 2, 5, 1, '2026-04-17', '14:00:00', 'pendiente', 'normal', NULL, '2026-04-10 00:59:06'),
(15, 2, 1, 2, 5, 1, '2026-04-16', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:19:30'),
(16, 2, 1, 2, 5, 1, '2026-04-23', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:43:17'),
(17, 2, 1, 2, 5, NULL, '2026-04-29', '10:00:00', 'confirmado', 'normal', NULL, '2026-04-14 23:55:50'),
(18, 2, 1, 2, 5, 1, '2026-04-16', '16:30:01', 'pendiente', 'sobreturno', NULL, '2026-04-15 01:25:22'),
(19, 2, 4, 2, 5, 1, '2026-04-21', '19:00:00', 'pendiente', 'normal', NULL, '2026-04-15 01:27:17'),
(20, 2, 1, 2, 5, 1, '2026-04-14', '13:00:00', 'pendiente', 'normal', NULL, '2026-04-18 21:52:07'),
(22, 1, 1, 1, 2, 1, '2026-05-13', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-05 04:51:59'),
(24, 1, 2, 1, 2, 1, '2026-05-20', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-06 00:51:15'),
(25, 1, 4, 1, 2, 1, '2026-05-11', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-06 01:01:07'),
(26, 1, 2, 1, 2, NULL, '2026-05-27', '09:00:00', 'confirmado', 'normal', NULL, '2026-05-06 01:17:49'),
(27, 1, 1, 1, 2, 1, '2026-05-27', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-06 04:19:06'),
(29, 2, 4, 2, 5, 1, '2026-05-19', '17:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:39:31'),
(30, 1, 5, 1, 4, 1, '2026-06-24', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:47:12'),
(31, 3, 6, 3, 6, NULL, '2026-05-18', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:52:39'),
(32, 3, 7, 3, 6, NULL, '2026-06-15', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:03'),
(33, 2, 5, 2, 5, 1, '2026-05-19', '16:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:27'),
(34, 6, 3, 7, 3, NULL, '2026-05-13', '17:40:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:08'),
(35, 1, 2, 1, 2, 1, '2026-05-13', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:27'),
(36, 1, 1, 1, 2, 1, '2026-05-13', '09:30:00', 'pendiente', 'normal', NULL, '2026-05-13 00:26:26'),
(37, 2, 2, 2, 5, 1, '2026-09-15', '14:00:00', '', 'normal', NULL, '2026-05-13 00:33:35'),
(38, 2, 1, 2, 5, 1, '2026-09-15', '14:00:01', '', 'sobreturno', NULL, '2026-05-13 00:43:58'),
(39, 1, 1, 1, 2, 1, '2026-05-13', '08:00:00', 'pendiente', 'normal', NULL, '2026-05-13 02:05:36'),
(40, 2, 1, 2, 5, 1, '2026-05-21', '14:00:00', 'pendiente', 'normal', NULL, '2026-05-20 15:43:36'),
(41, 9, 2, 5, 3, NULL, '2026-06-10', '09:00:00', 'confirmado', 'normal', NULL, '2026-05-20 15:58:29'),
(42, 10, 7, 13, 11, 2, '2026-05-20', '09:00:00', 'pendiente', 'normal', NULL, '2026-05-20 16:02:11');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `profesional_sucursal`
--
ALTER TABLE `profesional_sucursal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

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
