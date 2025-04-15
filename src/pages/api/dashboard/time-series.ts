import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * ダッシュボード用時系列データAPIハンドラ
 * 
 * @param req - Next.js API リクエスト
 * @param res - Next.js API レスポンス
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // リクエストメソッドの確認
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // クエリパラメータの取得
    const { time_range = '7d' } = req.query;

    // データファイルの読み込み
    const dataFilePath = path.join(process.cwd(), 'data', 'dashboard', 'time_series_data.json');
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // 時間範囲に応じたフィルタリング（実際のAPIでは実装する）
    // 現在はモックデータをそのまま返す

    // レスポンスの返却
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error in time-series API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}