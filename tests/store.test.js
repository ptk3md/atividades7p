import { Store } from '../js/core/Store.js';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    clear: () => store = {}
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Store Core', () => {
    let store;

    beforeEach(() => {
        store = new Store();
        localStorage.clear();
    });

    test('should initialize with default state', () => {
        expect(store.state.filterDisc).toBe('Todas');
        expect(store.state.events).toEqual([]);
    });

    test('should update state via setState', () => {
        store.setState({ filterDisc: 'Ortopedia' });
        expect(store.state.filterDisc).toBe('Ortopedia');
    });

    test('should notify subscribers on state change', () => {
        const mockCallback = jest.fn();
        store.subscribe('stateChange', mockCallback);

        store.setState({ searchTerm: 'test' });
        
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(
            expect.objectContaining({ searchTerm: 'test' }), 
            expect.objectContaining({ searchTerm: 'test' })
        );
    });

    test('should persist theme to localStorage', () => {
        store.setTheme('light');
        expect(localStorage.getItem('theme')).toBe('light');
        expect(store.state.theme).toBe('light');
    });
});
