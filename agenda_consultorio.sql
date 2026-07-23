-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-07-2026 a las 23:52:13
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
  `sucursal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agendas`
--

INSERT INTO `agendas` (`id`, `profesional_id`, `duracion_turno`, `created_at`, `especialidad_id`, `max_sobreturnos`, `activo`, `sucursal_id`) VALUES
(1, 1, 10, '2026-02-26 09:38:37', 2, 3, 1, 1),
(2, 2, 30, '2026-02-26 11:11:40', 5, 2, 1, 1),
(3, 3, 60, '2026-02-27 22:49:34', 6, 0, 1, 1),
(4, 4, 30, '2026-02-27 22:50:55', 6, 0, 1, 1),
(6, 7, 40, '2026-05-06 05:45:28', 3, 0, 1, 1),
(7, 1, 30, '2026-05-11 20:06:03', 2, 0, 1, 2),
(8, 8, 20, '2026-05-11 21:22:36', 3, 0, 1, 2),
(9, 5, 20, '2026-05-20 13:34:41', 3, 0, 1, 2),
(10, 13, 50, '2026-05-20 16:01:45', 11, 0, 1, 2),
(11, 10, 20, '2026-05-20 16:13:02', 10, 0, 1, 2),
(12, 14, 20, '2026-05-20 16:22:32', 8, 0, 1, 1),
(13, 9, 30, '2026-05-20 16:29:58', 9, 0, 1, 1),
(14, 6, 40, '2026-05-20 16:33:43', 4, 0, 1, 1),
(15, 1, 30, '2026-05-20 21:09:56', 4, 0, 1, 1),
(19, 5, 30, '2026-05-21 21:58:04', 8, 0, 1, 1),
(23, 11, 30, '2026-06-13 18:43:42', 4, 0, 1, 1),
(24, 12, 30, '2026-06-13 18:43:42', 2, 0, 1, 1),
(25, 12, 30, '2026-06-13 18:43:42', 5, 0, 1, 1),
(26, 12, 30, '2026-06-13 18:43:42', 9, 0, 1, 1),
(27, 15, 30, '2026-06-13 18:43:42', 12, 0, 1, 1),
(30, 2, 10, '2026-07-03 19:33:47', 2, 0, 1, 1),
(32, 16, 30, '2026-07-23 20:42:32', 11, 0, 1, 1);

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
) ;

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
(100, 19, 3, '12:00:00', '16:00:00'),
(110, 1, 2, '20:00:00', '21:00:00'),
(111, 1, 3, '09:00:00', '12:00:00'),
(112, 23, 1, '09:00:00', '13:00:00'),
(113, 23, 2, '09:00:00', '13:00:00'),
(114, 23, 3, '09:00:00', '13:00:00'),
(115, 23, 4, '09:00:00', '13:00:00'),
(116, 23, 5, '09:00:00', '13:00:00'),
(117, 23, 1, '16:00:00', '20:00:00'),
(118, 23, 2, '16:00:00', '20:00:00'),
(119, 23, 3, '16:00:00', '20:00:00'),
(120, 23, 4, '16:00:00', '20:00:00'),
(121, 23, 5, '16:00:00', '20:00:00'),
(122, 24, 1, '09:00:00', '13:00:00'),
(123, 24, 2, '09:00:00', '13:00:00'),
(124, 24, 3, '09:00:00', '13:00:00'),
(125, 24, 4, '09:00:00', '13:00:00'),
(126, 24, 5, '09:00:00', '13:00:00'),
(127, 25, 1, '16:00:00', '20:00:00'),
(128, 25, 2, '16:00:00', '20:00:00'),
(129, 25, 3, '16:00:00', '20:00:00'),
(130, 25, 4, '16:00:00', '20:00:00'),
(131, 25, 5, '16:00:00', '20:00:00'),
(132, 26, 6, '09:00:00', '13:00:00'),
(133, 27, 1, '09:00:00', '18:00:00'),
(134, 27, 2, '09:00:00', '18:00:00'),
(135, 27, 3, '09:00:00', '18:00:00'),
(136, 27, 4, '09:00:00', '18:00:00'),
(137, 27, 5, '09:00:00', '18:00:00'),
(139, 30, 2, '20:00:00', '21:00:00'),
(140, 30, 3, '09:00:00', '12:00:00'),
(141, 32, 1, '09:00:00', '20:30:00'),
(142, 32, 2, '09:00:00', '20:00:00'),
(143, 32, 3, '09:00:00', '19:00:00');

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
) ;

--
-- Volcado de datos para la tabla `ausencias`
--

INSERT INTO `ausencias` (`id`, `fecha_inicio`, `fecha_fin`, `motivo`, `created_at`, `agenda_id`) VALUES
(2, '2026-01-07', '2026-01-31', 'Vacaciones', '2026-04-18 22:55:28', 1),
(3, '2026-06-05', '2026-06-13', 'Vacaciones', '2026-04-20 23:47:28', 2),
(4, '2026-04-23', '2026-04-24', 'viaje laboral', '2026-04-20 23:57:42', 1),
(5, '2026-09-14', '2026-09-18', 'congreso medico', '2026-05-22 23:49:19', 2),
(9, '2026-06-23', '2026-06-26', 'viaje', '2026-05-23 19:45:25', 7),
(10, '2026-05-21', '2026-05-24', 'por que si', '2026-05-23 20:10:18', 9),
(11, '2026-06-23', '2026-06-26', 'viaje laboral', '2026-05-24 21:35:59', 1),
(12, '2026-06-22', '2026-06-30', 'razones de salud', '2026-06-22 15:03:10', 4),
(13, '2026-06-25', '2026-06-30', 'viaje', '2026-06-24 22:07:56', 3),
(14, '2026-07-23', '2026-07-25', 'viaje', '2026-06-25 21:05:08', 10),
(15, '2026-06-27', '2026-06-29', 'viaje', '2026-06-25 21:46:54', 11),
(16, '2026-07-30', '2026-07-31', 'congreso', '2026-06-25 21:48:14', 2),
(17, '2026-06-27', '2026-06-29', 'viaje', '2026-06-25 21:52:05', 19),
(18, '2026-06-26', '2026-06-28', 'viaje+2dia', '2026-06-26 23:22:12', 7),
(19, '2026-07-30', '2026-08-31', 'Vacaciones', '2026-06-26 23:37:33', 4),
(20, '2026-07-09', '2026-07-12', 'curso', '2026-06-26 23:38:14', 4),
(21, '2026-07-07', '2026-07-29', 'enfermedad', '2026-06-27 21:29:07', 8),
(22, '2026-07-15', '2026-07-17', 'tratamiento privado', '2026-07-06 23:38:40', 2),
(23, '2026-08-20', '2026-08-22', 'por nacimiento ', '2026-07-14 02:39:10', 9),
(24, '2026-08-10', '2026-08-13', 'viaje', '2026-07-23 19:26:21', 9),
(25, '2026-07-22', '2026-07-27', 'viaje', '2026-07-23 19:33:23', 9),
(26, '2026-09-10', '2026-09-15', 'congreso', '2026-07-23 21:31:42', 9);

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
(14, 'endocrinología'),
(12, 'Gastroenterología'),
(11, 'Generalista'),
(5, 'Kinesiología'),
(6, 'Odontologia'),
(13, 'oncologia'),
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
  `apellido` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `obra_social` varchar(100) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `apellido`, `dni`, `obra_social`, `telefono`, `created_at`, `email`) VALUES
