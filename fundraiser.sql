

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fundraisers`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Health'),
(2, 'Education'),
(3, 'Environment'),
(4, 'Animal Welfare'),
(5, 'Arts and Culture');

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fundraisers`
--

INSERT INTO `fundraisers` (`id`, `category_id`, `organizer`, `caption`, `city`, `current_fund`, `active`, `target_fund`) VALUES
(1, 1, 'Health NGO', 'Support local health initiatives', 'New York', 15000, 1, 50000),
(2, 2, 'EduFund', 'Help students get scholarships', 'Los Angeles', 30000, 1, 100000),
(3, 3, 'EcoGroup', 'Protect our forests', 'San Francisco', 5000, 1, 25000),
(4, 4, 'Animal Rescue', 'Save abandoned pets', 'Miami', 20000, 1, 75000),
(5, 5, 'Art Foundation', 'Promote local artists', 'Chicago', 8000, 1, 40000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
