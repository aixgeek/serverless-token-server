
CREATE TABLE `realm` (
	`id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`config` json NULL,
	`logic_code` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`comment` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC AVG_ROW_LENGTH=0;

CREATE TABLE `secret` (
	`key` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`realm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`key_1` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`key_2` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`key_3` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`key_4` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`key_5` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`token` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
	`expires_at` bigint NULL,
	PRIMARY KEY (`key`,`realm`),
	KEY `idx_secret_realm`(`realm`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC AVG_ROW_LENGTH=0;

INSERT INTO `realm` (`comment`, `config`, `id`) VALUES ('企业微信-企业内部开发接口的调用凭据（access_token）
 https://developer.work.weixin.qq.com/document/path/91039','{"url": "https://qyapi.weixin.qq.com/cgi-bin/gettoken", "method": "GET", "arguments": [{"name": "corpid", "place": "url", "value": "$key_1"}, {"name": "corpsecret", "place": "url", "value": "$key_2"}], "token_path": "access_token", "content_type": "json", "expires_in_path": "expires_in"}','qywx_qynbkf');

