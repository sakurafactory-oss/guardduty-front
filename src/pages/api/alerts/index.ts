import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Alert } from '../../../types/AlertTypes';

/**
 * アラート一覧を取得するAPIエンドポイント
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

    // クエリパラメータの取得
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const severity = req.query.severity as string;
    const status = req.query.status as string;

    // モックデータの読み込み
    const dataFilePath = path.join(process.cwd(), 'data', 'alerts', 'alerts.json');
    
    // ファイルが存在するか確認
    if (!fs.existsSync(dataFilePath)) {
      console.error(`File not found: ${dataFilePath}`);
      return res.status(404).json({ message: 'Alerts data file not found' });
    }
    
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    let alerts: Alert[] = [];
    
    try {
      const parsedData = JSON.parse(fileContents);
      // データが { alerts: [...] } 形式の場合と配列の場合の両方に対応
      alerts = parsedData.alerts || (Array.isArray(parsedData) ? parsedData : []);
    } catch (parseError) {
      console.error('Error parsing alerts JSON:', parseError);
      return res.status(500).json({ message: 'Error parsing alerts data' });
    }

    // フィルタリング
    let filteredAlerts = Array.isArray(alerts) ? [...alerts] : [];
    
    if (severity && severity !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    if (status && status !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }

    // ページネーション
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

    // レスポンスの返却
    return res.status(200).json({
      data: paginatedAlerts,
      pagination: {
        total: filteredAlerts.length,
        page,
        per_page: perPage,
        total_pages: Math.ceil(filteredAlerts.length / perPage)
      }
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}