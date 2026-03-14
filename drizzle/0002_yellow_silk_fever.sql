CREATE TABLE `brandProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`industry` varchar(100) NOT NULL,
	`primaryColor` varchar(7) NOT NULL,
	`secondaryColor` varchar(7) NOT NULL,
	`accentColor` varchar(7) NOT NULL,
	`logoUrl` text,
	`tagline` text,
	`targetAudience` text,
	`brandVoice` enum('professional','casual','playful','luxury','bold') DEFAULT 'professional',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brandProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `brandProfiles_userId_unique` UNIQUE(`userId`)
);
