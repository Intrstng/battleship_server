interface WebSocket {
    _events: {
        close: () => void;
    };
    _eventsCount: number;
    _maxListeners: undefined | number;
    _binaryType: 'nodebuffer';
    _closeCode: number;
    _closeFrameReceived: boolean;
    _closeFrameSent: boolean;
    _closeMessage: Buffer;
    _closeTimer: null | NodeJS.Timeout;
    _extensions: Record<string, any>;
    _paused: boolean;
    _protocol: string;
    _readyState: number;
    _receiver: Receiver;
    _sender: Sender;
    _socket: Socket;
    _isServer: boolean;
}