(1, 'Lucas Maximiliano', 'Fernandez', '33555997', 'Swiss Medical', '2665250181', '2026-02-26 06:55:26', 'fernandez19lucas13@gmail.com'),
(2, 'ester', 'Bonavida', '14059365', 'femesa', '115688784', '2026-03-22 21:37:23', 'esterJL192634@gmail.com'),
(3, 'Gabriel Guzmán', NULL, '14789253', 'sancor', NULL, '2026-03-24 17:02:49', 'GGuzman@gmail.com'),
(4, 'olga Jaime', NULL, '24963145', 'dosep', '2665851475', '2026-04-15 01:26:13', NULL),
(5, 'Manuel', 'Juarez', '14758639', 'osde', '2664789963', '2026-04-21 00:01:00', 'manuelH@gmail.com'),
(6, 'Josefina Duarte', '', '30569874', 'no', '2657893423', '2026-05-11 18:18:26', 'jose_fina@gmail.com'),
(7, 'Matilda', 'heber', '41236589', 'no', '2665456789', '2026-05-11 18:24:22', 'matimatilda@gmail.com'),
(8, 'Josefina', 'Romero', '32456852', 'medicare', '11456895', '2026-06-11 10:59:13', 'joseRoma@gmail.com'),
(9, 'Joel', 'Junin', '33222555', 'ninguna', '2664859632', '2026-06-24 19:51:12', 'JoelJu@gmail.com'),
(10, 'Jaqueline Loretta', 'Gilmur', '47896352', 'osde', '1145896578', '2026-06-24 20:07:13', 'lore_ta@gmail.com'),
(11, 'roberto', 'Timmo', '17894585', 'no', '2664789158', '2026-06-27 21:19:25', 'timmoRobertt@hotmail.com'),
(12, 'Ana', 'Pérez', '40111222', 'OSDE', '2664000001', '2026-07-22 02:48:05', 'ana.perez@gmail.com'),
(13, 'Carlos', 'Gómez', '39111223', 'Swiss Medical', '2664000002', '2026-07-22 02:48:05', 'carlos.gomez@gmail.com'),
(14, 'María', 'López', '38111224', 'DOSEP', '2664000003', '2026-07-22 02:48:05', 'maria.lopez@gmail.com'),
(15, 'Pedro', 'Martínez', '37111225', 'Sancor Salud', '2664000004', '2026-07-22 02:48:05', 'pedro.martinez@gmail.com'),
(16, 'Lucía', 'Ruiz', '36111226', 'OSDE', '2664000005', '2026-07-22 02:48:05', 'lucia.ruiz@gmail.com'),
(17, 'Javier', 'Sosa', '35111227', 'Particular', '2664000006', '2026-07-22 02:48:05', 'javier.sosa@gmail.com'),
(18, 'Florencia', 'Castro', '34111228', 'Medifé', '2664000007', '2026-07-22 02:48:05', 'florencia.castro@gmail.com'),
(19, 'Diego', 'Morales', '33111229', 'DOSEP', '2664000008', '2026-07-22 02:48:05', 'diego.morales@gmail.com'),
(20, 'Camila', 'Benítez', '32111230', 'OSPE', '2664000009', '2026-07-22 02:48:05', 'camila.benitez@gmail.com'),
(21, 'Nicolás', 'Rojas', '31111231', 'Swiss Medical', '2664000010', '2026-07-22 02:48:05', 'nicolas.rojas@gmail.com'),
(22, 'Valentina', 'Silva', '30111232', 'OSDE', '2664000011', '2026-07-22 02:48:05', 'valentina.silva@gmail.com'),
(23, 'Matías', 'Navarro', '29111233', 'Particular', '2664000012', '2026-07-22 02:48:05', 'matias.navarro@gmail.com'),
(24, 'Julieta', 'Herrera', '28111234', 'DOSEP', '2664000013', '2026-07-22 02:48:05', 'julieta.herrera@gmail.com'),
(25, 'Federico', 'Torres', '27111235', 'Sancor Salud', '2664000014', '2026-07-22 02:48:05', 'federico.torres@gmail.com'),
(26, 'Carolina', 'Vega', '26111236', 'OSDE', '2664000015', '2026-07-22 02:48:05', 'carolina.vega@gmail.com'),
(27, 'Agustín', 'Molina', '25111237', 'Medifé', '2664000016', '2026-07-22 02:48:05', 'agustin.molina@gmail.com'),
(28, 'Brenda', 'Acosta', '24111238', 'Particular', '2664000017', '2026-07-22 02:48:05', 'brenda.acosta@gmail.com'),
(29, 'Tomás', 'Quiroga', '23111239', 'DOSEP', '2664000018', '2026-07-22 02:48:05', 'tomas.quiroga@gmail.com'),
(30, 'Milagros', 'Ponce', '22111240', 'OSPE', '2664000019', '2026-07-22 02:48:05', 'milagros.ponce@gmail.com'),
(31, 'Franco', 'Luna', '21111241', 'Swiss Medical', '2664000020', '2026-07-22 02:48:05', 'franco.luna@gmail.com'),
(32, 'Ricardo', 'Alvarez', '27110001', 'OSDE', '2664100001', '2026-07-22 20:52:00', 'ricardo.alvarez@gmail.com'),
(33, 'Mónica', 'Suarez', '27110002', 'DOSEP', '2664100002', '2026-07-22 20:52:00', 'monica.suarez@gmail.com'),
(34, 'Fernando', 'Quiroga', '27110003', 'Swiss Medical', '2664100003', '2026-07-22 20:52:00', 'fernando.quiroga@gmail.com'),
(35, 'Laura', 'Nuñez', '27110004', 'Sancor Salud', '2664100004', '2026-07-22 20:52:00', 'laura.nunez@gmail.com'),
(36, 'Miguel', 'Godoy', '27110005', 'Particular', '2664100005', '2026-07-22 20:52:00', 'miguel.godoy@gmail.com'),
(37, 'Patricia', 'Moyano', '27110006', 'OSDE', '2664100006', '2026-07-22 20:52:00', 'patricia.moyano@gmail.com'),
(38, 'Hernán', 'Vega', '27110007', 'DOSEP', '2664100007', '2026-07-22 20:52:00', 'hernan.vega@gmail.com'),
(39, 'Carolina', 'Luna', '27110008', 'Medifé', '2664100008', '2026-07-22 20:52:00', 'carolina.luna@gmail.com'),
(40, 'Gabriel', 'Ponce', '27110009', 'OSPE', '2664100009', '2026-07-22 20:52:00', 'gabriel.ponce@gmail.com'),
(41, 'Silvia', 'Dominguez', '27110010', 'Swiss Medical', '2664100010', '2026-07-22 20:52:00', 'silvia.dominguez@gmail.com'),
(42, 'Andrés', 'Moreno', '27110011', 'OSDE', '2664100011', '2026-07-22 20:52:00', 'andres.moreno@gmail.com'),
(43, 'Romina', 'Arce', '27110012', 'DOSEP', '2664100012', '2026-07-22 20:52:00', 'romina.arce@gmail.com'),
(44, 'Cristian', 'Vargas', '27110013', 'Particular', '2664100013', '2026-07-22 20:52:00', 'cristian.vargas@gmail.com'),
(45, 'Natalia', 'Roldán', '27110014', 'OSDE', '2664100014', '2026-07-22 20:52:00', 'natalia.roldan@gmail.com'),
(46, 'Pablo', 'Escudero', '27110015', 'Sancor Salud', '2664100015', '2026-07-22 20:52:00', 'pablo.escudero@gmail.com'),
(47, 'Noelia', 'Bustos', '27110016', 'Swiss Medical', '2664100016', '2026-07-22 20:52:00', 'noelia.bustos@gmail.com'),
(48, 'Ezequiel', 'Ledesma', '27110017', 'OSPE', '2664100017', '2026-07-22 20:52:00', 'ezequiel.ledesma@gmail.com'),
(49, 'Rocío', 'Miranda', '27110018', 'DOSEP', '2664100018', '2026-07-22 20:52:00', 'rocio.miranda@gmail.com'),
(50, 'Alberto', 'Salinas', '27110019', 'Particular', '2664100019', '2026-07-22 20:52:00', 'alberto.salinas@gmail.com'),
(51, 'Daniela', 'Paz', '27110020', 'OSDE', '2664100020', '2026-07-22 20:52:00', 'daniela.paz@gmail.com'),
(52, 'Tomás', 'Agüero', '27110021', 'Swiss Medical', '2664100021', '2026-07-22 20:52:00', 'tomas.aguero@gmail.com'),
(53, 'Lorena', 'Bravo', '27110022', 'DOSEP', '2664100022', '2026-07-22 20:52:00', 'lorena.bravo@gmail.com'),
(54, 'Sebastián', 'Molina', '27110023', 'OSDE', '2664100023', '2026-07-22 20:52:00', 'sebastian.molina@gmail.com'),
(55, 'Paula', 'Reinoso', '27110024', 'Medifé', '2664100024', '2026-07-22 20:52:00', 'paula.reinoso@gmail.com'),
(56, 'Iván', 'Peralta', '27110025', 'Particular', '2664100025', '2026-07-22 20:52:00', 'ivan.peralta@gmail.com'),
(57, 'Ricardo', 'Alvarez', '42000001', 'OSDE', '2664500001', '2026-07-22 20:53:10', 'ricardo.alvarez1@gmail.com'),
(58, 'Mariana', 'Sanchez', '42000002', 'Swiss Medical', '2664500002', '2026-07-22 20:53:10', 'mariana.sanchez2@gmail.com'),
(59, 'Jorge', 'Ponce', '42000003', 'DOSEP', '2664500003', '2026-07-22 20:53:10', 'jorge.ponce3@gmail.com'),
(60, 'Claudia', 'Vega', '42000004', 'Sancor Salud', '2664500004', '2026-07-22 20:53:10', 'claudia.vega4@gmail.com'),
(61, 'Daniel', 'Quiroga', '42000005', 'Particular', '2664500005', '2026-07-22 20:53:10', 'daniel.quiroga5@gmail.com'),
(62, 'Roxana', 'Molina', '42000006', 'OSDE', '2664500006', '2026-07-22 20:53:10', 'roxana.molina6@gmail.com'),
(63, 'Hugo', 'Navarro', '42000007', 'Medifé', '2664500007', '2026-07-22 20:53:10', 'hugo.navarro7@gmail.com'),
(64, 'Natalia', 'Rojas', '42000008', 'OSPE', '2664500008', '2026-07-22 20:53:10', 'natalia.rojas8@gmail.com'),
(65, 'Mario', 'Castro', '42000009', 'DOSEP', '2664500009', '2026-07-22 20:53:10', 'mario.castro9@gmail.com'),
(66, 'Andrea', 'Benitez', '42000010', 'Swiss Medical', '2664500010', '2026-07-22 20:53:10', 'andrea.benitez10@gmail.com'),
(67, 'Fernando', 'Herrera', '42000011', 'OSDE', '2664500011', '2026-07-22 20:53:10', 'fernando.herrera11@gmail.com'),
(68, 'Silvina', 'Morales', '42000012', 'Particular', '2664500012', '2026-07-22 20:53:10', 'silvina.morales12@gmail.com'),
(69, 'Diego', 'Luna', '42000013', 'DOSEP', '2664500013', '2026-07-22 20:53:10', 'diego.luna13@gmail.com'),
(70, 'Paula', 'Peralta', '42000014', 'Sancor Salud', '2664500014', '2026-07-22 20:53:10', 'paula.peralta14@gmail.com'),
(71, 'José', 'Gimenez', '42000015', 'OSDE', '2664500015', '2026-07-22 20:53:10', 'jose.gimenez15@gmail.com'),
(72, 'Marta', 'Suarez', '42000016', 'OSPE', '2664500016', '2026-07-22 20:53:10', 'marta.suarez16@gmail.com'),
(73, 'Carlos', 'Silva', '42000017', 'Swiss Medical', '2664500017', '2026-07-22 20:53:10', 'carlos.silva17@gmail.com'),
(74, 'Patricia', 'Godoy', '42000018', 'DOSEP', '2664500018', '2026-07-22 20:53:10', 'patricia.godoy18@gmail.com'),
(75, 'Sebastian', 'Ruiz', '42000019', 'OSDE', '2664500019', '2026-07-22 20:53:10', 'sebastian.ruiz19@gmail.com'),
(76, 'Gabriela', 'Acosta', '42000020', 'Particular', '2664500020', '2026-07-22 20:53:10', 'gabriela.acosta20@gmail.com'),
(77, 'Cristian', 'Ledesma', '42000021', 'Medifé', '2664500021', '2026-07-22 20:53:10', 'cristian.ledesma21@gmail.com'),
(78, 'Carolina', 'Moyano', '42000022', 'Swiss Medical', '2664500022', '2026-07-22 20:53:10', 'carolina.moyano22@gmail.com'),
(79, 'Emanuel', 'Dominguez', '42000023', 'OSDE', '2664500023', '2026-07-22 20:53:10', 'emanuel.dominguez23@gmail.com'),
(80, 'Noelia', 'Salinas', '42000024', 'DOSEP', '2664500024', '2026-07-22 20:53:10', 'noelia.salinas24@gmail.com'),
(81, 'Roberto', 'Paz', '42000025', 'Particular', '2664500025', '2026-07-22 20:53:10', 'roberto.paz25@gmail.com'),
(82, 'Lorena', 'Aguero', '42000026', 'OSPE', '2664500026', '2026-07-22 20:53:10', 'lorena.aguero26@gmail.com'),
(83, 'Juan', 'Miranda', '42000027', 'OSDE', '2664500027', '2026-07-22 20:53:10', 'juan.miranda27@gmail.com'),
(84, 'Sandra', 'Bravo', '42000028', 'Swiss Medical', '2664500028', '2026-07-22 20:53:10', 'sandra.bravo28@gmail.com'),
(85, 'Gustavo', 'Escudero', '42000029', 'DOSEP', '2664500029', '2026-07-22 20:53:10', 'gustavo.escudero29@gmail.com'),
(86, 'Laura', 'Arce', '42000030', 'Medifé', '2664500030', '2026-07-22 20:53:10', 'laura.arce30@gmail.com'),
(87, 'Alberto', 'Ferreyra', '42000031', 'OSDE', '2664500031', '2026-07-22 20:53:10', 'alberto.ferreyra31@gmail.com'),
(88, 'Veronica', 'Bustos', '42000032', 'Particular', '2664500032', '2026-07-22 20:53:10', 'veronica.bustos32@gmail.com'),
(89, 'Miguel', 'Reinoso', '42000033', 'Swiss Medical', '2664500033', '2026-07-22 20:53:10', 'miguel.reinoso33@gmail.com'),
(90, 'Rocio', 'Pereyra', '42000034', 'DOSEP', '2664500034', '2026-07-22 20:53:10', 'rocio.pereyra34@gmail.com'),
(91, 'Julian', 'Soria', '42000035', 'OSPE', '2664500035', '2026-07-22 20:53:10', 'julian.soria35@gmail.com'),
(92, 'Valeria', 'Torres', '42000036', 'OSDE', '2664500036', '2026-07-22 20:53:10', 'valeria.torres36@gmail.com'),
(93, 'Nicolas', 'Oviedo', '42000037', 'Sancor Salud', '2664500037', '2026-07-22 20:53:10', 'nicolas.oviedo37@gmail.com'),
(94, 'Cecilia', 'Mendez', '42000038', 'Particular', '2664500038', '2026-07-22 20:53:10', 'cecilia.mendez38@gmail.com'),
(95, 'Oscar', 'Diaz', '42000039', 'Swiss Medical', '2664500039', '2026-07-22 20:53:10', 'oscar.diaz39@gmail.com'),
(96, 'Liliana', 'Campos', '42000040', 'OSDE', '2664500040', '2026-07-22 20:53:10', 'liliana.campos40@gmail.com'),
(97, 'Pablo', 'Ibarra', '42000041', 'DOSEP', '2664500041', '2026-07-22 20:53:10', 'pablo.ibarra41@gmail.com'),
(98, 'Eliana', 'Roldan', '42000042', 'OSPE', '2664500042', '2026-07-22 20:53:10', 'eliana.roldan42@gmail.com'),
(99, 'Ramon', 'Correa', '42000043', 'OSDE', '2664500043', '2026-07-22 20:53:10', 'ramon.correa43@gmail.com'),
(100, 'Monica', 'Villalba', '42000044', 'Swiss Medical', '2664500044', '2026-07-22 20:53:10', 'monica.villalba44@gmail.com'),
(101, 'Hector', 'Soto', '42000045', 'Particular', '2664500045', '2026-07-22 20:53:10', 'hector.soto45@gmail.com'),
(102, 'Viviana', 'Arias', '42000046', 'DOSEP', '2664500046', '2026-07-22 20:53:10', 'viviana.arias46@gmail.com'),
(103, 'Martin', 'Lucero', '42000047', 'OSDE', '2664500047', '2026-07-22 20:53:10', 'martin.lucero47@gmail.com'),
(104, 'Pamela', 'Flores', '42000048', 'OSPE', '2664500048', '2026-07-22 20:53:10', 'pamela.flores48@gmail.com'),
(105, 'Adrian', 'Villagra', '42000049', 'Swiss Medical', '2664500049', '2026-07-22 20:53:10', 'adrian.villagra49@gmail.com'),
(106, 'Beatriz', 'Delgado', '42000050', 'Medifé', '2664500050', '2026-07-22 20:53:10', 'beatriz.delgado50@gmail.com'),
(107, 'Leandro', 'Nieto', '42000051', 'OSDE', '2664500051', '2026-07-22 20:53:10', 'leandro.nieto51@gmail.com'),
(108, 'Carla', 'Romano', '42000052', 'Particular', '2664500052', '2026-07-22 20:53:10', 'carla.romano52@gmail.com'),
(109, 'Franco', 'Gallardo', '42000053', 'DOSEP', '2664500053', '2026-07-22 20:53:10', 'franco.gallardo53@gmail.com'),
(110, 'Melina', 'Funes', '42000054', 'Swiss Medical', '2664500054', '2026-07-22 20:53:10', 'melina.funes54@gmail.com'),
(111, 'Raul', 'Oliva', '42000055', 'OSPE', '2664500055', '2026-07-22 20:53:10', 'raul.oliva55@gmail.com'),
(112, 'Daniela', 'Baez', '42000056', 'OSDE', '2664500056', '2026-07-22 20:53:10', 'daniela.baez56@gmail.com'),
(113, 'Matias', 'Carrizo', '42000057', 'Sancor Salud', '2664500057', '2026-07-22 20:53:10', 'matias.carrizo57@gmail.com'),
(114, 'Yesica', 'Varela', '42000058', 'DOSEP', '2664500058', '2026-07-22 20:53:10', 'yesica.varela58@gmail.com'),
(115, 'Esteban', 'Farias', '42000059', 'OSDE', '2664500059', '2026-07-22 20:53:10', 'esteban.farias59@gmail.com'),
(116, 'Silvia', 'Aguirre', '42000060', 'Particular', '2664500060', '2026-07-22 20:53:10', 'silvia.aguirre60@gmail.com'),
(117, 'Ignacio', 'Peña', '42000061', 'Swiss Medical', '2664500061', '2026-07-22 20:53:10', 'ignacio.pena61@gmail.com'),
(118, 'Marisol', 'Nuñez', '42000062', 'OSPE', '2664500062', '2026-07-22 20:53:10', 'marisol.nunez62@gmail.com'),
(119, 'Walter', 'Rivero', '42000063', 'DOSEP', '2664500063', '2026-07-22 20:53:10', 'walter.rivero63@gmail.com'),
(120, 'Alicia', 'Ojeda', '42000064', 'OSDE', '2664500064', '2026-07-22 20:53:10', 'alicia.ojeda64@gmail.com'),
(121, 'German', 'Albornoz', '42000065', 'Particular', '2664500065', '2026-07-22 20:53:10', 'german.albornoz65@gmail.com'),
(122, 'Romina', 'Ramos', '42000066', 'Swiss Medical', '2664500066', '2026-07-22 20:53:10', 'romina.ramos66@gmail.com'),
(123, 'Edgardo', 'Tapia', '42000067', 'OSDE', '2664500067', '2026-07-22 20:53:10', 'edgardo.tapia67@gmail.com'),
(124, 'Mariela', 'Maldonado', '42000068', 'DOSEP', '2664500068', '2026-07-22 20:53:10', 'mariela.maldonado68@gmail.com'),
(125, 'Fabian', 'Saez', '42000069', 'OSPE', '2664500069', '2026-07-22 20:53:10', 'fabian.saez69@gmail.com'),
(126, 'Veronica', 'Leiva', '42000070', 'Sancor Salud', '2664500070', '2026-07-22 20:53:10', 'veronica.leiva70@gmail.com'),
(127, 'Renzo', 'Barrios', '42000071', 'OSDE', '2664500071', '2026-07-22 20:53:10', 'renzo.barrios71@gmail.com'),
(128, 'Daiana', 'Rios', '42000072', 'Swiss Medical', '2664500072', '2026-07-22 20:53:10', 'daiana.rios72@gmail.com'),
(129, 'Marcelo', 'Juarez', '42000073', 'Particular', '2664500073', '2026-07-22 20:53:10', 'marcelo.juarez73@gmail.com'),
(130, 'Natalia', 'Mansilla', '42000074', 'DOSEP', '2664500074', '2026-07-22 20:53:10', 'natalia.mansilla74@gmail.com'),
(131, 'Alfredo', 'Serrano', '42000075', 'OSPE', '2664500075', '2026-07-22 20:53:10', 'alfredo.serrano75@gmail.com'),
(132, 'Karina', 'Galvan', '42000076', 'OSDE', '2664500076', '2026-07-22 20:53:10', 'karina.galvan76@gmail.com'),
(133, 'Eduardo', 'Valdez', '42000077', 'Swiss Medical', '2664500077', '2026-07-22 20:53:10', 'eduardo.valdez77@gmail.com'),
(134, 'Lourdes', 'Ferrero', '42000078', 'DOSEP', '2664500078', '2026-07-22 20:53:10', 'lourdes.ferrero78@gmail.com'),
(135, 'Mauricio', 'Cabrera', '42000079', 'Particular', '2664500079', '2026-07-22 20:53:10', 'mauricio.cabrera79@gmail.com'),
(136, 'Sabrina', 'Pintos', '42000080', 'OSDE', '2664500080', '2026-07-22 20:53:10', 'sabrina.pintos80@gmail.com'),
(137, 'Damian', 'Marin', '42000081', 'OSPE', '2664500081', '2026-07-22 20:53:10', 'damian.marin81@gmail.com'),
(138, 'Yanina', 'Toledo', '42000082', 'Swiss Medical', '2664500082', '2026-07-22 20:53:10', 'yanina.toledo82@gmail.com'),
(139, 'Ricardo', 'Lujan', '42000083', 'DOSEP', '2664500083', '2026-07-22 20:53:10', 'ricardo.lujan83@gmail.com'),
(140, 'Patricia', 'Farías', '42000084', 'OSDE', '2664500084', '2026-07-22 20:53:10', 'patricia.farias84@gmail.com'),
(141, 'Julio', 'Balmaceda', '42000085', 'Particular', '2664500085', '2026-07-22 20:53:10', 'julio.balmaceda85@gmail.com'),
(142, 'Marina', 'Coronel', '42000086', 'Sancor Salud', '2664500086', '2026-07-22 20:53:10', 'marina.coronel86@gmail.com'),
(143, 'Federico', 'Acuña', '42000087', 'OSDE', '2664500087', '2026-07-22 20:53:10', 'federico.acuna87@gmail.com'),
(144, 'Celeste', 'Ortiz', '42000088', 'OSPE', '2664500088', '2026-07-22 20:53:10', 'celeste.ortiz88@gmail.com'),
(145, 'Gonzalo', 'Macias', '42000089', 'Swiss Medical', '2664500089', '2026-07-22 20:53:10', 'gonzalo.macias89@gmail.com'),
(146, 'Andrea', 'Palacios', '42000090', 'DOSEP', '2664500090', '2026-07-22 20:53:10', 'andrea.palacios90@gmail.com'),
(147, 'Bruno', 'Rosales', '42000091', 'OSDE', '2664500091', '2026-07-22 20:53:10', 'bruno.rosales91@gmail.com'),
(148, 'Mariela', 'Sarmiento', '42000092', 'Particular', '2664500092', '2026-07-22 20:53:10', 'mariela.sarmiento92@gmail.com'),
(149, 'Cristina', 'Alonso', '42000093', 'OSPE', '2664500093', '2026-07-22 20:53:10', 'cristina.alonso93@gmail.com'),
(150, 'Leonardo', 'Rivas', '42000094', 'Swiss Medical', '2664500094', '2026-07-22 20:53:10', 'leonardo.rivas94@gmail.com'),
(151, 'Gabriela', 'Pizarro', '42000095', 'OSDE', '2664500095', '2026-07-22 20:53:10', 'gabriela.pizarro95@gmail.com'),
(152, 'Emilio', 'Vergara', '42000096', 'DOSEP', '2664500096', '2026-07-22 20:53:10', 'emilio.vergara96@gmail.com'),
(153, 'Sonia', 'Campos', '42000097', 'Particular', '2664500097', '2026-07-22 20:53:10', 'sonia.campos97@gmail.com'),
(154, 'Javier', 'Amaya', '42000098', 'OSDE', '2664500098', '2026-07-22 20:53:10', 'javier.amaya98@gmail.com'),
(155, 'Paola', 'Coria', '42000099', 'Swiss Medical', '2664500099', '2026-07-22 20:53:10', 'paola.coria99@gmail.com'),
(156, 'Horacio', 'Benavidez', '42000100', 'Medifé', '2664500100', '2026-07-22 20:53:10', 'horacio.benavidez100@gmail.com');

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
(1, '258954698', 'Juan Carlos', 'Pérez', '39932888', '2664342588', 'juan.perez18@gmail.com', 'activo', '2026-02-26 06:30:05'),
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
(15, '25631478', 'Martin', 'Giuliani', '20456789', '2665874125', 'GiuMartin@gmail.com', 'activo', '2026-05-11 19:53:08'),
(16, '123587646', 'jose luis', 'gil', '245698753', '2665852369', 'jolui@gmail.com', 'activo', '2026-06-24 17:15:37'),
(17, '951785469', 'Esteban', 'Ruiz', '27855693', '1145673425', 'estebanquito@gmail.com', 'activo', '2026-06-27 21:17:40'),
(18, '222759337', 'adrian jeremias', 'peralta', '23567457', '2665852753', 'peralteAdrian1@gmail.com', 'activo', '2026-07-03 21:07:44'),
(19, '9856478234566', 'Jacobo Martin', 'Lopez', '41258932', '2664789456', 'JacobMartinL@gmail.com', 'activo', '2026-07-06 22:45:20'),
(20, '555566678', 'Joselin Beatriz', 'Marquez', '2833569851', '11545688796', 'BettyJosie@gmail.com', 'activo', '2026-07-06 22:53:59'),
(21, '9888856232', 'Jeremias ', 'Sanchez', '225487741', '2665858585', 'jere@gmail.com', 'activo', '2026-07-23 20:45:31');

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
(2, 2),
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
(12, 14),
(13, 11),
(14, 8),
(15, 12),
(16, 11),
(17, 13),
(18, 3),
(19, 14),
(20, 2),
(21, 11);

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
(9, 1, 2),
(2, 2, 1),
(7, 3, 1),
(8, 4, 1),
(17, 5, 1),
(11, 5, 2),
(16, 6, 1),
(3, 7, 1),
(6, 7, 2),
(10, 8, 2),
(15, 9, 1),
(13, 10, 2),
(18, 11, 1),
(19, 12, 1),
(12, 13, 2),
(14, 14, 1),
(20, 15, 1),
(21, 16, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_ausencias`
--

CREATE TABLE `solicitudes_ausencias` (
  `id` int(11) NOT NULL,
  `agenda_id` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_ausencias`
--

INSERT INTO `solicitudes_ausencias` (`id`, `agenda_id`, `fecha_inicio`, `fecha_fin`, `motivo`, `estado`, `fecha_solicitud`) VALUES
(1, 9, '2026-08-20', '2026-08-22', 'por nacimiento ', 'aprobada', '2026-07-13 22:57:00'),
(2, 9, '2026-08-10', '2026-08-13', 'viaje', 'aprobada', '2026-07-23 19:26:06'),
(3, 9, '2026-07-22', '2026-07-27', 'viaje', 'aprobada', '2026-07-23 19:32:48'),
(4, 9, '2026-09-10', '2026-09-15', 'congreso', 'aprobada', '2026-07-23 21:30:45');

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
(15, 2, 1, 2, 5, 1, '2026-04-16', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:19:30'),
(16, 2, 1, 2, 5, 1, '2026-04-23', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:43:17'),
(18, 2, 1, 2, 5, 1, '2026-04-16', '16:30:01', 'pendiente', 'sobreturno', NULL, '2026-04-15 01:25:22'),
(22, 1, 1, 1, 2, 1, '2026-05-13', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-05 04:51:59'),
(24, 1, 2, 1, 2, 1, '2026-05-20', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-06 00:51:15'),
(26, 1, 2, 1, 2, 1, '2026-05-27', '11:40:00', 'confirmado', 'normal', NULL, '2026-05-06 01:17:49'),
(27, 1, 1, 1, 2, 1, '2026-05-27', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-06 04:19:06'),
(29, 2, 4, 2, 5, 1, '2026-05-19', '17:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:39:31'),
(31, 3, 6, 3, 6, 1, '2026-05-18', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:52:39'),
(32, 3, 7, 3, 6, 1, '2026-06-15', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:03'),
(33, 2, 5, 2, 5, 1, '2026-05-19', '16:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:27'),
(34, 6, 3, 7, 3, 1, '2026-05-13', '17:40:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:08'),
(35, 1, 2, 1, 2, 1, '2026-05-13', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:27'),
(36, 1, 1, 1, 2, 1, '2026-05-13', '09:30:00', 'pendiente', 'normal', NULL, '2026-05-13 00:26:26'),
(37, 11, 2, 10, 10, 2, '2026-07-01', '10:30:00', 'confirmado', 'normal', NULL, '2026-05-13 00:33:35'),
(38, 14, 1, 6, 4, 1, '2026-06-29', '09:30:00', 'pendiente', 'sobreturno', NULL, '2026-05-13 00:43:58'),
(40, 2, 1, 2, 5, 1, '2026-05-21', '17:00:00', 'pendiente', 'normal', NULL, '2026-05-20 15:43:36'),
(42, 10, 7, 13, 11, 2, '2026-05-20', '09:00:00', 'pendiente', 'normal', NULL, '2026-05-20 16:02:11'),
(43, 2, 1, 2, 5, 1, '2026-05-28', '17:00:00', 'reservado', 'normal', NULL, '2026-05-25 00:15:38'),
(44, 11, 2, 10, 10, 2, '2026-05-27', '19:30:00', 'reservado', 'normal', NULL, '2026-05-25 01:39:32'),
(46, 11, 3, 10, 10, 2, '2026-05-25', '17:00:00', 'confirmado', 'normal', NULL, '2026-05-25 01:48:42'),
(47, 11, 3, 10, 10, 2, '2026-05-25', '10:00:00', 'reservado', 'sobreturno', NULL, '2026-05-25 01:49:03'),
(48, 14, 8, 6, 4, 1, '2026-06-16', '16:40:00', 'reservado', 'normal', NULL, '2026-06-11 11:27:36'),
(49, 9, 2, 5, 3, 2, '2026-06-16', '16:50:00', 'reservado', 'normal', NULL, '2026-06-13 16:13:28'),
(50, 14, 1, 6, 4, 1, '2026-06-15', '18:10:00', 'reservado', 'normal', NULL, '2026-06-13 16:59:53'),
(51, 9, 2, 5, 3, 2, '2026-06-16', '16:30:00', 'reservado', 'normal', NULL, '2026-06-13 17:00:24'),
(53, 9, 4, 5, 8, 2, '2026-06-16', '17:30:00', 'reservado', 'normal', NULL, '2026-06-13 17:02:03'),
(55, 4, 2, 4, 6, 1, '2026-06-05', '10:00:00', 'confirmado', 'normal', NULL, '2026-06-22 15:02:54'),
(56, 3, 1, 3, 6, 1, '2026-06-22', '09:00:00', 'reservado', 'normal', NULL, '2026-06-22 15:03:57'),
(57, 3, 2, 3, 6, 1, '2026-06-22', '10:00:00', 'reservado', 'normal', NULL, '2026-06-22 20:34:42'),
(58, 3, 1, 3, 6, 1, '2026-06-22', '11:00:00', 'reservado', 'normal', NULL, '2026-06-22 20:37:13'),
(59, 1, 1, 1, 2, 1, '2026-07-07', '20:00:00', 'confirmado', 'normal', NULL, '2026-06-22 21:04:39'),
(60, 9, 1, 5, 3, 2, '2026-06-25', '17:00:00', 'reservado', 'normal', NULL, '2026-06-24 02:38:56'),
(61, 14, 2, 6, 4, 1, '2026-06-23', '16:00:00', 'reservado', 'normal', NULL, '2026-06-24 02:50:53'),
(62, 11, 5, 10, 10, 2, '2026-07-08', '17:30:00', 'reservado', 'normal', NULL, '2026-06-24 17:13:43'),
(63, 10, 9, 13, 11, 2, '2026-06-25', '09:00:00', 'cancelado', 'normal', NULL, '2026-06-24 19:51:49'),
(64, 14, 10, 6, 4, 1, '2026-07-07', '16:00:00', 'confirmado', 'normal', NULL, '2026-06-24 20:07:46'),
(65, 27, 1, 15, 12, 1, '2026-07-02', '09:00:00', 'confirmado', 'normal', NULL, '2026-06-27 00:10:57'),
(66, 4, 6, 4, 6, 1, '2026-07-03', '10:00:00', 'confirmado', 'normal', NULL, '2026-06-27 21:15:59'),
(67, 10, 1, 13, 11, 2, '2026-07-14', '09:50:00', 'reservado', 'normal', NULL, '2026-07-03 21:06:49'),
(68, 14, 3, 6, 4, 1, '2026-07-21', '16:00:00', 'reservado', 'normal', NULL, '2026-07-21 15:47:11'),
(74, 7, 7, 1, 2, 2, '2026-08-01', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(99, 11, 41, 10, 10, 2, '2026-08-03', '09:00:00', 'confirmado', 'normal', NULL, '2026-07-23 00:27:34'),
(102, 14, 44, 6, 4, 1, '2026-08-03', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(103, 15, 45, 1, 4, 1, '2026-08-03', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(109, 27, 57, 15, 12, 1, '2026-08-03', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(116, 7, 67, 1, 2, 2, '2026-08-04', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(127, 24, 84, 12, 2, 1, '2026-08-05', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(130, 27, 87, 15, 12, 1, '2026-08-05', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(151, 27, 117, 15, 12, 1, '2026-08-06', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(158, 7, 127, 1, 2, 2, '2026-08-07', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(159, 8, 128, 8, 3, 2, '2026-08-07', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(171, 26, 146, 12, 9, 1, '2026-08-08', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(197, 3, 27, 3, 6, 1, '2026-08-10', '09:00:00', 'confirmado', 'normal', NULL, '2026-07-23 00:27:34'),
(202, 9, 33, 5, 3, 2, '2026-08-14', '09:30:00', 'confirmado', 'normal', NULL, '2026-07-23 00:27:34'),
(329, 7, 7, 1, 2, 2, '2026-09-01', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(344, 7, 28, 1, 2, 2, '2026-09-01', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(345, 8, 29, 8, 3, 2, '2026-09-01', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(346, 9, 30, 5, 3, 2, '2026-09-01', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(354, 1, 43, 1, 2, 1, '2026-09-02', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(369, 1, 64, 1, 2, 1, '2026-09-02', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(409, 12, 117, 14, 8, 1, '2026-09-03', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(417, 4, 130, 4, 6, 1, '2026-09-04', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(439, 12, 3, 14, 8, 1, '2026-09-04', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(499, 12, 87, 14, 8, 1, '2026-09-07', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(502, 15, 90, 1, 4, 1, '2026-09-07', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(513, 11, 107, 10, 10, 2, '2026-09-07', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(517, 15, 111, 1, 4, 1, '2026-09-07', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(523, 6, 123, 7, 3, 1, '2026-09-07', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(527, 10, 127, 13, 11, 2, '2026-09-08', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(530, 13, 130, 9, 9, 1, '2026-09-08', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(538, 6, 144, 7, 3, 1, '2026-09-08', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(545, 13, 151, 9, 9, 1, '2026-09-08', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(550, 2, 5, 2, 5, 1, '2026-09-08', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(555, 8, 11, 8, 3, 2, '2026-09-09', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(558, 11, 14, 10, 10, 2, '2026-09-09', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(559, 12, 15, 14, 8, 1, '2026-09-09', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(589, 12, 57, 14, 8, 1, '2026-09-10', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(595, 2, 68, 2, 5, 1, '2026-09-10', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(599, 7, 73, 1, 2, 2, '2026-09-10', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(600, 8, 74, 8, 3, 2, '2026-09-10', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(601, 9, 75, 5, 3, 2, '2026-09-10', '11:00:00', 'reprogramar', 'normal', NULL, '2026-07-23 00:30:13'),
(602, 10, 76, 13, 11, 2, '2026-09-10', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(614, 7, 94, 1, 2, 2, '2026-09-11', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(616, 9, 96, 5, 3, 2, '2026-09-11', '11:30:00', 'reprogramar', 'normal', NULL, '2026-07-23 00:30:13'),
(629, 7, 115, 1, 2, 2, '2026-09-11', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(630, 8, 116, 8, 3, 2, '2026-09-11', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(643, 6, 135, 7, 3, 1, '2026-09-12', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(644, 7, 136, 1, 2, 2, '2026-09-12', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(659, 7, 1, 1, 2, 2, '2026-09-12', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(709, 12, 69, 14, 8, 1, '2026-09-14', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(710, 13, 70, 9, 9, 1, '2026-09-14', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(712, 15, 72, 1, 4, 1, '2026-09-14', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(716, 3, 81, 3, 6, 1, '2026-09-14', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(723, 11, 89, 10, 10, 2, '2026-09-14', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(725, 13, 91, 9, 9, 1, '2026-09-14', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(726, 14, 92, 6, 4, 1, '2026-09-14', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(740, 13, 112, 9, 9, 1, '2026-09-15', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(752, 10, 130, 13, 11, 2, '2026-09-15', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(753, 11, 131, 10, 10, 2, '2026-09-15', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(754, 12, 132, 14, 8, 1, '2026-09-15', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(765, 8, 149, 8, 3, 2, '2026-09-16', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(768, 11, 152, 10, 10, 2, '2026-09-16', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(794, 7, 34, 1, 2, 2, '2026-09-17', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(799, 12, 39, 14, 8, 1, '2026-09-17', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(809, 7, 55, 1, 2, 2, '2026-09-17', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(810, 8, 56, 8, 3, 2, '2026-09-17', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(824, 7, 76, 1, 2, 2, '2026-09-18', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(829, 12, 81, 14, 8, 1, '2026-09-18', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(838, 6, 96, 7, 3, 1, '2026-09-18', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(901, 9, 27, 5, 3, 2, '2026-09-21', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(902, 10, 28, 13, 11, 2, '2026-09-21', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(903, 11, 29, 10, 10, 2, '2026-09-21', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(915, 8, 47, 8, 3, 2, '2026-09-21', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(929, 7, 67, 1, 2, 2, '2026-09-22', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(944, 7, 88, 1, 2, 2, '2026-09-22', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(945, 8, 89, 8, 3, 2, '2026-09-22', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(946, 9, 90, 5, 3, 2, '2026-09-22', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(954, 1, 103, 1, 2, 1, '2026-09-23', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(969, 1, 124, 1, 2, 1, '2026-09-23', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1009, 12, 21, 14, 8, 1, '2026-09-24', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1017, 4, 34, 4, 6, 1, '2026-09-25', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1039, 12, 63, 14, 8, 1, '2026-09-25', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1351, 27, 5, 15, 12, 1, '2026-07-29', '09:00:00', 'confirmado', 'normal', NULL, '2026-07-23 00:55:05'),
(1353, 12, 7, 14, 8, 1, '2026-08-03', '09:40:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1354, 8, 8, 8, 3, 2, '2026-08-05', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1359, 9, 13, 5, 3, 2, '2026-08-18', '17:10:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1361, 12, 15, 14, 8, 1, '2026-08-24', '16:40:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1364, 9, 7, 5, 3, 2, '2026-07-23', '09:00:00', 'reprogramar', 'normal', NULL, '2026-07-23 19:31:31'),
(1365, 9, 9, 5, 3, 2, '2026-07-23', '09:20:00', 'reprogramar', 'normal', NULL, '2026-07-23 19:32:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_backup_20260723`
--

CREATE TABLE `turnos_backup_20260723` (
  `id` int(11) NOT NULL DEFAULT 0,
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
-- Volcado de datos para la tabla `turnos_backup_20260723`
--

INSERT INTO `turnos_backup_20260723` (`id`, `agenda_id`, `paciente_id`, `profesional_id`, `especialidad_id`, `sucursal_id`, `fecha`, `hora`, `estado`, `tipo_turno`, `observaciones`, `created_at`) VALUES
(15, 2, 1, 2, 5, 1, '2026-04-16', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:19:30'),
(16, 2, 1, 2, 5, 1, '2026-04-23', '16:00:00', 'pendiente', 'normal', NULL, '2026-04-14 23:43:17'),
(18, 2, 1, 2, 5, 1, '2026-04-16', '16:30:01', 'pendiente', 'sobreturno', NULL, '2026-04-15 01:25:22'),
(22, 1, 1, 1, 2, 1, '2026-05-13', '10:00:00', 'pendiente', 'normal', NULL, '2026-05-05 04:51:59'),
(24, 1, 2, 1, 2, 1, '2026-05-20', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-06 00:51:15'),
(26, 1, 2, 1, 2, 1, '2026-05-27', '11:40:00', 'confirmado', 'normal', NULL, '2026-05-06 01:17:49'),
(27, 1, 1, 1, 2, 1, '2026-05-27', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-06 04:19:06'),
(29, 2, 4, 2, 5, 1, '2026-05-19', '17:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:39:31'),
(31, 3, 6, 3, 6, 1, '2026-05-18', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:52:39'),
(32, 3, 7, 3, 6, 1, '2026-06-15', '11:00:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:03'),
(33, 2, 5, 2, 5, 1, '2026-05-19', '16:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:55:27'),
(34, 6, 3, 7, 3, 1, '2026-05-13', '17:40:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:08'),
(35, 1, 2, 1, 2, 1, '2026-05-13', '11:30:00', 'pendiente', 'normal', NULL, '2026-05-12 21:57:27'),
(36, 1, 1, 1, 2, 1, '2026-05-13', '09:30:00', 'pendiente', 'normal', NULL, '2026-05-13 00:26:26'),
(37, 11, 2, 10, 10, 2, '2026-07-01', '10:30:00', 'confirmado', 'normal', NULL, '2026-05-13 00:33:35'),
(38, 14, 1, 6, 4, 1, '2026-06-29', '09:30:00', 'pendiente', 'sobreturno', NULL, '2026-05-13 00:43:58'),
(40, 2, 1, 2, 5, 1, '2026-05-21', '17:00:00', 'pendiente', 'normal', NULL, '2026-05-20 15:43:36'),
(41, 8, 2, 8, 3, 2, '2026-07-08', '18:00:00', 'reprogramar', 'normal', NULL, '2026-05-20 15:58:29'),
(42, 10, 7, 13, 11, 2, '2026-05-20', '09:00:00', 'pendiente', 'normal', NULL, '2026-05-20 16:02:11'),
(43, 2, 1, 2, 5, 1, '2026-05-28', '17:00:00', 'reservado', 'normal', NULL, '2026-05-25 00:15:38'),
(44, 11, 2, 10, 10, 2, '2026-05-27', '19:30:00', 'reservado', 'normal', NULL, '2026-05-25 01:39:32'),
(46, 11, 3, 10, 10, 2, '2026-05-25', '17:00:00', 'confirmado', 'normal', NULL, '2026-05-25 01:48:42'),
(47, 11, 3, 10, 10, 2, '2026-05-25', '10:00:00', 'reservado', 'sobreturno', NULL, '2026-05-25 01:49:03'),
(48, 14, 8, 6, 4, 1, '2026-06-16', '16:40:00', 'reservado', 'normal', NULL, '2026-06-11 11:27:36'),
(49, 9, 2, 5, 3, 2, '2026-06-16', '16:50:00', 'reservado', 'normal', NULL, '2026-06-13 16:13:28'),
(50, 14, 1, 6, 4, 1, '2026-06-15', '18:10:00', 'reservado', 'normal', NULL, '2026-06-13 16:59:53'),
(51, 9, 2, 5, 3, 2, '2026-06-16', '16:30:00', 'reservado', 'normal', NULL, '2026-06-13 17:00:24'),
(52, 9, 4, 5, 3, 2, '2026-06-17', '17:40:00', 'reservado', 'normal', NULL, '2026-06-13 17:00:47'),
(53, 9, 4, 5, 8, 2, '2026-06-16', '17:30:00', 'reservado', 'normal', NULL, '2026-06-13 17:02:03'),
(55, 4, 2, 4, 6, 1, '2026-06-05', '10:00:00', 'confirmado', 'normal', NULL, '2026-06-22 15:02:54'),
(56, 3, 1, 3, 6, 1, '2026-06-22', '09:00:00', 'reservado', 'normal', NULL, '2026-06-22 15:03:57'),
(57, 3, 2, 3, 6, 1, '2026-06-22', '10:00:00', 'reservado', 'normal', NULL, '2026-06-22 20:34:42'),
(58, 3, 1, 3, 6, 1, '2026-06-22', '11:00:00', 'reservado', 'normal', NULL, '2026-06-22 20:37:13'),
(59, 1, 1, 1, 2, 1, '2026-07-07', '20:00:00', 'confirmado', 'normal', NULL, '2026-06-22 21:04:39'),
(60, 9, 1, 5, 3, 2, '2026-06-25', '17:00:00', 'reservado', 'normal', NULL, '2026-06-24 02:38:56'),
(61, 14, 2, 6, 4, 1, '2026-06-23', '16:00:00', 'reservado', 'normal', NULL, '2026-06-24 02:50:53'),
(62, 11, 5, 10, 10, 2, '2026-07-08', '17:30:00', 'reservado', 'normal', NULL, '2026-06-24 17:13:43'),
(63, 10, 9, 13, 11, 2, '2026-06-25', '09:00:00', 'cancelado', 'normal', NULL, '2026-06-24 19:51:49'),
(64, 14, 10, 6, 4, 1, '2026-07-07', '16:00:00', 'confirmado', 'normal', NULL, '2026-06-24 20:07:46'),
(65, 27, 1, 15, 12, 1, '2026-07-02', '09:00:00', 'confirmado', 'normal', NULL, '2026-06-27 00:10:57'),
(66, 4, 6, 4, 6, 1, '2026-07-03', '10:00:00', 'confirmado', 'normal', NULL, '2026-06-27 21:15:59'),
(67, 10, 1, 13, 11, 2, '2026-07-14', '09:50:00', 'reservado', 'normal', NULL, '2026-07-03 21:06:49'),
(68, 14, 3, 6, 4, 1, '2026-07-21', '16:00:00', 'reservado', 'normal', NULL, '2026-07-21 15:47:11'),
(74, 7, 7, 1, 2, 2, '2026-08-01', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(99, 11, 41, 10, 10, 2, '2026-08-03', '09:00:00', 'confirmado', 'normal', NULL, '2026-07-23 00:27:34'),
(102, 14, 44, 6, 4, 1, '2026-08-03', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(103, 15, 45, 1, 4, 1, '2026-08-03', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(109, 27, 57, 15, 12, 1, '2026-08-03', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(115, 6, 66, 7, 3, 1, '2026-08-04', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(116, 7, 67, 1, 2, 2, '2026-08-04', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(117, 8, 68, 8, 3, 2, '2026-08-04', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(118, 9, 69, 5, 3, 2, '2026-08-04', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(119, 10, 70, 13, 11, 2, '2026-08-04', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(121, 12, 72, 14, 8, 1, '2026-08-04', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(122, 13, 73, 9, 9, 1, '2026-08-04', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(126, 23, 83, 11, 4, 1, '2026-08-05', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(127, 24, 84, 12, 2, 1, '2026-08-05', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(130, 27, 87, 15, 12, 1, '2026-08-05', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(136, 6, 96, 7, 3, 1, '2026-08-05', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(138, 8, 98, 8, 3, 2, '2026-08-05', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(139, 9, 99, 5, 3, 2, '2026-08-05', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(151, 27, 117, 15, 12, 1, '2026-08-06', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(158, 7, 127, 1, 2, 2, '2026-08-07', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(159, 8, 128, 8, 3, 2, '2026-08-07', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(160, 9, 129, 5, 3, 2, '2026-08-07', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(163, 12, 132, 14, 8, 1, '2026-08-07', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(171, 26, 146, 12, 9, 1, '2026-08-08', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(178, 6, 156, 7, 3, 1, '2026-08-08', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(197, 3, 27, 3, 6, 1, '2026-08-10', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(199, 6, 30, 7, 3, 1, '2026-08-10', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(201, 8, 32, 8, 3, 2, '2026-08-10', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(202, 9, 33, 5, 3, 2, '2026-08-10', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(203, 10, 34, 13, 11, 2, '2026-08-10', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(204, 11, 35, 10, 10, 2, '2026-08-10', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(205, 12, 36, 14, 8, 1, '2026-08-10', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(206, 13, 37, 9, 9, 1, '2026-08-10', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(207, 14, 38, 6, 4, 1, '2026-08-10', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(208, 15, 39, 1, 4, 1, '2026-08-10', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:27:34'),
(328, 6, 6, 7, 3, 1, '2026-09-01', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(329, 7, 7, 1, 2, 2, '2026-09-01', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(330, 8, 8, 8, 3, 2, '2026-09-01', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(331, 9, 9, 5, 3, 2, '2026-09-01', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(332, 10, 10, 13, 11, 2, '2026-09-01', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(334, 12, 12, 14, 8, 1, '2026-09-01', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(335, 13, 13, 9, 9, 1, '2026-09-01', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(343, 6, 27, 7, 3, 1, '2026-09-01', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(344, 7, 28, 1, 2, 2, '2026-09-01', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(345, 8, 29, 8, 3, 2, '2026-09-01', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(346, 9, 30, 5, 3, 2, '2026-09-01', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(347, 10, 31, 13, 11, 2, '2026-09-01', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(349, 12, 33, 14, 8, 1, '2026-09-01', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(350, 13, 34, 9, 9, 1, '2026-09-01', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(354, 1, 43, 1, 2, 1, '2026-09-02', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(358, 6, 48, 7, 3, 1, '2026-09-02', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(360, 8, 50, 8, 3, 2, '2026-09-02', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(362, 10, 52, 13, 11, 2, '2026-09-02', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(363, 11, 53, 10, 10, 2, '2026-09-02', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(364, 12, 54, 14, 8, 1, '2026-09-02', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(369, 1, 64, 1, 2, 1, '2026-09-02', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(373, 6, 69, 7, 3, 1, '2026-09-02', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(375, 8, 71, 8, 3, 2, '2026-09-02', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(377, 10, 73, 13, 11, 2, '2026-09-02', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(378, 11, 74, 10, 10, 2, '2026-09-02', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(379, 12, 75, 14, 8, 1, '2026-09-02', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(388, 6, 90, 7, 3, 1, '2026-09-03', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(389, 7, 91, 1, 2, 2, '2026-09-03', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(390, 8, 92, 8, 3, 2, '2026-09-03', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(391, 9, 93, 5, 3, 2, '2026-09-03', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(394, 12, 96, 14, 8, 1, '2026-09-03', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(403, 6, 111, 7, 3, 1, '2026-09-03', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(404, 7, 112, 1, 2, 2, '2026-09-03', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(405, 8, 113, 8, 3, 2, '2026-09-03', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(406, 9, 114, 5, 3, 2, '2026-09-03', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(409, 12, 117, 14, 8, 1, '2026-09-03', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(417, 4, 130, 4, 6, 1, '2026-09-04', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(418, 6, 132, 7, 3, 1, '2026-09-04', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(419, 7, 133, 1, 2, 2, '2026-09-04', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(420, 8, 134, 8, 3, 2, '2026-09-04', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(421, 9, 135, 5, 3, 2, '2026-09-04', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(424, 12, 138, 14, 8, 1, '2026-09-04', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(432, 4, 151, 4, 6, 1, '2026-09-04', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(433, 6, 153, 7, 3, 1, '2026-09-04', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(434, 7, 154, 1, 2, 2, '2026-09-04', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(435, 8, 155, 8, 3, 2, '2026-09-04', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(436, 9, 156, 5, 3, 2, '2026-09-04', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(439, 12, 3, 14, 8, 1, '2026-09-04', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(448, 6, 18, 7, 3, 1, '2026-09-05', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(463, 6, 39, 7, 3, 1, '2026-09-05', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(499, 12, 87, 14, 8, 1, '2026-09-07', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(501, 14, 89, 6, 4, 1, '2026-09-07', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(502, 15, 90, 1, 4, 1, '2026-09-07', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(508, 6, 102, 7, 3, 1, '2026-09-07', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(510, 8, 104, 8, 3, 2, '2026-09-07', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(513, 11, 107, 10, 10, 2, '2026-09-07', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(514, 12, 108, 14, 8, 1, '2026-09-07', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(516, 14, 110, 6, 4, 1, '2026-09-07', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(517, 15, 111, 1, 4, 1, '2026-09-07', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(523, 6, 123, 7, 3, 1, '2026-09-07', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(527, 10, 127, 13, 11, 2, '2026-09-08', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(530, 13, 130, 9, 9, 1, '2026-09-08', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(535, 2, 140, 2, 5, 1, '2026-09-08', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(538, 6, 144, 7, 3, 1, '2026-09-08', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(542, 10, 148, 13, 11, 2, '2026-09-08', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(545, 13, 151, 9, 9, 1, '2026-09-08', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(550, 2, 5, 2, 5, 1, '2026-09-08', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(555, 8, 11, 8, 3, 2, '2026-09-09', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(556, 9, 12, 5, 3, 2, '2026-09-09', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(557, 10, 13, 13, 11, 2, '2026-09-09', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(558, 11, 14, 10, 10, 2, '2026-09-09', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(559, 12, 15, 14, 8, 1, '2026-09-09', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(563, 19, 22, 5, 8, 1, '2026-09-09', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(570, 8, 32, 8, 3, 2, '2026-09-09', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(571, 9, 33, 5, 3, 2, '2026-09-09', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(572, 10, 34, 13, 11, 2, '2026-09-09', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(573, 11, 35, 10, 10, 2, '2026-09-09', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(574, 12, 36, 14, 8, 1, '2026-09-09', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(578, 19, 43, 5, 8, 1, '2026-09-09', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(586, 9, 54, 5, 3, 2, '2026-09-10', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(587, 10, 55, 13, 11, 2, '2026-09-10', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(589, 12, 57, 14, 8, 1, '2026-09-10', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(595, 2, 68, 2, 5, 1, '2026-09-10', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(599, 7, 73, 1, 2, 2, '2026-09-10', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(600, 8, 74, 8, 3, 2, '2026-09-10', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(601, 9, 75, 5, 3, 2, '2026-09-10', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(602, 10, 76, 13, 11, 2, '2026-09-10', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(604, 12, 78, 14, 8, 1, '2026-09-10', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(614, 7, 94, 1, 2, 2, '2026-09-11', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(615, 8, 95, 8, 3, 2, '2026-09-11', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(616, 9, 96, 5, 3, 2, '2026-09-11', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(619, 12, 99, 14, 8, 1, '2026-09-11', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(629, 7, 115, 1, 2, 2, '2026-09-11', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(630, 8, 116, 8, 3, 2, '2026-09-11', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(631, 9, 117, 5, 3, 2, '2026-09-11', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(634, 12, 120, 14, 8, 1, '2026-09-11', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(643, 6, 135, 7, 3, 1, '2026-09-12', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(644, 7, 136, 1, 2, 2, '2026-09-12', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(658, 6, 156, 7, 3, 1, '2026-09-12', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(659, 7, 1, 1, 2, 2, '2026-09-12', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(701, 3, 60, 3, 6, 1, '2026-09-14', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(703, 6, 63, 7, 3, 1, '2026-09-14', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(705, 8, 65, 8, 3, 2, '2026-09-14', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(707, 10, 67, 13, 11, 2, '2026-09-14', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(708, 11, 68, 10, 10, 2, '2026-09-14', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(709, 12, 69, 14, 8, 1, '2026-09-14', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(710, 13, 70, 9, 9, 1, '2026-09-14', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(711, 14, 71, 6, 4, 1, '2026-09-14', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(712, 15, 72, 1, 4, 1, '2026-09-14', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(716, 3, 81, 3, 6, 1, '2026-09-14', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(718, 6, 84, 7, 3, 1, '2026-09-14', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(720, 8, 86, 8, 3, 2, '2026-09-14', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(722, 10, 88, 13, 11, 2, '2026-09-14', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(723, 11, 89, 10, 10, 2, '2026-09-14', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(724, 12, 90, 14, 8, 1, '2026-09-14', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(725, 13, 91, 9, 9, 1, '2026-09-14', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(726, 14, 92, 6, 4, 1, '2026-09-14', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(733, 6, 105, 7, 3, 1, '2026-09-15', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(734, 7, 106, 1, 2, 2, '2026-09-15', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(735, 8, 107, 8, 3, 2, '2026-09-15', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(736, 9, 108, 5, 3, 2, '2026-09-15', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(737, 10, 109, 13, 11, 2, '2026-09-15', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(739, 12, 111, 14, 8, 1, '2026-09-15', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(740, 13, 112, 9, 9, 1, '2026-09-15', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(748, 6, 126, 7, 3, 1, '2026-09-15', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(749, 7, 127, 1, 2, 2, '2026-09-15', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(750, 8, 128, 8, 3, 2, '2026-09-15', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(751, 9, 129, 5, 3, 2, '2026-09-15', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(752, 10, 130, 13, 11, 2, '2026-09-15', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(753, 11, 131, 10, 10, 2, '2026-09-15', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(754, 12, 132, 14, 8, 1, '2026-09-15', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(763, 6, 147, 7, 3, 1, '2026-09-16', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(765, 8, 149, 8, 3, 2, '2026-09-16', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(766, 9, 150, 5, 3, 2, '2026-09-16', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(768, 11, 152, 10, 10, 2, '2026-09-16', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(778, 6, 12, 7, 3, 1, '2026-09-16', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(780, 8, 14, 8, 3, 2, '2026-09-16', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(781, 9, 15, 5, 3, 2, '2026-09-16', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(790, 2, 29, 2, 5, 1, '2026-09-17', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(793, 6, 33, 7, 3, 1, '2026-09-17', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(794, 7, 34, 1, 2, 2, '2026-09-17', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(795, 8, 35, 8, 3, 2, '2026-09-17', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(796, 9, 36, 5, 3, 2, '2026-09-17', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(799, 12, 39, 14, 8, 1, '2026-09-17', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(805, 2, 50, 2, 5, 1, '2026-09-17', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(808, 6, 54, 7, 3, 1, '2026-09-17', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(809, 7, 55, 1, 2, 2, '2026-09-17', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(810, 8, 56, 8, 3, 2, '2026-09-17', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(822, 4, 73, 4, 6, 1, '2026-09-18', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(823, 6, 75, 7, 3, 1, '2026-09-18', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(824, 7, 76, 1, 2, 2, '2026-09-18', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(829, 12, 81, 14, 8, 1, '2026-09-18', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(838, 6, 96, 7, 3, 1, '2026-09-18', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(898, 6, 24, 7, 3, 1, '2026-09-21', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(900, 8, 26, 8, 3, 2, '2026-09-21', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(901, 9, 27, 5, 3, 2, '2026-09-21', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(902, 10, 28, 13, 11, 2, '2026-09-21', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(903, 11, 29, 10, 10, 2, '2026-09-21', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(904, 12, 30, 14, 8, 1, '2026-09-21', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(905, 13, 31, 9, 9, 1, '2026-09-21', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(906, 14, 32, 6, 4, 1, '2026-09-21', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(907, 15, 33, 1, 4, 1, '2026-09-21', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(913, 6, 45, 7, 3, 1, '2026-09-21', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(915, 8, 47, 8, 3, 2, '2026-09-21', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(916, 9, 48, 5, 3, 2, '2026-09-21', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(917, 10, 49, 13, 11, 2, '2026-09-21', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(918, 11, 50, 10, 10, 2, '2026-09-21', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(919, 12, 51, 14, 8, 1, '2026-09-21', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(920, 13, 52, 9, 9, 1, '2026-09-21', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(921, 14, 53, 6, 4, 1, '2026-09-21', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(922, 15, 54, 1, 4, 1, '2026-09-21', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(928, 6, 66, 7, 3, 1, '2026-09-22', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(929, 7, 67, 1, 2, 2, '2026-09-22', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(930, 8, 68, 8, 3, 2, '2026-09-22', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(931, 9, 69, 5, 3, 2, '2026-09-22', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(932, 10, 70, 13, 11, 2, '2026-09-22', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(934, 12, 72, 14, 8, 1, '2026-09-22', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(935, 13, 73, 9, 9, 1, '2026-09-22', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(943, 6, 87, 7, 3, 1, '2026-09-22', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(944, 7, 88, 1, 2, 2, '2026-09-22', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(945, 8, 89, 8, 3, 2, '2026-09-22', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(946, 9, 90, 5, 3, 2, '2026-09-22', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(947, 10, 91, 13, 11, 2, '2026-09-22', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(949, 12, 93, 14, 8, 1, '2026-09-22', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(950, 13, 94, 9, 9, 1, '2026-09-22', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(954, 1, 103, 1, 2, 1, '2026-09-23', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(958, 6, 108, 7, 3, 1, '2026-09-23', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(960, 8, 110, 8, 3, 2, '2026-09-23', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(962, 10, 112, 13, 11, 2, '2026-09-23', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(963, 11, 113, 10, 10, 2, '2026-09-23', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(964, 12, 114, 14, 8, 1, '2026-09-23', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(969, 1, 124, 1, 2, 1, '2026-09-23', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(973, 6, 129, 7, 3, 1, '2026-09-23', '12:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(975, 8, 131, 8, 3, 2, '2026-09-23', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(977, 10, 133, 13, 11, 2, '2026-09-23', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(978, 11, 134, 10, 10, 2, '2026-09-23', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(979, 12, 135, 14, 8, 1, '2026-09-23', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(988, 6, 150, 7, 3, 1, '2026-09-24', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(989, 7, 151, 1, 2, 2, '2026-09-24', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(990, 8, 152, 8, 3, 2, '2026-09-24', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(991, 9, 153, 5, 3, 2, '2026-09-24', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(994, 12, 156, 14, 8, 1, '2026-09-24', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1003, 6, 15, 7, 3, 1, '2026-09-24', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1004, 7, 16, 1, 2, 2, '2026-09-24', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1005, 8, 17, 8, 3, 2, '2026-09-24', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1006, 9, 18, 5, 3, 2, '2026-09-24', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1009, 12, 21, 14, 8, 1, '2026-09-24', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1017, 4, 34, 4, 6, 1, '2026-09-25', '12:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1018, 6, 36, 7, 3, 1, '2026-09-25', '13:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1019, 7, 37, 1, 2, 2, '2026-09-25', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1020, 8, 38, 8, 3, 2, '2026-09-25', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1021, 9, 39, 5, 3, 2, '2026-09-25', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1024, 12, 42, 14, 8, 1, '2026-09-25', '16:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1032, 4, 55, 4, 6, 1, '2026-09-25', '13:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1033, 6, 57, 7, 3, 1, '2026-09-25', '14:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1034, 7, 58, 1, 2, 2, '2026-09-25', '14:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1035, 8, 59, 8, 3, 2, '2026-09-25', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1036, 9, 60, 5, 3, 2, '2026-09-25', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1039, 12, 63, 14, 8, 1, '2026-09-25', '17:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:30:13'),
(1347, 8, 1, 8, 3, 2, '2026-07-22', '09:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1348, 23, 2, 11, 4, 1, '2026-07-23', '10:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1349, 25, 3, 12, 5, 1, '2026-07-24', '15:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1350, 11, 4, 10, 10, 2, '2026-07-27', '17:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1351, 27, 5, 15, 12, 1, '2026-07-29', '11:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1352, 6, 6, 7, 3, 1, '2026-07-31', '14:20:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1353, 12, 7, 14, 8, 1, '2026-08-03', '09:40:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1354, 8, 8, 8, 3, 2, '2026-08-05', '16:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1355, 23, 9, 11, 4, 1, '2026-08-07', '18:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1356, 25, 10, 12, 5, 1, '2026-08-10', '10:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1357, 11, 11, 10, 10, 2, '2026-08-12', '15:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1358, 27, 12, 15, 12, 1, '2026-08-14', '12:20:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1359, 9, 13, 5, 3, 2, '2026-08-18', '17:10:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1360, 1, 14, 1, 2, 1, '2026-08-20', '09:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1361, 12, 15, 14, 8, 1, '2026-08-24', '16:40:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1362, 14, 16, 6, 4, 1, '2026-08-27', '18:00:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05'),
(1363, 6, 17, 7, 3, 1, '2026-08-31', '11:30:00', 'pendiente', 'normal', NULL, '2026-07-23 00:55:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `rol` enum('admin','secretaria','medico') NOT NULL,
  `sucursal_id` int(11) DEFAULT NULL,
  `profesional_id` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `telefono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `nombre`, `email`, `rol`, `sucursal_id`, `profesional_id`, `activo`, `creado_en`, `telefono`) VALUES
(1, 'admin', '$2a$10$hrZiTl1I2Ahpswp1q2/cgeZUBq9BWH2WUvXh2q3vIRNIVQInhxMsO', 'Administrador', 'admin@consultorio.com', 'admin', NULL, NULL, 1, '2026-06-27 20:39:37', NULL),
(2, 'admin2', '$2a$10$eoWRj.D2qRPwA.vnrIPDOO0Bpw6oOTXbRkCEDdG7/MXEXoaOzeIEa', 'roberto Ferreira', 'RFerreira@gmail.com', 'admin', NULL, NULL, 1, '2026-06-30 20:55:56', NULL),
(3, 'secretaria1', '$2a$10$6aXi16IkGk5uWlAcPqVMqOTW/m2ua85glpWuiq/wJih/KIGkXSBZK', 'Isabela Rosales', 'isaRosa@gmail.com', 'secretaria', NULL, NULL, 1, '2026-06-30 20:56:57', NULL),
(4, 'med1', '$2a$10$Azx6HljmbQFLdaui.IuXGu.6h7lBVcW17i8YQJMt6/0R5YjCxKJtS', 'Luis Martinez', 'luis.martinez5@gmail.com', 'medico', NULL, 5, 1, '2026-07-12 09:08:50', NULL);

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
  ADD KEY `idx_horarios_agenda_dia` (`agenda_id`,`dia_semana`);

--
-- Indices de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ausencias_agenda_fechas` (`agenda_id`,`fecha_inicio`,`fecha_fin`);

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
-- Indices de la tabla `solicitudes_ausencias`
--
ALTER TABLE `solicitudes_ausencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agenda_id` (`agenda_id`);

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
  ADD UNIQUE KEY `uk_turno_horario` (`profesional_id`,`fecha`,`hora`),
  ADD UNIQUE KEY `uk_turno_profesional_fecha_hora` (`profesional_id`,`fecha`,`hora`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `fk_turno_especialidad` (`especialidad_id`),
  ADD KEY `fk_turno_sucursal` (`sucursal_id`),
  ADD KEY `idx_turnos_prof_fecha_hora` (`profesional_id`,`fecha`,`hora`),
  ADD KEY `idx_turnos_agenda_fecha` (`agenda_id`,`fecha`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `sucursal_id` (`sucursal_id`),
  ADD KEY `profesional_id` (`profesional_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agendas`
--
ALTER TABLE `agendas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `agenda_horarios`
--
ALTER TABLE `agenda_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `profesional_sucursal`
--
ALTER TABLE `profesional_sucursal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `solicitudes_ausencias`
--
ALTER TABLE `solicitudes_ausencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1366;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Filtros para la tabla `solicitudes_ausencias`
--
ALTER TABLE `solicitudes_ausencias`
  ADD CONSTRAINT `solicitudes_ausencias_ibfk_1` FOREIGN KEY (`agenda_id`) REFERENCES `agendas` (`id`);

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
