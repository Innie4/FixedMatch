import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { renderHook, act } from '@testing-library/react';

describe('WebSocket Hook', () => {
  const mockWebSocket = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    close: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    class MockWebSocket {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      close = vi.fn();
      // Add other required properties/methods as needed
    }
    global.WebSocket = MockWebSocket as any;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should connect to WebSocket', () => {
    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    expect(global.WebSocket).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_WS_URL);
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should handle incoming messages', () => {
    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    const mockData = {
      type: 'PREDICTIONS_UPDATED',
      payload: {
        predictions: [
          {
            id: '1',
            league: 'Premier League',
            homeTeam: 'Arsenal',
            awayTeam: 'Chelsea',
            prediction: 'Home Win',
            confidence: 'High',
          },
        ],
      },
    };

    act(() => {
      messageHandler({ data: JSON.stringify(mockData) });
    });

    expect(result.current.data).toEqual(mockData.payload);
    expect(result.current.error).toBeNull();
  });

  it('should handle WebSocket errors', () => {
    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    const errorHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'error'
    )[1];

    act(() => {
      errorHandler(new Error('WebSocket error'));
    });

    expect(result.current.error).toBe('WebSocket error');
  });

  it('should clean up on unmount', () => {
    const { unmount } = renderHook(() => useRealTimeUpdates('predictions'));

    unmount();

    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('should handle connection errors', () => {
    const mockError = new Error('Connection failed');
    (global.WebSocket as any).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    expect(result.current.error).toBe('Connection failed');
  });

  it('should handle invalid message format', () => {
    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    act(() => {
      messageHandler({ data: 'invalid json' });
    });

    expect(result.current.error).toBe('Invalid message format');
  });

  it('should handle different event types', () => {
    const { result } = renderHook(() => useRealTimeUpdates('packages'));

    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    const mockData = {
      type: 'PACKAGES_UPDATED',
      payload: {
        packages: [
          {
            id: '1',
            name: 'Premium',
            price: 100,
            features: ['feature1', 'feature2'],
          },
        ],
      },
    };

    act(() => {
      messageHandler({ data: JSON.stringify(mockData) });
    });

    expect(result.current.data).toEqual(mockData.payload);
  });

  it('should update lastUpdate timestamp', () => {
    const { result } = renderHook(() => useRealTimeUpdates('predictions'));

    const messageHandler = mockWebSocket.addEventListener.mock.calls.find(
      call => call[0] === 'message'
    )[1];

    const mockData = {
      type: 'PREDICTIONS_UPDATED',
      payload: {
        predictions: [],
      },
    };

    act(() => {
      messageHandler({ data: JSON.stringify(mockData) });
    });

    expect(result.current.lastUpdate).toBeInstanceOf(Date);
  });
}); 