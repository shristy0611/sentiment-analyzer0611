import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn(() => ({
      getGenerativeModel: vi.fn(() => ({
        generateContent: vi.fn(async (text) => {
          if (text.includes('Great service')) {
            return {
              response: {
                text: () => 'Sentiment: Positive\nSatisfaction Score: 85%\nKey Points:\n- Customer is very satisfied\n- Service quality is praised'
              }
            };
          } else if (text.includes('Terrible service')) {
            return {
              response: {
                text: () => 'Sentiment: Negative\nSatisfaction Score: 30%\nKey Points:\n- Customer is disappointed\n- Service quality is poor'
              }
            };
          } else if (text === 'invalid_json') {
            return {
              response: {
                text: () => 'Invalid JSON response'
              }
            };
          } else {
            throw new Error('API Error');
          }
        })
      }))
    }))
  };
});

describe('Business Intelligence Analyzer', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders initial UI elements', () => {
    expect(screen.getByRole('heading', { name: /business intelligence analyzer/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter customer feedback/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze text/i })).toBeInTheDocument();
  });

  it('language switching functionality', async () => {
    const langButton = screen.getByRole('button', { name: /english/i });
    fireEvent.click(langButton);
    
    const japaneseOption = await screen.findByText('日本語');
    fireEvent.click(japaneseOption);
    
    expect(await screen.findByText('テキストを分析')).toBeInTheDocument();
  });

  it('handles empty input validation', () => {
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    fireEvent.click(analyzeButton);
    
    expect(screen.getByText(/please enter some text/i)).toBeInTheDocument();
  });

  it('processes positive feedback correctly', async () => {
    const textarea = screen.getByPlaceholderText(/enter customer feedback/i);
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    
    fireEvent.change(textarea, { target: { value: 'Great service! Very satisfied with the product.' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(async () => {
      expect(await screen.findByText(/positive/i)).toBeInTheDocument();
      expect(await screen.findByText(/85%/i)).toBeInTheDocument();
    });
  });

  it('processes negative feedback correctly', async () => {
    const textarea = screen.getByPlaceholderText(/enter customer feedback/i);
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    
    fireEvent.change(textarea, { target: { value: 'Terrible service, very disappointed!' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(async () => {
      expect(await screen.findByText(/negative/i)).toBeInTheDocument();
      expect(await screen.findByText(/30%/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const textarea = screen.getByPlaceholderText(/enter customer feedback/i);
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    
    fireEvent.change(textarea, { target: { value: 'trigger_error' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to analyze text/i)).toBeInTheDocument();
    });
  });

  it('handles parsing errors gracefully', async () => {
    const textarea = screen.getByPlaceholderText(/enter customer feedback/i);
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    
    fireEvent.change(textarea, { target: { value: 'invalid_json' } });
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to analyze text/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during analysis', async () => {
    const textarea = screen.getByPlaceholderText(/enter customer feedback/i);
    const analyzeButton = screen.getByRole('button', { name: /analyze text/i });
    
    fireEvent.change(textarea, { target: { value: 'Great service!' } });
    fireEvent.click(analyzeButton);
    
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/analyzing/i)).not.toBeInTheDocument();
    });
  });
}); 