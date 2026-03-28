-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql211.infinityfree.com
-- Generation Time: Mar 27, 2026 at 01:03 PM
-- Server version: 11.4.10-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_38886315_jurismemo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `user_id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(1, 1, 'Emmanuel Emeka', 'donugob1@gmail.com', 'Congrats to me', 'Using this test message as a medium to congratulate myself on my progress so far with the development of jurismemo.', '2025-05-02 15:32:04'),
(3, 1, 'Emeka Ugo.B', 'donugob1@gmail.com', 'Hehe', 'Completed Resources Tab ðŸ˜‚ðŸ˜‚', '2025-05-04 16:48:55');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `level` varchar(10) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `credit_units` int(11) NOT NULL,
  `is_elective` tinyint(4) DEFAULT 0,
  `elective_group` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_code`, `title`, `level`, `semester`, `credit_units`, `is_elective`, `elective_group`) VALUES
(1, 'GST 101', 'Use of English', '100L', '100L Semester 1', 2, 0, NULL),
(2, 'GST 103', 'Philosophy Of Logic', '100L', '100L Semester 1', 2, 0, NULL),
(3, 'GST 105', 'Citizenship Education', '100L', '100L Semester 1', 2, 0, NULL),
(4, 'GST 109', 'Use of Igbo Language', '100L', '100L Semester 1', 2, 0, NULL),
(5, 'FRN 101', 'Elementary French', '100L', '100L Semester 1', 2, 0, NULL),
(6, 'SOC 101', 'Introduction To Sociology', '100L', '100L Semester 1', 2, 0, NULL),
(7, 'ENG 131', 'Composition and Prose', '100L', '100L Semester 1', 3, 0, NULL),
(8, 'POS 101', 'Introduction to Political Science', '100L', '100L Semester 1', 3, 0, NULL),
(9, 'ECO 101', 'Elements of Economics', '100L', '100L Semester 1', 3, 0, NULL),
(10, 'LAW 141', 'Legal Method', '100L', '100L Semester 1', 2, 0, NULL),
(11, 'LAW 151', 'Logic and Philosophical Thoughts', '100L', '100L Semester 1', 4, 0, NULL),
(12, 'GST 102', 'Use of Library', '100L', '100L Semester 2', 2, 0, NULL),
(13, 'GST 104', 'History and Philosophy Of Science', '100L', '100L Semester 2', 2, 0, NULL),
(14, 'GST 106', 'Introduction to Computer Packages', '100L', '100L Semester 2', 2, 0, NULL),
(15, 'GST 109', 'Use of Igbo Language 2', '100L', '100L Semester 2', 2, 0, NULL),
(16, 'GST 108', 'Entrepreneurship', '100L', '100L Semester 2', 2, 0, NULL),
(17, 'FRN 102', 'Elementary French 2', '100L', '100L Semester 2', 2, 0, NULL),
(18, 'SOC 102', 'Introduction to Sociology 2', '100L', '100L Semester 2', 2, 0, NULL),
(19, 'ENG 112', 'Rhetoric and Composition', '100L', '100L Semester 2', 3, 0, NULL),
(20, 'POS 102', 'Introduction to African Politics', '100L', '100L Semester 2', 3, 0, NULL),
(21, 'ECO 142', 'Industrial Relations', '100L', '100L Semester 2', 3, 0, NULL),
(22, 'LAW 142', 'Legal Method 2', '100L', '100L Semester 2', 2, 0, NULL),
(23, 'LAW 152', 'Logic and Philosophical Thoughts 2', '100L', '100L Semester 2', 4, 0, NULL),
(24, 'LAW 211', 'Law of Contract', '200L', '200L Semester 1', 4, 0, NULL),
(25, 'LAW 221', 'Constitutional Law', '200L', '200L Semester 1', 4, 0, NULL),
(26, 'LAW 223', 'Nigerian Legal System', '200L', '200L Semester 1', 4, 0, NULL),
(27, 'LAW 225', 'Admin Law', '200L', '200L Semester 1', 4, 0, NULL),
(28, 'POL 241', 'Introduction to International Relation', '200L', '200L Semester 1', 3, 0, NULL),
(29, 'INS 201', 'Principles of Insurance', '200L', '200L Semester 1', 3, 1, 'INS 201/MGT 201'),
(30, 'MGT 201', 'Management', '200L', '200L Semester 1', 3, 1, 'INS 201/MGT 201'),
(31, 'GST 208', 'Entrepreneurship', '200L', '200L Semester 1', 2, 0, NULL),
(32, 'LAW 212', 'Law of Contract II', '200L', '200L Semester 2', 4, 0, NULL),
(33, 'LAW 222', 'Constitutional Law II', '200L', '200L Semester 2', 4, 0, NULL),
(34, 'LAW 224', 'Nigerian Legal System II', '200L', '200L Semester 2', 4, 0, NULL),
(35, 'LAW 226', 'Administrative Law', '200L', '200L Semester 2', 4, 0, NULL),
(36, 'COMP 202', 'Introduction to Computer', '200L', '200L Semester 2', 2, 0, NULL),
(37, 'GST 222', 'Peace and Conflict Resolution', '200L', '200L Semester 2', 2, 0, NULL),
(38, 'INS 201-2', 'Principles of Insurance', '200L', '200L Semester 2', 3, 1, 'INS 201/MGT-2'),
(39, 'MGT 201-2', 'Management', '200L', '200L Semester 2', 3, 1, 'INS 201/MGT-2'),
(40, 'LAW 311', 'Law of Torts', '300L', '300L Semester 1', 4, 0, NULL),
(41, 'LAW 321', 'Criminal Law', '300L', '300L Semester 1', 4, 0, NULL),
(42, 'LAW 351', 'Commercial Law', '300L', '300L Semester 1', 4, 0, NULL),
(43, 'LAW 355-Banking', 'Banking Law', '300L', '300L Semester 1', 4, 1, 'LAW 355'),
(44, 'LAW 355-Arbitration', 'Arbitration Law', '300L', '300L Semester 1', 4, 1, 'LAW 355'),
(45, 'LAW 355-Labour', 'Labour Law', '300L', '300L Semester 1', 4, 1, 'LAW 355'),
(46, 'SOC 305', 'Sociology of Crime and Delinquency', '300L', '300L Semester 1', 3, 1, 'SOC 305/MGT'),
(47, 'MGT 305', 'Management', '300L', '300L Semester 1', 3, 1, 'SOC 305/MGT'),
(48, 'LAW 312', 'Law of Torts II', '300L', '300L Semester 2', 4, 0, NULL),
(49, 'LAW 322', 'Criminal Law II', '300L', '300L Semester 2', 4, 0, NULL),
(50, 'LAW 352', 'Commercial Law II', '300L', '300L Semester 2', 4, 0, NULL),
(51, 'COMP 302', 'Computer Application', '300L', '300L Semester 2', 3, 0, NULL),
(52, 'LAW 356-Insurance', 'Insurance Law', '300L', '300L Semester 2', 4, 1, 'LAW 356'),
(53, 'LAW 356-Arbitration', 'Arbitration Law', '300L', '300L Semester 2', 4, 1, 'LAW 356'),
(54, 'LAW 356-Labour', 'Labour Law', '300L', '300L Semester 2', 4, 1, 'LAW 356'),
(55, 'SOC 306', 'Sociology of Crime and Delinquency', '300L', '300L Semester 2', 3, 1, 'SOC 306/MGT'),
(56, 'MGT 306', 'Management', '300L', '300L Semester 2', 3, 1, 'SOC 306/MGT'),
(57, 'LAW 411', 'Nigerian Land Law', '400L', '400L Semester 1', 4, 0, NULL),
(58, 'LAW 413', 'Equity and Trust', '400L', '400L Semester 1', 4, 0, NULL),
(59, 'LAW 421', 'Evidence Law and Procedure', '400L', '400L Semester 1', 4, 0, NULL),
(60, 'LAW 457-Family', 'Family Law', '400L', '400L Semester 1', 4, 1, 'LAW 457'),
(61, 'LAW 457-Conveyancing', 'Conveyancing', '400L', '400L Semester 1', 4, 1, 'LAW 457'),
(62, 'LAW 457-Oil', 'Oil and Gas', '400L', '400L Semester 1', 4, 1, 'LAW 457'),
(63, 'SOC 413-Sociology', 'Industrial Sociology', '400L', '400L Semester 1', 3, 1, 'SOC 413'),
(64, 'SOC 413-Psychology', 'Industrial Psychology', '400L', '400L Semester 1', 3, 1, 'SOC 413'),
(65, 'LAW 412', 'Nigerian Land Law II', '400L', '400L Semester 2', 4, 0, NULL),
(66, 'LAW 414', 'Equity and Trust', '400L', '400L Semester 2', 4, 0, NULL),
(67, 'LAW 422', 'Evidence Law and Procedure', '400L', '400L Semester 2', 4, 0, NULL),
(68, 'LAW 456-Family', 'Family Law', '400L', '400L Semester 2', 4, 1, 'LAW 456'),
(69, 'LAW 456-Conveyancing', 'Conveyancing', '400L', '400L Semester 2', 4, 1, 'LAW 456'),
(70, 'LAW 456-Oil', 'Oil and Gas', '400L', '400L Semester 2', 4, 1, 'LAW 456'),
(71, 'SOC 406', 'Sociology', '400L', '400L Semester 2', 3, 1, 'SOC 406/MGT'),
(72, 'MGT 406', 'Management', '400L', '400L Semester 2', 3, 1, 'SOC 406/MGT'),
(73, 'LAW 521', 'Company Law', '500L', '500L Semester 1', 4, 0, NULL),
(74, 'LAW 541', 'Jurisprudence and Legal Theory', '500L', '500L Semester 1', 4, 0, NULL),
(75, 'LAW 531', 'Human Rights', '500L', '500L Semester 1', 4, 0, NULL),
(76, 'LAW 533', 'Public and International Law', '500L', '500L Semester 1', 4, 0, NULL),
(77, 'LAW 522', 'Company Law II', '500L', '500L Semester 2', 4, 0, NULL),
(78, 'LAW 542', 'Jurisprudence and Legal Theory', '500L', '500L Semester 2', 4, 0, NULL),
(79, 'LAW 592', 'Long Essay/Project', '500L', '500L Semester 2', 6, 0, NULL),
(80, 'LAW 531', 'Human Rights Law', '500L', '500L Semester 2', 4, 0, NULL),
(81, 'LAW 536', 'Public International Law', '500L', '500L Semester 2', 4, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `elective_choices`
--

CREATE TABLE `elective_choices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level` varchar(10) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `elective_group` varchar(50) NOT NULL,
  `chosen_course_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `level` varchar(10) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `grade` enum('A','B','C','D','E','F') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `user_id`, `course_code`, `level`, `semester`, `grade`, `created_at`) VALUES
(1, 1, 'GST 101', '100L', '100L Semester 1', 'A', '2025-05-03 13:31:46'),
(2, 1, 'GST 103', '100L', '100L Semester 1', 'C', '2025-05-03 13:32:18'),
(3, 1, 'GST 105', '100L', '100L Semester 1', 'B', '2025-05-03 13:32:37'),
(4, 1, 'GST 109', '100L', '100L Semester 1', 'D', '2025-05-03 13:33:14'),
(5, 1, 'LAW 151', '100L', '100L Semester 1', 'B', '2025-05-03 13:33:40'),
(7, 1, 'SOC 101', '100L', '100L Semester 1', 'C', '2025-05-03 13:35:15'),
(8, 1, 'POS 101', '100L', '100L Semester 1', 'D', '2025-05-03 13:35:53'),
(55, 1, 'FRN 101', '100L', '100L Semester 1', 'C', '2025-05-04 21:04:19'),
(10, 1, 'LAW 141', '100L', '100L Semester 1', 'C', '2025-05-03 13:36:23'),
(11, 1, 'ECO 101', '100L', '100L Semester 1', 'B', '2025-05-03 13:36:56'),
(12, 1, 'ENG 131', '100L', '100L Semester 1', 'D', '2025-05-03 13:37:21'),
(18, 1, 'GST 102', '100L', '100L Semester 2', 'C', '2025-05-03 17:42:37'),
(15, 4, 'GST 101', '100L', '100L Semester 1', 'A', '2025-05-03 13:48:20'),
(16, 4, 'SOC 101', '100L', '100L Semester 1', 'C', '2025-05-03 13:48:42'),
(17, 4, 'MGT 201-2', '200L', '200L Semester 2', 'C', '2025-05-03 13:49:33'),
(19, 1, 'GST 104', '100L', '100L Semester 2', 'B', '2025-05-03 17:42:53'),
(20, 1, 'GST 106', '100L', '100L Semester 2', 'B', '2025-05-03 17:43:09'),
(21, 1, 'GST 109', '100L', '100L Semester 2', 'A', '2025-05-03 17:43:28'),
(22, 1, 'GST 108', '100L', '100L Semester 2', 'B', '2025-05-03 17:43:41'),
(23, 1, 'LAW 152', '100L', '100L Semester 2', 'C', '2025-05-03 17:44:14'),
(24, 1, 'FRN 102', '100L', '100L Semester 2', 'A', '2025-05-03 17:44:37'),
(25, 1, 'ENG 112', '100L', '100L Semester 2', 'C', '2025-05-03 17:44:47'),
(26, 1, 'POS 102', '100L', '100L Semester 2', 'A', '2025-05-03 17:44:56'),
(27, 1, 'LAW 142', '100L', '100L Semester 2', 'C', '2025-05-03 17:45:05'),
(28, 1, 'ECO 142', '100L', '100L Semester 2', 'B', '2025-05-03 17:45:16'),
(29, 1, 'SOC 102', '100L', '100L Semester 2', 'B', '2025-05-03 17:45:37'),
(30, 1, 'LAW 221', '200L', '200L Semester 1', 'B', '2025-05-03 17:46:35'),
(31, 1, 'LAW 211', '200L', '200L Semester 1', 'C', '2025-05-03 17:46:48'),
(32, 1, 'LAW 223', '200L', '200L Semester 1', 'C', '2025-05-03 17:46:56'),
(54, 1, 'LAW 225', '200L', '200L Semester 1', 'A', '2025-05-04 21:03:54'),
(34, 1, 'POL 241', '200L', '200L Semester 1', 'B', '2025-05-03 17:48:58'),
(35, 1, 'INS 201', '200L', '200L Semester 1', 'A', '2025-05-03 17:49:29'),
(36, 1, 'GST 208', '200L', '200L Semester 1', 'B', '2025-05-03 17:49:38'),
(37, 1, 'LAW 222', '200L', '200L Semester 2', 'B', '2025-05-03 17:50:17'),
(38, 1, 'LAW 212', '200L', '200L Semester 2', 'C', '2025-05-03 17:50:35'),
(39, 1, 'LAW 224', '200L', '200L Semester 2', 'B', '2025-05-03 17:50:43'),
(40, 1, 'LAW 226', '200L', '200L Semester 2', 'A', '2025-05-03 17:51:06'),
(41, 1, 'COMP 202', '200L', '200L Semester 2', 'C', '2025-05-03 17:51:36'),
(42, 1, 'LAW 321', '300L', '300L Semester 1', 'A', '2025-05-03 17:52:43'),
(43, 1, 'LAW 351', '300L', '300L Semester 1', 'B', '2025-05-03 17:52:56'),
(44, 1, 'LAW 311', '300L', '300L Semester 1', 'A', '2025-05-03 17:53:47'),
(45, 1, 'SOC 305', '300L', '300L Semester 1', 'C', '2025-05-03 17:53:58'),
(46, 1, 'LAW 322', '300L', '300L Semester 2', 'B', '2025-05-03 17:55:45'),
(50, 1, 'LAW 352', '300L', '300L Semester 2', 'D', '2025-05-03 20:00:24'),
(48, 1, 'LAW 312', '300L', '300L Semester 2', 'B', '2025-05-03 17:56:46'),
(49, 1, 'LAW 356-Insurance', '300L', '300L Semester 2', 'A', '2025-05-03 17:56:58'),
(91, 8, 'LAW 211', '200L', '200L Semester 1', 'C', '2025-07-22 10:10:55'),
(92, 8, 'LAW 221', '200L', '200L Semester 1', 'C', '2025-07-22 10:11:25'),
(93, 8, 'LAW 223', '200L', '200L Semester 1', 'B', '2025-07-22 10:11:51'),
(94, 8, 'LAW 225', '200L', '200L Semester 1', 'C', '2025-07-22 10:12:04'),
(90, 8, 'LAW 152', '100L', '100L Semester 2', 'C', '2025-07-22 10:10:23'),
(89, 8, 'LAW 142', '100L', '100L Semester 2', 'C', '2025-07-22 10:10:00'),
(88, 8, 'ECO 142', '100L', '100L Semester 2', 'C', '2025-07-22 10:09:45'),
(87, 8, 'POS 102', '100L', '100L Semester 2', 'D', '2025-07-22 10:09:18'),
(79, 8, 'GST 102', '100L', '100L Semester 2', 'C', '2025-07-22 10:04:52'),
(80, 8, 'GST 104', '100L', '100L Semester 2', 'B', '2025-07-22 10:05:14'),
(81, 8, 'GST 106', '100L', '100L Semester 2', 'C', '2025-07-22 10:05:54'),
(82, 8, 'GST 109', '100L', '100L Semester 2', 'B', '2025-07-22 10:06:54'),
(83, 8, 'GST 108', '100L', '100L Semester 2', 'B', '2025-07-22 10:07:26'),
(84, 8, 'FRN 102', '100L', '100L Semester 2', 'A', '2025-07-22 10:08:10'),
(85, 8, 'SOC 102', '100L', '100L Semester 2', 'C', '2025-07-22 10:08:39'),
(86, 8, 'ENG 112', '100L', '100L Semester 2', 'C', '2025-07-22 10:08:59'),
(95, 8, 'POL 241', '200L', '200L Semester 1', 'E', '2025-07-22 10:13:20'),
(96, 8, 'INS 201', '200L', '200L Semester 1', 'A', '2025-07-22 10:13:42'),
(97, 8, 'GST 208', '200L', '200L Semester 1', 'B', '2025-07-22 10:13:59'),
(98, 8, 'LAW 212', '200L', '200L Semester 2', 'C', '2025-07-22 10:14:30'),
(99, 8, 'LAW 222', '200L', '200L Semester 2', 'C', '2025-07-22 10:14:41'),
(100, 8, 'LAW 224', '200L', '200L Semester 2', 'C', '2025-07-22 10:14:57'),
(101, 8, 'LAW 226', '200L', '200L Semester 2', 'B', '2025-07-22 10:15:09'),
(102, 8, 'INS 201-2', '200L', '200L Semester 2', 'C', '2025-07-22 10:15:34'),
(103, 8, 'LAW 355-Arbitration', '300L', '300L Semester 1', 'C', '2025-07-22 10:16:05'),
(104, 8, 'LAW 321', '300L', '300L Semester 1', 'C', '2025-07-22 10:16:16'),
(105, 8, 'LAW 351', '300L', '300L Semester 1', 'C', '2025-07-22 10:16:30'),
(106, 8, 'LAW 311', '300L', '300L Semester 1', 'B', '2025-07-22 10:17:08'),
(107, 8, 'SOC 305', '300L', '300L Semester 1', 'C', '2025-07-22 10:17:30'),
(108, 8, 'LAW 312', '300L', '300L Semester 2', 'B', '2025-07-22 10:17:58'),
(109, 8, 'LAW 322', '300L', '300L Semester 2', 'B', '2025-07-22 10:18:38'),
(110, 8, 'LAW 352', '300L', '300L Semester 2', 'D', '2025-07-22 10:18:51'),
(111, 8, 'COMP 302', '300L', '300L Semester 2', 'C', '2025-07-22 10:19:04'),
(112, 8, 'LAW 356-Arbitration', '300L', '300L Semester 2', 'A', '2025-07-22 10:19:24'),
(113, 8, 'SOC 306', '300L', '300L Semester 2', 'A', '2025-07-22 12:49:57'),
(114, 10, 'GST 101', '100L', '100L Semester 1', 'C', '2025-10-01 06:37:01'),
(118, 10, 'LAW 151', '100L', '100L Semester 1', 'C', '2025-10-01 06:39:01'),
(116, 10, 'ENG 131', '100L', '100L Semester 1', 'D', '2025-10-01 06:38:13'),
(117, 10, 'LAW 141', '100L', '100L Semester 1', 'C', '2025-10-01 06:38:35'),
(119, 10, 'ECO 101', '100L', '100L Semester 1', 'C', '2025-10-01 06:39:23'),
(120, 10, 'POS 101', '100L', '100L Semester 1', 'C', '2025-10-01 06:39:55'),
(124, 11, 'GST 109', '100L', '100L Semester 1', 'A', '2025-10-10 11:11:18'),
(123, 11, 'GST 101', '100L', '100L Semester 1', 'A', '2025-10-10 11:10:58'),
(125, 11, 'ENG 131', '100L', '100L Semester 1', 'B', '2025-10-10 11:11:40'),
(126, 11, 'ECO 101', '100L', '100L Semester 1', 'E', '2025-10-10 11:11:53'),
(127, 11, 'LAW 141', '100L', '100L Semester 1', 'B', '2025-10-10 11:12:14'),
(128, 11, 'LAW 151', '100L', '100L Semester 1', 'A', '2025-10-10 11:12:31'),
(129, 11, 'GST 102', '100L', '100L Semester 2', 'B', '2025-10-10 11:13:01'),
(130, 11, 'GST 106', '100L', '100L Semester 2', 'B', '2025-10-10 11:13:16'),
(131, 11, 'GST 109', '100L', '100L Semester 2', 'C', '2025-10-10 11:13:33'),
(132, 11, 'LAW 142', '100L', '100L Semester 2', 'B', '2025-10-10 11:13:45'),
(133, 11, 'LAW 152', '100L', '100L Semester 2', 'A', '2025-10-10 11:13:57'),
(134, 11, 'POS 102', '100L', '100L Semester 2', 'A', '2025-10-10 11:14:19'),
(136, 1, 'GST 222', '200L', '200L Semester 2', 'E', '2026-02-11 13:40:18'),
(137, 1, 'INS 201-2', '200L', '200L Semester 2', 'B', '2026-02-12 06:42:55'),
(138, 1, 'COMP 302', '300L', '300L Semester 2', 'C', '2026-03-01 19:40:58'),
(140, 1, 'SOC 413-Psychology', '400L', '400L Semester 1', 'B', '2026-03-03 18:33:16'),
(141, 1, 'LAW 411', '400L', '400L Semester 1', 'C', '2026-03-03 19:47:45'),
(142, 1, 'LAW 457-Family', '400L', '400L Semester 1', 'B', '2026-03-03 19:49:03'),
(143, 1, 'LAW 413', '400L', '400L Semester 1', 'B', '2026-03-03 19:49:39'),
(144, 1, 'MGT 406', '400L', '400L Semester 2', 'C', '2026-03-03 19:50:12'),
(145, 18, 'LAW 413', '400L', '400L Semester 1', 'A', '2026-03-22 21:11:27');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` enum('Blog','News','Exam') NOT NULL,
  `level` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `category`, `level`, `created_at`) VALUES
