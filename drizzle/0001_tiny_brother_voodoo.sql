CREATE TABLE `promoBundles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`flyerUrl` text,
	`storyUrl` text,
	`feedPostUrl` text,
	`videoUrl` text,
	`headline` text,
	`caption` text,
	`hooks` text,
	`cta` text,
	`videoEngine` enum('veo','sora','none') DEFAULT 'none',
	`watermarked` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `promoBundles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','pro','agency') NOT NULL DEFAULT 'free',
	`generationsThisMonth` int NOT NULL DEFAULT 0,
	`soraCreditsRemaining` int NOT NULL DEFAULT 0,
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `themeSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`presetId` varchar(64) NOT NULL,
	`accentColor` varchar(7) NOT NULL,
	`gradientStart` varchar(7) NOT NULL,
	`gradientEnd` varchar(7) NOT NULL,
	`blurIntensity` int NOT NULL,
	`glassOpacity` int NOT NULL,
	`cornerRadius` int NOT NULL,
	`shadowDepth` enum('small','medium','large') NOT NULL,
	`grainAmount` int NOT NULL,
	`animationIntensity` enum('low','medium','high') NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `themeSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `themeSettings_userId_unique` UNIQUE(`userId`)
);
