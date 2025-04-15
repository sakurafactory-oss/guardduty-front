import { render, screen } from '@testing-library/react'
import Home from '../index'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('../../hooks/useApi', () => ({
  useGetApi: jest.fn().mockReturnValue({
    data: null,
    loading: true,
    error: null,
    execute: jest.fn()
  })
}))

// Next.jsのLinkコンポーネントをモック
jest.mock('next/link', () => {
  return ({ children, className, href }: { children: React.ReactNode, className?: string, href: string }) => {
    return (
      <a href={href} className={className} data-testid="mock-link">
        {children}
      </a>
    );
  };
});

describe('Home', () => {
  it('renders the header', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /さくらセキュリティガード/i,
    })
    
    expect(heading).toBeInTheDocument()
  })
  
  it('renders navigation links', () => {
    render(<Home />)
    
    // data-testidを使用してリンクを検索
    const links = screen.getAllByTestId('mock-link')
    const dashboardLink = links.find(link => link.textContent?.includes('ダッシュボード'))
    const eventsLink = links.find(link => link.textContent?.includes('イベント一覧'))
    
    expect(dashboardLink).toBeInTheDocument()
    expect(eventsLink).toBeInTheDocument()
  })
  
  it('renders the dashboard section', () => {
    render(<Home />)
    
    const dashboardHeading = screen.getByRole('heading', {
      name: /セキュリティ監視ダッシュボード/i,
    })
    
    expect(dashboardHeading).toBeInTheDocument()
    expect(screen.getByText(/さくらセキュリティガードへようこそ/i)).toBeInTheDocument()
  })
  
  it('renders the main feature card', () => {
    render(<Home />)
    
    const featuresHeading = screen.getByRole('heading', {
      name: /主要機能/i,
    })
    
    expect(featuresHeading).toBeInTheDocument()
    expect(screen.getByText(/セキュリティイベント監視/i)).toBeInTheDocument()
    expect(screen.getByText(/リアルタイムアラート/i)).toBeInTheDocument()
    expect(screen.getByText(/脅威インテリジェンス/i)).toBeInTheDocument()
    expect(screen.getByText(/セキュリティレポート/i)).toBeInTheDocument()
  })
  
  it('renders the statistics card', () => {
    render(<Home />)
    
    const statsHeading = screen.getByRole('heading', {
      name: /イベント統計/i,
    })
    
    expect(statsHeading).toBeInTheDocument()
    
    // テキストノードを直接検索するのではなく、要素を検索
    const severityLabels = screen.getAllByText(/重大|高|中|低/i)
    expect(severityLabels.length).toBeGreaterThanOrEqual(4)
    
    // 各重要度ラベルが存在することを確認
    expect(severityLabels.some(label => label.textContent === '重大')).toBeTruthy()
    expect(severityLabels.some(label => label.textContent === '高')).toBeTruthy()
    expect(severityLabels.some(label => label.textContent === '中')).toBeTruthy()
    expect(severityLabels.some(label => label.textContent === '低')).toBeTruthy()
  })
  
  it('renders the quick access card', () => {
    render(<Home />)
    
    const quickAccessHeading = screen.getByRole('heading', {
      name: /クイックアクセス/i,
    })
    
    expect(quickAccessHeading).toBeInTheDocument()
    
    // クイックアクセスリンクの確認
    const quickLinks = screen.getAllByTestId('mock-link')
    const linkTexts = quickLinks.map(link => link.textContent)
    
    expect(linkTexts.some(text => text?.includes('イベント一覧'))).toBeTruthy()
    expect(linkTexts.some(text => text?.includes('ダッシュボード'))).toBeTruthy()
    expect(linkTexts.some(text => text?.includes('アラート'))).toBeTruthy()
    expect(linkTexts.some(text => text?.includes('設定'))).toBeTruthy()
  })
  
  it('renders the latest events section', () => {
    render(<Home />)
    
    const latestEventsHeading = screen.getByRole('heading', {
      name: /最新のセキュリティイベント/i,
    })
    
    expect(latestEventsHeading).toBeInTheDocument()
    
    // ローディング中の表示
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
