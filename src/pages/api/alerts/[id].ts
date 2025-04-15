import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Alert } from '../../../types/AlertTypes';

/**
 * 特定のアラートの詳細を取得するAPIエンドポイント
 * 
 * @param req - リクエストオブジェクト
 * @param res - レスポンスオブジェクト
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // リクエストメソッドの確認
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // アラートIDの取得
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }

    // モックデータの読み込み
    const dataFilePath = path.join(process.cwd(), 'data', 'alerts', 'alerts.json');
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const alerts: Alert[] = JSON.parse(fileContents);

    // 指定されたIDのアラートを検索
    const alert = alerts.find(alert => alert.id === id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // アラート詳細の返却
    return res.status(200).json(alert);
  } catch (error) {
    console.error('Error fetching alert details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}