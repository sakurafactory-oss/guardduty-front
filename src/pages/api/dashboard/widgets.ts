import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * ダッシュボードウィジェットAPIハンドラ
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

    // データファイルの読み込み
    const dataFilePath = path.join(process.cwd(), 'data', 'dashboard', 'widgets.json');
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileData);

    // レスポンスの返却
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error in widgets API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}