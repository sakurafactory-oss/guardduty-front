import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { SecurityEvent } from '../../../types/SecurityEvent';

/**
 * セキュリティイベント一覧を取得するAPIエンドポイント
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // リクエストメソッドの確認
        if (req.method !== 'GET') {
            return res.status(405).json({
                message: 'Method Not Allowed',
                status: 405
            });
        }

        // クエリパラメータの取得
        const page = parseInt(req.query.page as string) || 1;
        const per_page = parseInt(req.query.per_page as string) || 10;
        const severity = req.query.severity as string | undefined;
        const event_type = req.query.event_type as string | undefined;
        const start_date = req.query.start_date as string | undefined;
        const end_date = req.query.end_date as string | undefined;

        // JSONファイルからデータを読み込む
        const dataFilePath = path.join(process.cwd(), 'data', 'security_events.json');
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const events: SecurityEvent[] = JSON.parse(fileData);

        // フィルタリング
        let filteredEvents = [...events];

        // 重要度でフィルタリング
        if (severity) {
            filteredEvents = filteredEvents.filter(event => event.severity === severity);
        }

        // イベントタイプでフィルタリング
        if (event_type) {
            filteredEvents = filteredEvents.filter(event => event.event_type === event_type);
        }

        // 日付範囲でフィルタリング
        if (start_date) {
            const startTimestamp = new Date(start_date).getTime();
            filteredEvents = filteredEvents.filter(event => {
                const eventTimestamp = new Date(event.timestamp).getTime();
                return eventTimestamp >= startTimestamp;
            });
        }

        if (end_date) {
            const endTimestamp = new Date(end_date).getTime();
            filteredEvents = filteredEvents.filter(event => {
                const eventTimestamp = new Date(event.timestamp).getTime();
                return eventTimestamp <= endTimestamp;
            });
        }

        // 日付の降順でソート
        filteredEvents.sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        // ページネーション
        const total = filteredEvents.length;
        const total_pages = Math.ceil(total / per_page);
        const start = (page - 1) * per_page;
        const end = start + per_page;
        const paginatedEvents = filteredEvents.slice(start, end);

        // レスポンスを返す
        return res.status(200).json({
            data: paginatedEvents,
            pagination: {
                total,
                page,
                per_page,
                total_pages
            },
            status: 200,
            message: 'Success'
        });
    } catch (error) {
        console.error('Error fetching security events:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        });
    }
}