(1, 'Exam Schedule Released', 'First semester exams start on June 1, 2025.', 'Exam', 'All', '2025-05-02 23:42:46'),
(2, 'New Blog Post', 'Tips for succeeding in law school.', 'Blog', '100L', '2025-05-02 23:42:46');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `resource_type` enum('Cases','Past Questions','Lecture Notes') NOT NULL,
  `level` varchar(10) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `upload_date` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `title`, `description`, `file_path`, `resource_type`, `level`, `uploaded_by`, `upload_date`) VALUES
(1, 'Equity and Trust I 2023/2024', 'Equity and Trust past question for 2023/2024 session', 'resources/past_questions/resource_1_1746308822.jpg', 'Past Questions', '400L', 1, '2025-05-03 14:47:02'),
(2, 'Contract Law I', 'Contract Law study guide. \r\nPrepared by AOG', 'resources/lecture_notes/resource_2_1746360485.docx', 'Lecture Notes', 'General', 1, '2025-05-04 05:08:05'),
(4, 'Industrial Psychology I 2023/2024', 'Psychology (management) past question', 'resources/past_questions/resource_4_1746391607.jpg', 'Past Questions', '400L', 1, '2025-05-04 13:46:47'),
(5, 'Land Law (by NOUN)', 'Prepared by National Open University', 'resources/lecture_notes/resource_5_1746391983.pdf', 'Lecture Notes', '400L', 1, '2025-05-04 13:53:03'),
(6, 'INDUSTRIAL PSYCHOLOGY I 2024/2025', '1 semester Psychology past question for 2024/2025 session', 'resources/past_questions/resource_6_1746521841.jpg', 'Past Questions', '400L', 1, '2025-05-06 01:57:21'),
(7, 'EVIDENCE LAW I (2024/2025)', 'Evidence law past question (2024/2025)', 'resources/past_questions/resource_7_1746522032.jpg', 'Past Questions', '400L', 1, '2025-05-06 02:00:32'),
(8, 'FAMILY LAW I (2024/2025)', 'Family law past question', 'resources/past_questions/resource_8_1746522227.jpg', 'Past Questions', '400L', 1, '2025-05-06 02:03:47'),
(9, 'BANKING & INSURANCE LAW I (2024/2024)', 'Banking law past question', 'resources/past_questions/resource_9_1746522320.jpg', 'Past Questions', '300L', 1, '2025-05-06 02:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `task` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `task`, `due_date`, `is_completed`, `created_at`) VALUES
(1, 3, 'Read evidence', '2025-05-03', 1, '2025-05-03 02:18:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_picture` varchar(255) DEFAULT NULL,
  `level` varchar(10) DEFAULT NULL,
  `preferred_courses` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `phone_number`, `password`, `address`, `created_at`, `profile_picture`, `level`, `preferred_courses`) VALUES
(1, 'Donugob', 'Emmanuel', 'Emeka', 'donugob1@gmail.com', '08103579586', '$2y$10$UCY77L9AI3ZuzBtFnJ2D5efK0LUNohNbCOjSxPWpMeMYHw8XBkEEG', '2 Oguamanam street', '2025-05-02 15:29:13', 'images/profile_1_1746393382.jpg', '400L', NULL),
(9, 'Drexx', 'Michael', 'Onyekwelu', 'mo22445boss@gmail.com', '08123927685', '$2y$10$gD6AqlFxeHd1RCpJsYM4aOvySV0s9ubp892vy/MFIgl9m/.4IcjqS', '24 Aliu St Bolorunpelu Egbe', '2025-09-01 19:11:22', NULL, NULL, NULL),
(8, 'ehrlich', 'Nzem', 'Divine ', 'nd7065338@gmail.com', '07026105848', '$2y$10$okU9WOaKu2/5WNl.VRkd4OKWM1oIa23rBVqo940nRH7RhQIbr/u4u', 'Fh 21 shell camp', '2025-07-22 10:01:43', NULL, NULL, NULL),
(5, 'jaudu', 'Joy', 'Audu', 'audu5937@gmail.com', '09130043636', '$2y$10$u1BIsH3N7XJ70AMv0jlqCOLqsEMGnxOYOMDyABa8ZR1JU7FbXEu1O', 'Egbu', '2025-05-03 15:24:33', NULL, NULL, NULL),
(6, 'Zunny14', 'IZUNNA', 'NNAWUIHE', 'nnawuiheizunna@gmail.com', '08142291701', '$2y$10$4XeNDbu7QSSyNzr8IiLUNO8aa3xmAW3G5HbewAeLlHqdKF3W7giVi', 'Owerri', '2025-05-04 16:33:13', NULL, NULL, NULL),
(10, 'Chiomarrr_', 'Chioma ', 'Onyia', 'onyiachiomafavour893@gmail.com', '07045068482', '$2y$10$14BoeFqqqQzcFpvp0sZG0eel.8wZ5yxs0yEi77JoxV3HeWujeKNbm', 'Number 10 Garden Avenue Agbani Town', '2025-10-01 06:36:19', NULL, NULL, NULL),
(11, 'Mikkel10', 'Mike', 'Ndirika', 'mikendirika2k22@gmail.com', '09160801577', '$2y$10$TGU3g09lBY0hruP4IZ72VOktQ1vYcDTdN.oAp4EuZu2UBcSPbf9iq', 'Paul university Awka ', '2025-10-10 11:08:22', NULL, NULL, NULL),
(12, 'NGðŸ’•', 'Angel', 'Nwogu ', 'angelnwogu715@gmail.com', '09061542473', '$2y$10$n3vfvogNNTZSwpvPQXHz4uuuAu.rsL6Yuruos5MndLimWyXdKrivK', 'Phase 4, Kubwa ', '2025-12-18 14:42:52', NULL, NULL, NULL),
(13, 'Liberty ', 'Liberty ', 'Abia', 'abialiberty4950@gmail.com', '08100517826', '$2y$10$7PgObyaDEpQKPf/5zoLdg.kKlEfuJU1g41hCOZ6J.1h.M6zYmbTsO', 'University of Calabar, Calabar, Cross River State ', '2026-01-14 08:04:19', 'images/default_profile.jpg', '200L', NULL),
(14, 'Ogbuanya chiagozie nelson junior ', 'Chiagozie ', 'Ogbuanya ', 'Nelsonjnrleo@gmail.com', '07036505520', '$2y$10$Xukx85xkPEZOYh06WXbqIexZI59wSnp9dwcF.e5dZ3POiZiTYAJZa', 'Nile university of Nigeria ', '2026-02-01 10:02:13', NULL, NULL, NULL),
(15, 'Xxx', 'Xxx', 'Xxx', 'greysonavery52@gmail.com', '', '$2y$10$dDD8Lrnf35ohy6Tl2QhRUex06blpcEg6VxEDfDzkKj8Eh17YrTH2i', '', '2026-03-03 20:12:45', NULL, NULL, NULL),
(16, 'Blaise', 'Patrick', 'Uwalaka', 'patrickuwalaka18@gmail.com', '08100338435', '$2y$10$/sjKQBbZ0jbiKPnTCcOG9eXVwlZQ4LBlf0i5AcAxc/Ih4jtxkuIXi', 'Federal Housing Estate New Owerri', '2026-03-04 21:56:25', NULL, NULL, NULL),
(17, 'Joseph ', 'Gideon ', 'Oluwakayode ', 'josephgideon890@gmail.com', '09032819771', '$2y$10$/BQM1su.JjIsRsLjyVnbeOnXnZhxZoyADtrpgKJsfJhRJXYkQDZoa', '11, Kosebinu Street, Ogun State.', '2026-03-11 08:03:26', NULL, NULL, NULL),
(18, 'Kennedy ', 'Kennedy', 'Alpha', 'kennedyalpha1010@gmail.com', '07088998366', '$2y$10$mhb4RIgbq967aotbQGAaC.3EwlgsX9rNC2l3EUSLTV3Pee7aUmTXS', 'Unimaid ', '2026-03-22 21:10:18', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_news`
--

CREATE TABLE `user_news` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `read_at` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_news`
--

INSERT INTO `user_news` (`id`, `user_id`, `news_id`, `read_at`) VALUES
(1, 3, 1, '2025-05-03 02:19:11');

-- --------------------------------------------------------

--
-- Table structure for table `user_resources`
--

CREATE TABLE `user_resources` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `action` enum('view','download') NOT NULL,
  `action_date` datetime DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_resources`
--

INSERT INTO `user_resources` (`id`, `user_id`, `resource_id`, `action`, `action_date`) VALUES
(1, 3, 1, 'view', '2025-05-02 23:49:20'),
(2, 3, 1, 'download', '2025-05-03 02:19:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_code` (`course_code`,`level`,`semester`);

--
-- Indexes for table `elective_choices`
--
ALTER TABLE `elective_choices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`level`,`semester`,`elective_group`),
  ADD KEY `chosen_course_code` (`chosen_course_code`,`level`,`semester`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`course_code`,`level`,`semester`),
  ADD KEY `course_code` (`course_code`,`level`,`semester`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type_level` (`resource_type`,`level`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tasks_user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_news`
--
ALTER TABLE `user_news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `user_resources`
--
ALTER TABLE `user_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resource_id` (`resource_id`),
  ADD KEY `idx_user_resources_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `elective_choices`
--
ALTER TABLE `elective_choices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_news`
--
ALTER TABLE `user_news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_resources`
--
ALTER TABLE `user_resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
