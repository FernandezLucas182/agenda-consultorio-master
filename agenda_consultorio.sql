-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2026 a las 02:09:20
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
  `dias` varchar(100) DEFAULT NULL,
  `horarios` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendas_nueva`
--

CREATE TABLE `agendas_nueva` (
  `id` int(11) NOT NULL,
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL,
  `duracion_turno` int(11) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `agendas_nueva`
--

INSERT INTO `agendas_nueva` (`id`, `profesional_id`, `especialidad_id`, `duracion_turno`, `activo`) VALUES
(4, 1, 1, 30, 1),
(5, 1, 6, 40, 1),
(6, 3, 4, 20, 1),
(7, 3, 2, 30, 1),
(8, 4, 3, 30, 1),
(9, 4, 6, 45, 1),
(10, 3, 6, 45, 1),
(11, 3, 1, 40, 1),
(12, 3, 1, 40, 1),
(13, 3, 1, 40, 1),
(14, 3, 1, 50, 1),
(15, 3, 1, 50, 1),
(16, 3, 1, 50, 1),
(17, 4, 3, 30, 1),
(18, 5, 2, 10, 1),
(19, 4, 3, 10, 1),
(20, 4, 5, 10, 1),
(21, 4, 5, 10, 1),
(22, 6, 1, 30, 1),
(23, 6, 4, 20, 1),
(24, 3, 1, 10, 1),
(25, 7, 2, 20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda_horarios`
--

