import { render, screen } from '@testing-library/react'
import Home from '../index'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}))

describe('Home', () => {
  it('renders the header', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /さくらセキュリティガード/i,
    })
    
    expect(heading).toBeInTheDocument()
  })
  
  it('renders the event form', () => {
    render(<Home />)
    
    const formHeading = screen.getByRole('heading', {
      name: /新規セキュリティイベント/i,
    })
    
    const sourceIpInput = screen.getByLabelText(/送信元IP/i)
    const eventTypeInput = screen.getByLabelText(/イベントタイプ/i)
    const severityInput = screen.getByLabelText(/重要度/i)
    const detailsInput = screen.getByLabelText(/詳細/i)
    const submitButton = screen.getByRole('button', { name: /イベントを作成/i })
    
    expect(formHeading).toBeInTheDocument()
    expect(sourceIpInput).toBeInTheDocument()
    expect(eventTypeInput).toBeInTheDocument()
    expect(severityInput).toBeInTheDocument()
    expect(detailsInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
  
  it('renders the event list section', () => {
    render(<Home />)
    
    const listHeading = screen.getByRole('heading', {
      name: /セキュリティイベント一覧/i,
    })
    
    expect(listHeading).toBeInTheDocument()
    expect(screen.getByText(/読み込み中/i)).toBeInTheDocument()
  })
})
