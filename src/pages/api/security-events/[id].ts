import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { SecurityEvent } from '../../../types/SecurityEvent';

/**
 * セキュリティイベント詳細を取得するAPIエンドポイント
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

        // イベントIDの取得
        const { id } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: 'Invalid event ID',
                status: 400
            });
        }

        // JSONファイルからデータを読み込む
        const dataFilePath = path.join(process.cwd(), 'data', 'security_events.json');
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const events: SecurityEvent[] = JSON.parse(fileData);

        // IDに一致するイベントを検索
        const event = events.find(event => event.id === id);

        if (!event) {
            return res.status(404).json({
                message: 'Security event not found',
                status: 404
            });
        }

        // レスポンスを返す
        return res.status(200).json({
            data: event,
            status: 200,
            message: 'Success'
        });
    } catch (error) {
        console.error(`Error fetching security event with ID ${req.query.id}:`, error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        });
    }
}