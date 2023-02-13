SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `njs`
--

-- --------------------------------------------------------

--
-- Table structure for table `njs_follow`
--

CREATE TABLE `njs_follow` (
  `userId` int(11) NOT NULL COMMENT 'Who follows',
  `followedUser` int(11) NOT NULL COMMENT 'The followed user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `njs_follow`
--

INSERT INTO `njs_follow` (`userId`, `followedUser`) VALUES
(8, 9),
(8, 10),
(10, 9);

-- --------------------------------------------------------

--
-- Table structure for table `njs_like`
--

CREATE TABLE `njs_like` (
  `userId` int(11) NOT NULL COMMENT 'Who likes the message',
  `messageId` int(11) NOT NULL COMMENT 'The message liked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `njs_like`
--

INSERT INTO `njs_like` (`userId`, `messageId`) VALUES
(8, 20),
(8, 22),
(8, 23),
(8, 24),
(9, 20),
(9, 23),
(9, 24),
(10, 20),
(10, 23),
(10, 24);

-- --------------------------------------------------------

--
-- Table structure for table `njs_message`
--

CREATE TABLE `njs_message` (
  `messageId` int(11) NOT NULL,
  `userId` int(11) NOT NULL COMMENT 'Who writes the message',
  `writedOn` datetime NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `njs_message`
--

INSERT INTO `njs_message` (`messageId`, `userId`, `writedOn`, `content`) VALUES
(20, 8, '2023-02-12 21:04:07', 'Sed elementum risus vitae ante tempus dignissim. Morbi vehicula porta lectus, in pharetra eros. Suspendisse tincidunt, justo vel pharetra mattis, urna tellus suscipit arcu, ut accumsan ante lectus id risus. Nam tincidunt dictum est, et luctus diam euismod euismod. Vestibulum dapibus velit sed augue lobortis malesuada. Etiam semper, lectus id dictum tempus, ligula massa convallis magna, vel dapibus arcu nisi rutrum justo. Mauris faucibus venenatis enim, consequat consectetur ipsum mattis blandit. Suspendisse fermentum nisi ut dolor aliquam fringilla.'),
(21, 8, '2023-02-10 13:04:07', 'Suspendisse dignissim arcu at elit varius sagittis. Cras elementum interdum congue. Ut sed pretium quam, vel tristique justo. Aenean consequat felis eget tortor accumsan, a mattis est venenatis.'),
(22, 8, '2023-02-13 13:05:00', 'Sed ut porttitor ante, vitae accumsan turpis. Praesent luctus tortor et finibus suscipit. Quisque volutpat pharetra nibh at fermentum. Pellentesque ultrices magna at felis pretium, sit amet finibus nisi vehicula.'),
(23, 9, '2023-02-11 14:05:01', 'Quisque feugiat enim sed sapien pretium, faucibus placerat nisi faucibus. Nunc eget sapien nunc. Sed viverra ipsum ut rhoncus ultrices. Aliquam interdum magna ac metus vehicula semper.'),
(24, 8, '2023-02-10 23:05:52', 'Maecenas vel mauris ante. Duis eget sapien ultrices, fringilla odio a, tristique nulla. Nulla sed hendrerit leo.');

-- --------------------------------------------------------

--
-- Table structure for table `njs_user`
--

CREATE TABLE `njs_user` (
  `userId` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `surname` varchar(32) NOT NULL,
  `bio` text NOT NULL,
  `password` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `njs_user`
--

INSERT INTO `njs_user` (`userId`, `username`, `name`, `surname`, `bio`, `password`) VALUES
(8, 'andrea01', 'andrea', 'ivkovic', 'Nunc lacus nibh, interdum in leo non, ultrices mollis diam. Donec convallis sapien nec lectus finibus placerat. Donec egestas tristique justo auctor aliquet.', '123456'),
(9, 'emanu01', 'emanuele', 'rossi', 'Aenean hendrerit rutrum risus et vulputate. Nunc blandit sed arcu id mollis. Quisque lacus ante, eleifend nec nisi ut, porta finibus arcu. Vivamus ultrices lectus interdum consectetur hendrerit. Curabitur semper enim sit amet turpis dictum hendrerit.', '123456'),
(10, 'dave01', 'davide', 'collani', 'Sed eget eros nec justo imperdiet laoreet. Sed non nulla iaculis, maximus est eget, tristique metus. In sed sagittis massa. Donec vel orci nunc.', '123456');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `njs_follow`
--
ALTER TABLE `njs_follow`
  ADD PRIMARY KEY (`userId`,`followedUser`),
  ADD KEY `followedUser` (`followedUser`);

--
-- Indexes for table `njs_like`
--
ALTER TABLE `njs_like`
  ADD PRIMARY KEY (`userId`,`messageId`),
  ADD KEY `messageId` (`messageId`);

--
-- Indexes for table `njs_message`
--
ALTER TABLE `njs_message`
  ADD PRIMARY KEY (`messageId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `njs_user`
--
ALTER TABLE `njs_user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `njs_message`
--
ALTER TABLE `njs_message`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `njs_user`
--
ALTER TABLE `njs_user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `njs_follow`
--
ALTER TABLE `njs_follow`
  ADD CONSTRAINT `njs_follow_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `njs_user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `njs_follow_ibfk_2` FOREIGN KEY (`followedUser`) REFERENCES `njs_user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `njs_like`
--
ALTER TABLE `njs_like`
  ADD CONSTRAINT `njs_like_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `njs_user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `njs_like_ibfk_2` FOREIGN KEY (`messageId`) REFERENCES `njs_message` (`messageId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `njs_message`
--
ALTER TABLE `njs_message`
  ADD CONSTRAINT `njs_message_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `njs_user` (`userId`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