CREATE TABLE `agenda_horarios` (
  `id` int(11) NOT NULL,
  `agenda_id` int(11) NOT NULL,
  `dia_semana` int(11) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `agenda_horarios`
--

INSERT INTO `agenda_horarios` (`id`, `agenda_id`, `dia_semana`, `hora_inicio`, `hora_fin`) VALUES
(3, 4, 1, '09:00:00', '13:00:00'),
(4, 4, 3, '16:00:00', '20:00:00'),
(5, 5, 2, '10:00:00', '14:00:00'),
(6, 6, 1, '08:00:00', '12:00:00'),
(7, 6, 4, '15:00:00', '18:00:00'),
(8, 8, 5, '09:00:00', '13:00:00'),
(9, 8, 1, '09:00:00', '20:00:00'),
(10, 6, 1, '16:00:00', '21:00:00'),
(11, 6, 7, '09:00:00', '12:00:00'),
(12, 6, 7, '17:00:00', '21:00:00'),
(13, 6, 7, '18:00:00', '21:00:00'),
(14, 14, 6, '09:00:00', '12:00:00'),
(15, 15, 6, '17:00:00', '19:00:00'),
(17, 21, 4, '11:00:00', '14:00:00'),
(18, 20, 4, '17:00:00', '21:00:00'),
(19, 22, 3, '09:00:00', '12:00:00'),
(20, 22, 3, '18:00:00', '21:00:00'),
(21, 23, 1, '07:00:00', '12:00:00'),
(22, 23, 1, '17:00:00', '21:00:00'),
(23, 24, 2, '10:00:00', '13:00:00'),
(24, 25, 5, '12:00:00', '21:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`) VALUES
(1, 'Cardiología'),
(6, 'Kinesiología'),
(5, 'Neurología'),
(14, 'Obstetricia'),
(3, 'Odontología'),
(4, 'Pediatría'),
(7, 'Psicología'),
(12, 'Psiquiatría'),
(13, 'Radiología'),
(2, 'Traumatología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `feriados`
--

CREATE TABLE `feriados` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `feriados`
--

INSERT INTO `feriados` (`id`, `fecha`, `descripcion`) VALUES
(1, '2026-01-01', 'Año Nuevo'),
(2, '2026-03-24', 'Memoria'),
(3, '2026-04-02', 'Malvinas'),
(4, '2026-05-01', 'Día del trabajador'),
(5, '2026-02-16', 'Carnaval'),
(6, '2026-02-17', 'Carnaval'),
(7, '2026-04-03', 'Viernes Santo'),
(8, '2026-05-25', 'Revolución de Mayo'),
(9, '2026-06-20', 'Día de la Bandera'),
(10, '2026-07-09', 'Independencia'),
(11, '2026-08-17', 'San Martín'),
(12, '2026-10-12', 'Diversidad Cultural'),
(13, '2026-11-20', 'Soberanía Nacional'),
(14, '2026-12-08', 'Inmaculada Concepción'),
(15, '2026-12-25', 'Navidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `obra_social` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `dni`, `obra_social`, `contacto`) VALUES
(1, 'Juan Pérez', '30111222', 'OSDE', '1133445566'),
(2, 'María Gómez', '28999888', 'Swiss Medical', '1144556677'),
(27, 'Carlos Gómez', '33111222', 'OSDE', 'carlos@gmail.com'),
(28, 'María López', '28999444', 'Swiss Medical', 'maria@gmail.com'),
(29, 'Ana Torres', '31222333', 'IOMA', 'ana@gmail.com'),
(30, 'Pedro Fernández', '27555666', 'PAMI', 'pedro@gmail.com'),
(31, 'Lucía Herrera', '33444777', 'Galeno', 'lucia@gmail.com'),
(32, 'Sofía Ramírez', '35666888', 'OSDE', 'sofia@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `hora_inicio_turno1` time DEFAULT NULL,
  `hora_fin_turno1` time DEFAULT NULL,
  `hora_inicio_turno2` time DEFAULT NULL,
  `hora_fin_turno2` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id`, `nombre_completo`, `matricula`, `estado`, `hora_inicio_turno1`, `hora_fin_turno1`, `hora_inicio_turno2`, `hora_fin_turno2`) VALUES
(1, 'Juan Carlos Bodoque', '1234', 'activo', '09:30:00', '13:00:00', '17:30:00', '21:00:00'),
(3, 'Esteban Aguero', '584236', 'activo', '09:30:00', '13:00:00', NULL, NULL),
(4, 'Jose Gonzalez', '469873', 'activo', NULL, NULL, '17:00:00', '21:00:00'),
(5, 'Silvio Rodrigues', '44568', 'activo', '10:00:00', '13:00:00', '16:30:00', '20:00:00'),
(6, 'Soledad Gil', '8523654', 'activo', '09:00:00', '12:30:00', '18:30:00', '20:30:00'),
(7, 'Claudia Ruiz', '6458297', 'activo', '09:00:00', '11:00:00', '20:00:00', '21:00:00'),
(8, 'Miguel Abuelo', '9001', 'activo', NULL, NULL, NULL, NULL),
(9, 'Marge Simpson', '9002', 'activo', NULL, NULL, NULL, NULL),
(10, 'Violeta Parra', '9003', 'activo', NULL, NULL, NULL, NULL),
(12, 'José Roberto', '1913456', 'activo', '09:00:00', '13:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_especialidad`
--

CREATE TABLE `profesional_especialidad` (
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `profesional_especialidad`
--

INSERT INTO `profesional_especialidad` (`profesional_id`, `especialidad_id`) VALUES
(1, 4),
(1, 5),
(1, 6),
(3, 1),
(3, 6),
(4, 3),
(4, 5),
(5, 2),
(6, 1),
(6, 4),
(7, 2),
(8, 2),
(8, 13),
(9, 5),
(9, 14),
(10, 12),
(12, 4),
(12, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id`, `nombre`) VALUES
(1, 'Consultorio Central'),
(2, 'Clínica Norte');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `profesional_id` int(11) NOT NULL,
  `especialidad_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('libre','reservado','confirmado','cancelado','ausente','presente','en_consulta','atendido') DEFAULT 'reservado'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id`, `paciente_id`, `profesional_id`, `especialidad_id`, `sucursal_id`, `fecha`, `hora`, `estado`) VALUES
(1, 1, 6, 1, 1, '2026-02-12', '10:50:00', 'confirmado'),
(2, 1, 4, 5, 2, '2026-02-21', '10:00:00', 'reservado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacaciones`
--

CREATE TABLE `vacaciones` (
  `id` int(11) NOT NULL,
  `profesional_id` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `vacaciones`
--

INSERT INTO `vacaciones` (`id`, `profesional_id`, `fecha_inicio`, `fecha_fin`) VALUES
(1, 1, '2026-01-15', '2026-01-31'),
(2, 3, '2026-02-10', '2026-02-20'),
(3, 4, '2026-03-01', '2026-03-15'),
(4, 5, '2026-01-05', '2026-01-18'),
(5, 6, '2026-02-01', '2026-02-12'),
(6, 7, '2026-03-20', '2026-04-05'),
(7, 8, '2026-01-10', '2026-01-25'),
(8, 9, '2026-02-15', '2026-02-28'),
(9, 10, '2026-03-05', '2026-03-20'),
(10, 12, '2026-01-20', '2026-02-02');

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
-- Indices de la tabla `agendas_nueva`
--
ALTER TABLE `agendas_nueva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesional_id` (`profesional_id`),
  ADD KEY `especialidad_id` (`especialidad_id`);

--
-- Indices de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agenda_id` (`agenda_id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `feriados`
--
ALTER TABLE `feriados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fecha` (`fecha`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`);

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
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `profesional_id` (`profesional_id`),
  ADD KEY `especialidad_id` (`especialidad_id`),
  ADD KEY `sucursal_id` (`sucursal_id`);

--
-- Indices de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesional_id` (`profesional_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agendas`
--
ALTER TABLE `agendas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `agendas_nueva`
--
ALTER TABLE `agendas_nueva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `feriados`
--
ALTER TABLE `feriados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agendas`
--
ALTER TABLE `agendas`
  ADD CONSTRAINT `agendas_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`);

--
-- Filtros para la tabla `agendas_nueva`
--
ALTER TABLE `agendas_nueva`
  ADD CONSTRAINT `agendas_nueva_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `agendas_nueva_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`);

--
-- Filtros para la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  ADD CONSTRAINT `agenda_horarios_ibfk_1` FOREIGN KEY (`agenda_id`) REFERENCES `agendas_nueva` (`id`);

--
-- Filtros para la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`);

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`),
  ADD CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`),
  ADD CONSTRAINT `turnos_ibfk_4` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
