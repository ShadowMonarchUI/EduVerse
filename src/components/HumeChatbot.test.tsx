import React from 'react';
import { render, screen } from '@testing-library/react';
import HumeChatbot from './HumeChatbot';

// Mock the HumeClient and related modules
jest.mock('hume', () => ({
  HumeClient: jest.fn().mockImplementation(() => ({
    empathicVoice: {
      chat: {
        connect: jest.fn().mockResolvedValue({
          on: jest.fn(),
          close: jest.fn(),
        }),
      },
    },
  })),
  getAudioStream: jest.fn().mockResolvedValue(new MediaStream()),
  convertBlobToBase64: jest.fn().mockResolvedValue('base64data'),
  getBrowserSupportedMimeType: jest.fn().mockReturnValue({ success: true, mimeType: 'audio/webm' }),
  MimeType: { WEBM: 'audio/webm' },
  EVIWebAudioPlayer: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    enqueue: jest.fn(),
    stop: jest.fn(),
    dispose: jest.fn(),
  })),
}));

describe('HumeChatbot', () => {
  test('renders without crashing', () => {
    render(<HumeChatbot />);
    expect(screen.getByText('Study Buddy')).toBeInTheDocument();
  });

  test('displays initial greeting message', () => {
    render(<HumeChatbot />);
    expect(screen.getByText(/Hi there! I'm your Study Buddy/i)).toBeInTheDocument();
  });

  test('shows suggested questions', () => {
    render(<HumeChatbot />);
    expect(screen.getByText(/How has your day been going so far?/i)).toBeInTheDocument();
  });
});