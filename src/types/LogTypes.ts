/**
 * ログ関連の型定義
 * さくらセキュリティガードで収集・解析する各種ログの型定義
 */

/**
 * Webサーバーログの型定義
 * Apache, Nginxなどのアクセスログを表現
 */
export interface WebServerLog {
    id: string;
    timestamp: string;
    source_ip: string;
    method: string; // GET, POST, PUT, DELETE など
    path: string;
    status_code: number;
    user_agent: string;
    response_time: number; // ミリ秒
    request_size: number; // バイト
    response_size: number; // バイト
    server_name: string;
    additional_info?: Record<string, any>; // リファラーなどの追加情報
}

/**
 * 認証ログの型定義
 * SSH, sudo などの認証ログを表現
 */
export interface AuthLog {
    id: string;
    timestamp: string;
    source_ip: string;
    username: string;
    success: boolean;
    auth_method: string; // password, key, certificate など
    service: string; // ssh, sudo, web など
    server_name: string;
    additional_info?: Record<string, any>; // 試行回数などの追加情報
}

/**
 * システムログの型定義
 * syslog などのシステムログを表現
 */
export interface SystemLog {
    id: string;
    timestamp: string;
    hostname: string;
    facility: string; // kernel, auth, daemon など
    severity: string; // emergency, alert, critical, error, warning, notice, info, debug
    message: string;
    process_id?: number;
    process_name?: string;
    additional_info?: Record<string, any>; // CPU使用率などの追加情報
}

/**
 * ファイアウォールログの型定義
 * iptables, ufw などのファイアウォールログを表現
 */
export interface FirewallLog {
    id: string;
    timestamp: string;
    source_ip: string;
    destination_ip: string;
    source_port: number;
    destination_port: number;
    protocol: string; // TCP, UDP, ICMP など
    action: string; // ALLOW, BLOCK, DROP など
    rule_id: string;
    firewall_name: string;
    additional_info?: Record<string, any>; // ブロック理由などの追加情報
}

/**
 * 基本ログ型
 * 全てのログに共通するプロパティを定義
 */
export interface BaseLog {
    id: string;
    timestamp: string;
    log_type: string;
    raw_content: string;
    parsed: boolean;
    source_system: string;
}

/**
 * ログ収集設定の型定義
 */
export interface LogCollectionConfig {
    id: string;
    name: string;
    source_type: string; // file, syslog, api など
    path?: string; // ファイルパスやエンドポイントURL
    format: string; // json, text, csv など
    parser_config: Record<string, any>; // パーサー設定
    enabled: boolean;
    collection_interval: number; // 秒単位
    retention_period: number; // 日単位
}