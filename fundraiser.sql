SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crowdfundraisers_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `fundraisers`
--

CREATE TABLE `fundraisers` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `organizer` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `current_fund` bigint(20) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `target_fund` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `fundraisers`
--
INSERT INTO `fundraisers` (`id`, `category_id`, `organizer`, `caption`, `city`, `current_fund`, `active`, `target_fund`) VALUES
(1, 1, 'Health NGO', 'Support local health initiatives', 'New York', 15000, 1, 50000),
(2, 2, 'EduFund', 'Help students get scholarships', 'Los Angeles', 30000, 1, 100000),
(3, 3, 'EcoGroup', 'Protect our forests', 'San Francisco', 5000, 1, 25000),
(4, 4, 'Animal Rescue', 'Save abandoned pets', 'Miami', 20000, 1, 75000),
(5, 5, 'Art Foundation', 'Promote local artists', 'Chicago', 8000, 1, 40000),
(6, 2, 'peter_johnson', 'Johnson Wildlife Fund', 'Dallas', 4000, 1, 20000),
(7, 4, 'anna_taylor', 'Taylor Homeless Shelter', 'Austin', 13000, 1, 25000),
(8, 1, 'linda_evans', 'Evans Childcare Fund', 'San Diego', 9000, 1, 18000),
(9, 3, 'mark_white', 'White Education Trust', 'San Francisco', 15000, 1, 40000),
(10, 4, 'chris_green', 'Green Tech Fund', 'Boston', 5000, 1, 35000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fundraisers`
--
ALTER TABLE `fundraisers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fundraisers`
--
ALTER TABLE `fundraisers`
  ADD CONSTRAINT `fundraisers_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

