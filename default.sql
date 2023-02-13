SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

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
-- Table structure for table `njs_like`
--

CREATE TABLE `njs_like` (
  `userId` int(11) NOT NULL COMMENT 'Who likes the message',
  `messageId` int(11) NOT NULL COMMENT 'The message liked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `njs_message`
--

CREATE TABLE `njs_message` (
  `messageId` int(11) NOT NULL,
  `userId` int(11) NOT NULL COMMENT 'Who writes the message',
  `writedOn` datetime NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `njs_user`
--
ALTER TABLE `njs_user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
